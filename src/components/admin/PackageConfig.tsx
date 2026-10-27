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
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          6. Future Package Configuration (Phase 2 Preview)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Define commercial contact tiers and allowances ready to activate when the pilot threshold is met.
        </p>
      </div>

      {/* Architecture Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200/90 leading-relaxed">
        <strong>Monetization Preparedness Architecture:</strong> Paid tiers are intentionally configured here in Phase 1 so monetization can be activated seamlessly in Phase 2 with a single switch, avoiding any frontend redesign. No real payment gateways or credit card processing exist in this phase.
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`rounded-2xl p-6 border flex flex-col justify-between ${
              pkg.isLive
                ? 'bg-slate-950 border-teal-500/50 shadow-teal-900/10 shadow-lg'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={pkg.isLive ? 'pilot' : 'neutral'}>
                  {pkg.isLive ? 'Active Pilot Tier' : 'Phase 2 Preview'}
                </Badge>
                <span className="text-xs font-mono text-slate-500">
                  {pkg.billingCadence === 'monthly' ? '/month' : 'one-time'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-1">{pkg.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {pkg.descriptionEn}
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contacts Quota:</span>
                  <span className="font-bold text-teal-300 text-sm">{pkg.contactAllowance} Contacts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price (USD):</span>
                  <span className="font-bold text-white text-sm">
                    {pkg.priceUSD === 0 ? 'FREE' : `$${pkg.priceUSD.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Target Group:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{pkg.targetAudience}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
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
          <form onSubmit={handleSavePackage} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tier Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Allowance
                </label>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  required
                  value={allowance}
                  onChange={e => setAllowance(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setEditingPkg(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Tier Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
