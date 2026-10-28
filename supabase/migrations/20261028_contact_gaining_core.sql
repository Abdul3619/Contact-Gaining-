-- ============================================================================
-- Contact Gaining — Core Database Architecture & Security Enforcement
-- Migration: 20261028_contact_gaining_core.sql
-- Database: Supabase PostgreSQL (qwppwilumpokakzpusmo)
-- ============================================================================

-- 1. ENFORCE TABLE INTEGRITY & CONSTRAINTS
-- Members status must be 'pending', 'active', or 'suspended'.
-- Voluntary consent withdrawal is modeled separately in consent_records.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'members_status_check'
  ) THEN
    ALTER TABLE IF EXISTS public.members
      ADD CONSTRAINT members_status_check 
      CHECK (status IN ('pending', 'active', 'suspended'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'consent_records_type_check'
  ) THEN
    ALTER TABLE IF EXISTS public.consent_records
      ADD CONSTRAINT consent_records_type_check 
      CHECK (consent_type IN ('contact_distribution', 'privacy_policy', 'terms'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contact_allocations_no_self_alloc'
  ) THEN
    ALTER TABLE IF EXISTS public.contact_allocations
      ADD CONSTRAINT contact_allocations_no_self_alloc
      CHECK (recipient_member_id <> contact_member_id);
  END IF;
END $$;

-- 2. DEDUPLICATION & PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_members_phone_e164 ON public.members (phone_e164);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members (status);
CREATE INDEX IF NOT EXISTS idx_consent_member_type ON public.consent_records (member_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_allocations_recipient ON public.contact_allocations (recipient_member_id);
CREATE INDEX IF NOT EXISTS idx_allocations_pair ON public.contact_allocations (recipient_member_id, contact_member_id);

-- 3. ENABLE ROW LEVEL SECURITY ON ALL PLATFORM TABLES
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 4. ROW LEVEL SECURITY POLICIES

-- Members: Users can only read & write their own profile
DROP POLICY IF EXISTS "Members can view own profile" ON public.members;
CREATE POLICY "Members can view own profile"
  ON public.members FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Members can update own profile" ON public.members;
CREATE POLICY "Members can update own profile"
  ON public.members FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Members can insert own profile upon registration" ON public.members;
CREATE POLICY "Members can insert own profile upon registration"
  ON public.members FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Consent Records: Members can view and insert their own versioned consent entries
DROP POLICY IF EXISTS "Members can view own consent records" ON public.consent_records;
CREATE POLICY "Members can view own consent records"
  ON public.consent_records FOR SELECT
  USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Members can insert own consent records" ON public.consent_records;
CREATE POLICY "Members can insert own consent records"
  ON public.consent_records FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- Contact Allocations: Members can view their own allocated contacts
DROP POLICY IF EXISTS "Members can view their own allocated contacts" ON public.contact_allocations;
CREATE POLICY "Members can view their own allocated contacts"
  ON public.contact_allocations FOR SELECT
  USING (auth.uid() = recipient_member_id);

-- Download Logs: Members can view and insert their own download activity
DROP POLICY IF EXISTS "Members can view own download logs" ON public.download_logs;
CREATE POLICY "Members can view own download logs"
  ON public.download_logs FOR SELECT
  USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Members can log own downloads" ON public.download_logs;
CREATE POLICY "Members can log own downloads"
  ON public.download_logs FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- Admin Roles: Only users with admin role or superadmin can read admin table
DROP POLICY IF EXISTS "Admins can view admin_roles" ON public.admin_roles;
CREATE POLICY "Admins can view admin_roles"
  ON public.admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role IN ('admin', 'superadmin')
    )
  );

-- Contact Releases: Publicly viewable by authenticated members
DROP POLICY IF EXISTS "Members can view releases" ON public.contact_releases;
CREATE POLICY "Members can view releases"
  ON public.contact_releases FOR SELECT
  USING (status = 'published');

-- Platform Settings: Read-only for authenticated users
DROP POLICY IF EXISTS "Public settings view" ON public.platform_settings;
CREATE POLICY "Public settings view"
  ON public.platform_settings FOR SELECT
  USING (true);

-- 5. SECURE DATABASE ALLOCATION FUNCTION
-- Server-side security boundary preventing client manipulation of contact allocations
CREATE OR REPLACE FUNCTION public.allocate_contacts_for_member(
  p_recipient_id UUID,
  p_requested_count INT DEFAULT 20
)
RETURNS TABLE (
  allocated_member_id UUID,
  contact_display_name TEXT,
  contact_country_code TEXT,
  contact_phone_e164 TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_recipient_status TEXT;
  v_recipient_phone TEXT;
  v_has_active_consent BOOLEAN;
BEGIN
  -- Strict Authorization: The calling session must match the recipient ID
  IF auth.uid() IS NULL OR auth.uid() <> p_recipient_id THEN
    RAISE EXCEPTION 'Unauthorized: Caller cannot allocate contacts for another member.';
  END IF;

  -- Verify recipient account status
  SELECT status, phone_e164 INTO v_recipient_status, v_recipient_phone
  FROM public.members
  WHERE id = p_recipient_id;

  IF v_recipient_status IS NULL OR v_recipient_status <> 'active' THEN
    RAISE EXCEPTION 'Recipient account is not active.';
  END IF;

  -- Verify recipient active unwithdrawn consent for contact_distribution
  SELECT (granted AND withdrawn_at IS NULL) INTO v_has_active_consent
  FROM public.consent_records
  WHERE member_id = p_recipient_id AND consent_type = 'contact_distribution'
  ORDER BY id DESC
  LIMIT 1;

  IF v_has_active_consent IS NOT TRUE THEN
    RAISE EXCEPTION 'Recipient has withdrawn contact sharing consent. Must be consenting to receive contacts.';
  END IF;

  -- Select eligible candidate contacts and insert allocations atomically
  RETURN QUERY
  WITH eligible_candidates AS (
    SELECT 
      m.id AS cand_id,
      m.display_name AS cand_name,
      m.country_code AS cand_country,
      m.phone_e164 AS cand_phone
    FROM public.members m
    -- Exclude self by ID and phone
    WHERE m.id <> p_recipient_id
      AND m.phone_e164 <> v_recipient_phone
      AND m.status = 'active'
      -- Exclude already allocated
      AND NOT EXISTS (
        SELECT 1 FROM public.contact_allocations ca
        WHERE ca.recipient_member_id = p_recipient_id
          AND ca.contact_member_id = m.id
      )
      -- Require active unrevoked consent for contact_distribution
      AND EXISTS (
        SELECT 1 FROM public.consent_records cr
        WHERE cr.member_id = m.id
          AND cr.consent_type = 'contact_distribution'
          AND cr.granted = true
          AND cr.withdrawn_at IS NULL
      )
    ORDER BY m.created_at DESC
    LIMIT LEAST(p_requested_count, 50)
  ),
  inserted_allocations AS (
    INSERT INTO public.contact_allocations (recipient_member_id, contact_member_id, allocated_at)
    SELECT p_recipient_id, ec.cand_id, NOW()
    FROM eligible_candidates ec
    RETURNING contact_member_id
  )
  SELECT 
    ec.cand_id,
    ec.cand_name,
    ec.cand_country,
    ec.cand_phone
  FROM eligible_candidates ec
  JOIN inserted_allocations ia ON ec.cand_id = ia.contact_member_id;
END;
$$;

-- Grant execution to authenticated users only
REVOKE EXECUTE ON FUNCTION public.allocate_contacts_for_member(UUID, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.allocate_contacts_for_member(UUID, INT) TO authenticated;
