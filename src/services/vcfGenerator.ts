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
 * Escapes characters for vCard text values according to RFC 2426 Section 2.4.2.
 * Backslashes, semicolons, commas, and newlines must be escaped.
 */
export function escapeVCardText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Validates whether a phone number matches standard international E.164 format (+ followed by 7-15 digits).
 */
export function isValidE164Format(phone: string): boolean {
  if (!phone) return false;
  return /^\+[1-9]\d{6,14}$/.test(phone.trim());
}

/**
 * Generates an RFC 2426 standard vCard 3.0 text payload from actual allocated, consented records.
 * 
 * Rules strictly enforced:
 * - Excludes recipient's own number (self-exclusion).
 * - Deduplicates numbers by normalized E.164.
 * - Validates E.164 international phone format.
 * - Escapes special characters properly (RFC 2426).
 * - Uses proper CRLF line breaks (\r\n) and terminates with a trailing CRLF.
 */
export function generateRealVcfString(
  contacts: ConsentedContactExport[],
  recipientNormalizedPhone?: string
): { vcfString: string; count: number } {
  const lines: string[] = [];
  const seenNumbers = new Set<string>();
  const normalizedRecipient = recipientNormalizedPhone?.trim();

  for (const c of contacts) {
    const phone = c.normalizedE164?.trim();
    if (!phone) continue;

    // Strict safety check: Never include recipient's own phone number
    if (normalizedRecipient && phone === normalizedRecipient) {
      continue;
    }

    // Must be valid E.164 phone structure
    if (!isValidE164Format(phone)) {
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
    lines.push('NOTE:Contact Gaining member. Consented voluntary contact exchange participant.');
    lines.push('CATEGORIES:Contact Gaining Network');
    lines.push('END:VCARD');
  }

  // RFC 2426 specifies CRLF line terminators, with a final trailing CRLF
  const vcfString = lines.length > 0 ? lines.join('\r\n') + '\r\n' : '';

  return {
    vcfString,
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
