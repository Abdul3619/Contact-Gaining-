/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, CALLING_CODES } from '../../data/countries';
import { Country, Locale } from '../../types';
import { Search, ChevronDown, Check } from 'lucide-react';

interface SearchableCountrySelectProps {
  value: string; // ISO code or dialCode
  onChange: (val: string, country: Country) => void;
  mode?: 'country' | 'dialCode';
  label?: string;
  locale?: Locale;
  error?: string;
  disabled?: boolean;
}

export const SearchableCountrySelect: React.FC<SearchableCountrySelectProps> = ({
  value,
  onChange,
  mode = 'country',
  label,
  locale = 'en',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dataset = mode === 'country' ? COUNTRIES : CALLING_CODES;

  // Selected item
  const selectedItem = dataset.find(item =>
    mode === 'country' ? item.code.toUpperCase() === value.toUpperCase() : item.dialCode === value
  ) || dataset[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredItems = dataset.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = item.name.toLowerCase().includes(q) || item.nameFr.toLowerCase().includes(q);
    const codeMatch = item.code.toLowerCase().includes(q);
    const dialMatch = item.dialCode.toLowerCase().includes(q);
    return nameMatch || codeMatch || dialMatch;
  });

  const handleSelect = (item: Country) => {
    onChange(mode === 'country' ? item.code : item.dialCode, item);
    setIsOpen(false);
    setQuery('');
  };

  const getDisplayName = (item: Country) => {
    const name = locale === 'fr' ? item.nameFr : item.name;
    return mode === 'country' ? `${item.flag} ${name} (${item.code})` : `${item.flag} ${item.dialCode} · ${name}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full min-h-[44px] px-3.5 py-2 text-left bg-white border rounded-xl flex items-center justify-between text-sm transition-colors ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 hover:border-slate-400 focus:border-slate-900'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-base">{selectedItem.flag}</span>
          <span className="font-medium text-slate-800 truncate">
            {mode === 'country'
              ? locale === 'fr' ? selectedItem.nameFr : selectedItem.name
              : `${selectedItem.dialCode} (${selectedItem.code})`}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </button>

      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-72 flex flex-col">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country or code..."
              className="w-full text-xs sm:text-sm bg-transparent border-0 outline-hidden placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No matching country found</div>
            ) : (
              filteredItems.map(item => {
                const isSelected = mode === 'country' ? item.code === value : item.dialCode === value;
                return (
                  <button
                    key={`${item.code}-${item.dialCode}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-teal-50 text-teal-900 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base shrink-0">{item.flag}</span>
                      <span className="truncate">{locale === 'fr' ? item.nameFr : item.name}</span>
                      <span className="text-xs text-slate-400 shrink-0 font-mono">
                        {item.dialCode} ({item.code})
                      </span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
