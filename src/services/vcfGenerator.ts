/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsentedContactExport {
  id: string;
  displayName: string;
  normalizedE164: string;
  countryCode?: string;
  referralCode?: string;
}

export interface SampleVCardContact {
  fullName: string;
  phone: string;
  country: string;
  organization: string;
  note: string;
}

/**
 * Escapes characters for vCard text values according to RFC 2426.
 */
function escapeVCardText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Generates an RFC 2426 standard vCard 3.0 text payload from actual allocated, consented records.
 * 
 * Rules enforced:
 * - Excludes recipient's own number.
 * - Deduplicates numbers by normalized E.164.
 * - Escapes special characters properly.
 * - Uses proper CRLF line breaks.
 */
export function generateRealVcfString(
  contacts: ConsentedContactExport[],
  recipientNormalizedPhone?: string
): { vcfString: string; count: number } {
  const lines: string[] = [];
  const seenNumbers = new Set<string>();

  for (const c of contacts) {
    const phone = c.normalizedE164?.trim();
    if (!phone) continue;

    // Strict safety check: Never include recipient's own phone number
    if (recipientNormalizedPhone && phone === recipientNormalizedPhone.trim()) {
      continue;
    }

    // Deduplicate phone numbers
    if (seenNumbers.has(phone)) {
      continue;
    }
    seenNumbers.add(phone);

    const safeName = escapeVCardText(c.displayName.trim() || 'WhatsApp Community Member');

    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    lines.push(`FN:CG · ${safeName}`);
    lines.push(`N:${safeName};;;;`);
    lines.push(`TEL;TYPE=CELL,VOICE:${phone}`);
    lines.push(`NOTE:Contact Gaining member. Consented voluntary contact exchange participant.`);
    lines.push('CATEGORIES:Contact Gaining Network');
    lines.push('END:VCARD');
  }

  return {
    vcfString: lines.join('\r\n'),
    count: seenNumbers.size,
  };
}

/**
 * Legacy compatibility wrapper for simulated downloads
 */
export function generateVcfString(contacts: SampleVCardContact[], _releaseTitle?: string): string {
  const exportItems: ConsentedContactExport[] = contacts.map(c => ({
    id: c.phone,
    displayName: c.fullName,
    normalizedE164: c.phone,
  }));
  return generateRealVcfString(exportItems).vcfString;
}

/**
 * Triggers native browser download of .vcf file with mobile browser compatibility.
 */
export function triggerVcfDownload(vcfContent: string, fileName: string): boolean {
  try {
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (error) {
    console.error('Failed to trigger VCF download:', error);
    return false;
  }
}
