/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country } from '../types';

export const COUNTRIES: Country[] = [
  // Africa
  { name: 'Nigeria', nameFr: 'Nigéria', code: 'NG', dialCode: '+234', flag: '🇳🇬', region: 'Africa' },
  { name: 'Ghana', nameFr: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', region: 'Africa' },
  { name: 'Kenya', nameFr: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', region: 'Africa' },
  { name: 'South Africa', nameFr: 'Afrique du Sud', code: 'ZA', dialCode: '+27', flag: '🇿🇦', region: 'Africa' },
  { name: "Côte d'Ivoire", nameFr: "Côte d'Ivoire", code: 'CI', dialCode: '+225', flag: '🇨🇮', region: 'Africa' },
  { name: 'Cameroon', nameFr: 'Cameroun', code: 'CM', dialCode: '+237', flag: '🇨🇲', region: 'Africa' },
  { name: 'Senegal', nameFr: 'Sénégal', code: 'SN', dialCode: '+221', flag: '🇸🇳', region: 'Africa' },
  { name: 'Egypt', nameFr: 'Égypte', code: 'EG', dialCode: '+20', flag: '🇪🇬', region: 'Africa' },
  { name: 'Morocco', nameFr: 'Maroc', code: 'MA', dialCode: '+212', flag: '🇲🇦', region: 'Africa' },
  { name: 'Tanzania', nameFr: 'Tanzanie', code: 'TZ', dialCode: '+255', flag: '🇹🇿', region: 'Africa' },
  { name: 'Uganda', nameFr: 'Ouganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', region: 'Africa' },
  { name: 'Rwanda', nameFr: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', region: 'Africa' },
  { name: 'Ethiopia', nameFr: 'Éthiopie', code: 'ET', dialCode: '+251', flag: '🇪🇹', region: 'Africa' },
  { name: 'Benin', nameFr: 'Bénin', code: 'BJ', dialCode: '+229', flag: '🇧🇯', region: 'Africa' },
  { name: 'Togo', nameFr: 'Togo', code: 'TG', dialCode: '+228', flag: '🇹🇬', region: 'Africa' },
  { name: 'Algeria', nameFr: 'Algérie', code: 'DZ', dialCode: '+213', flag: '🇩🇿', region: 'Africa' },
  { name: 'Tunisia', nameFr: 'Tunisie', code: 'TN', dialCode: '+216', flag: '🇹🇳', region: 'Africa' },
  { name: 'Zambia', nameFr: 'Zambie', code: 'ZM', dialCode: '+260', flag: '🇿🇲', region: 'Africa' },
  { name: 'Zimbabwe', nameFr: 'Zimbabwe', code: 'ZW', dialCode: '+263', flag: '🇿🇼', region: 'Africa' },
  { name: 'Angola', nameFr: 'Angola', code: 'AO', dialCode: '+244', flag: '🇦🇴', region: 'Africa' },
  { name: 'DR Congo', nameFr: 'RD Congo', code: 'CD', dialCode: '+243', flag: '🇨🇩', region: 'Africa' },

  // Europe
  { name: 'United Kingdom', nameFr: 'Royaume-Uni', code: 'GB', dialCode: '+44', flag: '🇬🇧', region: 'Europe' },
  { name: 'France', nameFr: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', region: 'Europe' },
  { name: 'Germany', nameFr: 'Allemagne', code: 'DE', dialCode: '+49', flag: '🇩🇪', region: 'Europe' },
  { name: 'Belgium', nameFr: 'Belgique', code: 'BE', dialCode: '+32', flag: '🇧🇪', region: 'Europe' },
  { name: 'Netherlands', nameFr: 'Pays-Bas', code: 'NL', dialCode: '+31', flag: '🇳🇱', region: 'Europe' },
  { name: 'Spain', nameFr: 'Espagne', code: 'ES', dialCode: '+34', flag: '🇪🇸', region: 'Europe' },
  { name: 'Italy', nameFr: 'Italie', code: 'IT', dialCode: '+39', flag: '🇮🇹', region: 'Europe' },
  { name: 'Switzerland', nameFr: 'Suisse', code: 'CH', dialCode: '+41', flag: '🇨🇭', region: 'Europe' },
  { name: 'Sweden', nameFr: 'Suède', code: 'SE', dialCode: '+46', flag: '🇸🇪', region: 'Europe' },
  { name: 'Norway', nameFr: 'Norvège', code: 'NO', dialCode: '+47', flag: '🇳🇴', region: 'Europe' },
  { name: 'Ireland', nameFr: 'Irlande', code: 'IE', dialCode: '+353', flag: '🇮🇪', region: 'Europe' },
  { name: 'Portugal', nameFr: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', region: 'Europe' },
  { name: 'Poland', nameFr: 'Pologne', code: 'PL', dialCode: '+48', flag: '🇵🇱', region: 'Europe' },
  { name: 'Austria', nameFr: 'Autriche', code: 'AT', dialCode: '+43', flag: '🇦🇹', region: 'Europe' },
  { name: 'Denmark', nameFr: 'Danemark', code: 'DK', dialCode: '+45', flag: '🇩🇰', region: 'Europe' },
  { name: 'Finland', nameFr: 'Finlande', code: 'FI', dialCode: '+358', flag: '🇫🇮', region: 'Europe' },

  // Americas
  { name: 'United States', nameFr: 'États-Unis', code: 'US', dialCode: '+1', flag: '🇺🇸', region: 'Americas' },
  { name: 'Canada', nameFr: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', region: 'Americas' },
  { name: 'Brazil', nameFr: 'Brésil', code: 'BR', dialCode: '+55', flag: '🇧🇷', region: 'Americas' },
  { name: 'Mexico', nameFr: 'Mexique', code: 'MX', dialCode: '+52', flag: '🇲🇽', region: 'Americas' },
  { name: 'Colombia', nameFr: 'Colombie', code: 'CO', dialCode: '+57', flag: '🇨🇴', region: 'Americas' },
  { name: 'Argentina', nameFr: 'Argentine', code: 'AR', dialCode: '+54', flag: '🇦🇷', region: 'Americas' },
  { name: 'Chile', nameFr: 'Chili', code: 'CL', dialCode: '+56', flag: '🇨🇱', region: 'Americas' },
  { name: 'Jamaica', nameFr: 'Jamaïque', code: 'JM', dialCode: '+1876', flag: '🇯🇲', region: 'Americas' },
  { name: 'Trinidad and Tobago', nameFr: 'Trinité-et-Tobago', code: 'TT', dialCode: '+1868', flag: '🇹🇹', region: 'Americas' },

  // Asia & Middle East
  { name: 'India', nameFr: 'Inde', code: 'IN', dialCode: '+91', flag: '🇮🇳', region: 'Asia' },
  { name: 'United Arab Emirates', nameFr: 'Émirats Arabes Unis', code: 'AE', dialCode: '+971', flag: '🇦🇪', region: 'Asia' },
  { name: 'Saudi Arabia', nameFr: 'Arabie Saoudite', code: 'SA', dialCode: '+966', flag: '🇸🇦', region: 'Asia' },
  { name: 'Singapore', nameFr: 'Singapour', code: 'SG', dialCode: '+65', flag: '🇸🇬', region: 'Asia' },
  { name: 'Japan', nameFr: 'Japon', code: 'JP', dialCode: '+81', flag: '🇯🇵', region: 'Asia' },
  { name: 'Malaysia', nameFr: 'Malaisie', code: 'MY', dialCode: '+60', flag: '🇲🇾', region: 'Asia' },
  { name: 'Pakistan', nameFr: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', region: 'Asia' },
  { name: 'Philippines', nameFr: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', region: 'Asia' },
  { name: 'Indonesia', nameFr: 'Indonésie', code: 'ID', dialCode: '+62', flag: '🇮🇩', region: 'Asia' },
  { name: 'Qatar', nameFr: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', region: 'Asia' },

  // Oceania
  { name: 'Australia', nameFr: 'Australie', code: 'AU', dialCode: '+61', flag: '🇦🇺', region: 'Oceania' },
  { name: 'New Zealand', nameFr: 'Nouvelle-Zélande', code: 'NZ', dialCode: '+64', flag: '🇳🇿', region: 'Oceania' },
];

export const CALLING_CODES = Array.from(
  new Map(COUNTRIES.map(c => [c.dialCode, c])).values()
).sort((a, b) => a.name.localeCompare(b.name));

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryByDialCode(dialCode: string): Country | undefined {
  return COUNTRIES.find(c => c.dialCode === dialCode);
}
