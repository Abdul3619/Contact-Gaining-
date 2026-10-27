/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { PackagePlan } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Package, Sparkles, Check, Edit2, AlertCircle } from 'lucide-react';

export const PackageConfig: React.FC = () => {
  const { addToast } = useApp();
  const [packages, setPackages] = useState<PackagePlan[]>(mockDataService.getPackages());
  const [editingPkg, setEditingPkg] = useState<PackagePlan | null>(null);

  // Form
  const [name, setName] = useState('');
  const [allowance, setAllowance] = useState(200);
  const [price, setPrice] = useState(9.99);
  const [desc, setDesc] = useState('');

  const handleOpenEdit = (pkg: PackagePlan) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setAllowance(pkg.contactAllowance);
    setPrice(pkg.priceUSD);
    setDesc(pkg.descriptionEn);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    mockDataService.updatePackage(editingPkg.id, {
      name,
      contactAllowance: Number(allowance),
      priceUSD: Number(price),
      descriptionEn: desc,
    });

    setPackages(mockDataService.getPackages());
    setEditingPkg(null);
    addToast(`Package plan "${name}" updated.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
          Future Package Configuration (Post-Growth Tier Preview)
        </h1>
        <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
          Pre-configure commercial contact tiers and allowances ready to activate when the community reaches 1,000 verified members.
        </p>
      </div>

      {/* Architecture Disclaimer */}
      <div className="p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] text-xs text-[#736C61] dark:text-[#A89F91] leading-relaxed">
        <strong className="text-[#25221D] dark:text-[#F5F0E6]">Monetization Preparedness Architecture:</strong> Commercial tiers are structured here in advance so paid packages can be enabled seamlessly when community growth targets are achieved, without redesigning the platform. Currently, the uncapped growth pilot is 100% free.
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
              pkg.isLive
                ? 'bg-[#FFFCF6] dark:bg-[#15130F] border-[#C5A15B] shadow-sm'
                : 'bg-[#FFFCF6] dark:bg-[#15130F] border-[#DFD7C8] dark:border-[#2B261F]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={pkg.isLive ? 'gold' : 'neutral'}>
                  {pkg.isLive ? 'Active Free Tier' : 'Future Milestone Tier'}
                </Badge>
                <span className="text-xs font-mono text-[#736C61] dark:text-[#81796D]">
                  {pkg.billingCadence === 'monthly' ? '/month' : 'one-time'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#25221D] dark:text-[#F5F0E6] mb-1">{pkg.name}</h2>
              <p className="text-xs text-[#736C61] dark:text-[#A89F91] leading-relaxed mb-4">
                {pkg.descriptionEn}
              </p>

              <div className="p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] text-xs font-mono space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#736C61] dark:text-[#81796D]">Contacts Quota:</span>
                  <span className="font-bold text-[#9D7B43] dark:text-[#C5A15B] text-sm">{pkg.contactAllowance} Contacts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736C61] dark:text-[#81796D]">Price (USD):</span>
                  <span className="font-bold text-[#25221D] dark:text-[#F5F0E6] text-sm">
                    {pkg.priceUSD === 0 ? 'FREE' : `$${pkg.priceUSD.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#736C61] dark:text-[#81796D]">Target Group:</span>
                  <span className="text-[#25221D] dark:text-[#F5F0E6] truncate max-w-[150px]">{pkg.targetAudience}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleOpenEdit(pkg)}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit Tier Parameters
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Tier Modal */}
      {editingPkg && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPkg(null)}
          title={`Edit Tier: ${editingPkg.name}`}
          description="Adjust contact allowance and pricing parameters."
        >
          <form onSubmit={handleSavePackage} className="space-y-4 text-xs text-[#25221D] dark:text-[#F5F0E6]">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Tier Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden focus:border-[#C5A15B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Contact Allowance
                </label>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  required
                  value={allowance}
                  onChange={e => setAllowance(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden font-mono focus:border-[#C5A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={200}
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden font-mono focus:border-[#C5A15B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full p-2.5 bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden focus:border-[#C5A15B]"
              />
            </div>

            <div className="pt-3 border-t border-[#DFD7C8] dark:border-[#2B261F] flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setEditingPkg(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save Tier Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
