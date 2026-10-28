/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhoneNumber } from '../services/phoneUtils';
import { generateRealVcfString } from '../services/vcfGenerator';

describe('Phone Number Normalization & Validation (E.164)', () => {
  test('correctly normalizes valid international numbers to E.164', () => {
    // Nigeria
    const res1 = normalizePhoneNumber('08031234567', '+234', 'NG');
    assert.equal(res1.isValid, true);
    assert.equal(res1.e164, '+2348031234567');

    // UK
    const res2 = normalizePhoneNumber('07911 123456', '+44', 'GB');
    assert.equal(res2.isValid, true);
    assert.equal(res2.e164, '+447911123456');

    // France
    const res3 = normalizePhoneNumber('06 12 34 56 78', '+33', 'FR');
    assert.equal(res3.isValid, true);
    assert.equal(res3.e164, '+33612345678');
  });

  test('rejects incomplete or invalid phone structures', () => {
    const res = normalizePhoneNumber('123', '+234', 'NG');
    assert.equal(res.isValid, false);
    assert.ok(res.errorMessage);
  });
});

describe('RFC 2426 vCard Generator & Privacy Controls', () => {
  test('excludes recipient own phone number from export', () => {
    const contacts = [
      { id: '1', displayName: 'Recipient Self', normalizedE164: '+2348031234567' },
      { id: '2', displayName: 'Other Member', normalizedE164: '+447911123456' },
    ];

    const { vcfString, count } = generateRealVcfString(contacts, '+2348031234567');

    assert.equal(count, 1);
    assert.ok(vcfString.includes('+447911123456'));
    assert.ok(!vcfString.includes('+2348031234567'));
    assert.ok(!vcfString.includes('Recipient Self'));
  });

  test('deduplicates duplicate phone numbers', () => {
    const contacts = [
      { id: '1', displayName: 'Contact A', normalizedE164: '+447911123456' },
      { id: '2', displayName: 'Contact A Duplicate', normalizedE164: '+447911123456' },
      { id: '3', displayName: 'Contact B', normalizedE164: '+33612345678' },
    ];

    const { count } = generateRealVcfString(contacts);
    assert.equal(count, 2);
  });

  test('escapes special characters (commas, semicolons, backslashes)', () => {
    const contacts = [
      { id: '1', displayName: 'Company; LLC, Corp \\ Dev', normalizedE164: '+14155552671' },
    ];

    const { vcfString } = generateRealVcfString(contacts);
    assert.ok(vcfString.includes('Company\\; LLC\\, Corp \\\\ Dev'));
  });
});
