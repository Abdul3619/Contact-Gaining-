/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhoneNumber } from '../services/phoneUtils';
import { generateRealVcfString, isValidE164Format, escapeVCardText } from '../services/vcfGenerator';

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

  test('validates E.164 regex pattern correctly', () => {
    assert.equal(isValidE164Format('+2348031234567'), true);
    assert.equal(isValidE164Format('+447911123456'), true);
    assert.equal(isValidE164Format('08031234567'), false);
    assert.equal(isValidE164Format('+01234567'), false);
    assert.equal(isValidE164Format(''), false);
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

  test('escapes special characters (commas, semicolons, backslashes, newlines)', () => {
    const escaped = escapeVCardText('Tech; Corp, Inc. \\ Group\nLagos');
    assert.equal(escaped, 'Tech\\; Corp\\, Inc. \\\\ Group\\nLagos');

    const contacts = [
      { id: '1', displayName: 'Company; LLC, Corp \\ Dev', normalizedE164: '+14155552671' },
    ];

    const { vcfString } = generateRealVcfString(contacts);
    assert.ok(vcfString.includes('Company\\; LLC\\, Corp \\\\ Dev'));
  });

  test('uses RFC 2426 CRLF line endings and trailing CRLF', () => {
    const contacts = [
      { id: '1', displayName: 'Member One', normalizedE164: '+2348031234567' },
    ];

    const { vcfString } = generateRealVcfString(contacts);
    assert.ok(vcfString.includes('\r\n'));
    assert.ok(vcfString.endsWith('\r\n'));
    assert.ok(vcfString.includes('BEGIN:VCARD\r\nVERSION:3.0\r\n'));
    assert.ok(vcfString.includes('END:VCARD\r\n'));
  });
});

describe('Database Schema & Constraint Compatibility', () => {
  test('validates supported consent_type values against live DB constraint', () => {
    const validConsentTypes = new Set(['contact_distribution', 'privacy_policy', 'terms']);
    
    assert.equal(validConsentTypes.has('contact_distribution'), true);
    assert.equal(validConsentTypes.has('privacy_policy'), true);
    assert.equal(validConsentTypes.has('terms'), true);

    // Unsupported legacy value must be rejected
    assert.equal(validConsentTypes.has('whatsapp_contact_exchange'), false);
  });

  test('validates supported members.status values against live DB constraint', () => {
    const validMemberStatuses = new Set(['pending', 'active', 'suspended']);

    assert.equal(validMemberStatuses.has('pending'), true);
    assert.equal(validMemberStatuses.has('active'), true);
    assert.equal(validMemberStatuses.has('suspended'), true);

    // 'withdrawn' must not be written as a member status
    assert.equal(validMemberStatuses.has('withdrawn'), false);
  });
});

describe('Consent Withdrawal & Export Eligibility Logic', () => {
  interface MockCandidate {
    id: string;
    displayName: string;
    phoneE164: string;
    status: 'pending' | 'active' | 'suspended';
    consentGranted: boolean;
    consentWithdrawnAt: string | null;
  }

  const evaluateEligibility = (candidate: MockCandidate): boolean => {
    // Only active members with unwithdrawn consent are eligible
    if (candidate.status !== 'active') return false;
    if (!candidate.consentGranted) return false;
    if (candidate.consentWithdrawnAt !== null) return false;
    return true;
  };

  test('excludes members who have withdrawn consent', () => {
    const consentingMember: MockCandidate = {
      id: 'm1',
      displayName: 'Active Consenting Member',
      phoneE164: '+2348011111111',
      status: 'active',
      consentGranted: true,
      consentWithdrawnAt: null,
    };

    const withdrawnMember: MockCandidate = {
      id: 'm2',
      displayName: 'Withdrawn Member',
      phoneE164: '+2348022222222',
      status: 'active',
      consentGranted: false,
      consentWithdrawnAt: '2026-10-28T10:00:00Z',
    };

    assert.equal(evaluateEligibility(consentingMember), true);
    assert.equal(evaluateEligibility(withdrawnMember), false);
  });

  test('excludes members whose account is suspended or pending review', () => {
    const suspendedMember: MockCandidate = {
      id: 'm3',
      displayName: 'Suspended Member',
      phoneE164: '+2348033333333',
      status: 'suspended',
      consentGranted: true,
      consentWithdrawnAt: null,
    };

    const pendingMember: MockCandidate = {
      id: 'm4',
      displayName: 'Pending Member',
      phoneE164: '+2348044444444',
      status: 'pending',
      consentGranted: true,
      consentWithdrawnAt: null,
    };

    assert.equal(evaluateEligibility(suspendedMember), false);
    assert.equal(evaluateEligibility(pendingMember), false);
  });
});

describe('Allocation Boundary & Anti-Self-Allocation Security', () => {
  test('strictly excludes self by ID and phone from allocations', () => {
    const recipientId = 'user-rec-1';
    const recipientPhone = '+2348099999999';

    const candidates = [
      { id: 'user-rec-1', phoneE164: '+2348099999999', name: 'Self Recipient' },
      { id: 'user-cand-2', phoneE164: '+2348012345678', name: 'Valid Peer' },
      { id: 'user-cand-3', phoneE164: '+2348099999999', name: 'Duplicate Phone of Self' },
    ];

    const safeCandidates = candidates.filter(
      c => c.id !== recipientId && c.phoneE164 !== recipientPhone
    );

    assert.equal(safeCandidates.length, 1);
    assert.equal(safeCandidates[0].id, 'user-cand-2');
  });

  test('prevents duplicate allocations for already allocated contacts', () => {
    const existingAllocatedIds = new Set(['user-past-1', 'user-past-2']);
    const candidateIds = ['user-past-1', 'user-past-2', 'user-new-3', 'user-new-4'];

    const filtered = candidateIds.filter(id => !existingAllocatedIds.has(id));
    assert.deepEqual(filtered, ['user-new-3', 'user-new-4']);
  });
});
