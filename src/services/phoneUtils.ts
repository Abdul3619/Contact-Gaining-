/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export interface PhoneValidationResult {
  isValid: boolean;
  isPossible: boolean;
  e164: string;
  nationalFormat: string;
  internationalFormat: string;
  countryCallingCode: string;
  detectedCountry?: string;
  errorMessage?: string;
}

/**
 * Normalizes and validates an international phone number.
 * Supports explicit country calling code combined with national number,
 * or full international string with leading '+'.
 */
export function normalizePhoneNumber(
  rawInput: string,
  callingCodePrefix?: string,
  defaultCountryIso?: string
): PhoneValidationResult {
  const cleaned = rawInput.trim();
  
  if (!cleaned) {
    return {
      isValid: false,
      isPossible: false,
      e164: '',
      nationalFormat: '',
      internationalFormat: '',
      countryCallingCode: callingCodePrefix || '',
      errorMessage: 'Phone number is required',
    };
  }

  // Construct combined candidate
  let fullNumberToParse = cleaned;
  if (!cleaned.startsWith('+')) {
    if (callingCodePrefix) {
      const prefix = callingCodePrefix.startsWith('+') ? callingCodePrefix : `+${callingCodePrefix}`;
      // Remove any leading 0 if standard national trunk
      const trunkCleaned = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
      fullNumberToParse = `${prefix}${trunkCleaned}`;
    } else {
      fullNumberToParse = `+${cleaned}`;
    }
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(
      fullNumberToParse,
      (defaultCountryIso?.toUpperCase() as CountryCode) || undefined
    );

    if (!phoneNumber) {
      return {
        isValid: false,
        isPossible: false,
        e164: fullNumberToParse,
        nationalFormat: cleaned,
        internationalFormat: fullNumberToParse,
        countryCallingCode: callingCodePrefix || '',
        errorMessage: 'Invalid international number structure',
      };
    }

    const isValid = phoneNumber.isValid();
    const isPossible = phoneNumber.isPossible();

    return {
      isValid,
      isPossible,
      e164: phoneNumber.number, // E.164 (e.g. +447911123456)
      nationalFormat: phoneNumber.formatNational(),
      internationalFormat: phoneNumber.formatInternational(),
      countryCallingCode: `+${phoneNumber.countryCallingCode}`,
      detectedCountry: phoneNumber.country,
      errorMessage: isValid ? undefined : 'Phone number is incomplete or unrecognized for this international prefix',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error validating phone number';
    return {
      isValid: false,
      isPossible: false,
      e164: fullNumberToParse,
      nationalFormat: cleaned,
      internationalFormat: fullNumberToParse,
      countryCallingCode: callingCodePrefix || '',
      errorMessage: message,
    };
  }
}
