/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleVCardContact {
  fullName: string;
  phone: string;
  country: string;
  organization: string;
  note: string;
}

/**
 * Generates an RFC 2426 vCard 3.0 text blob for safe demonstration contact download.
 * Every contact is explicitly labelled as a demonstration contact with zero real personal data.
 */
export function generateVcfString(contacts: SampleVCardContact[], releaseTitle: string): string {
  const lines: string[] = [];

  for (const c of contacts) {
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    lines.push(`FN:GlobalSphere · ${c.fullName} [Sample]`);
    lines.push(`N:${c.fullName};GlobalSphere;;;`);
    lines.push(`ORG:${c.organization}`);
    lines.push(`TEL;TYPE=CELL,VOICE:${c.phone}`);
    lines.push(`NOTE:Sample Demonstration Contact from ${releaseTitle}. Voluntary platform exchange participant.`);
    lines.push('CATEGORIES:GlobalSphere WhatsApp Network');
    lines.push('END:VCARD');
  }

  return lines.join('\r\n');
}

/**
 * Triggers browser download of simulated .vcf file
 */
export function triggerVcfDownload(vcfContent: string, fileName: string): void {
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
