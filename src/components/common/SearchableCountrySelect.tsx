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

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#5C5549] dark:text-[#C4BCAD] uppercase tracking-wider mb-1.5">
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
        className={`w-full min-h-[44px] px-3.5 py-2.5 text-left rounded-xl flex items-center justify-between text-sm transition-all border ${
          error
            ? 'border-rose-500 focus:border-rose-600'
            : 'border-[#DFD7C8] hover:border-[#9D7B43] dark:border-[#2B261F] dark:hover:border-[#C5A15B]/50'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-[#EDE8DE] dark:bg-[#1D1A15]'
            : 'cursor-pointer bg-[#FFFCF6] dark:bg-[#15130F] text-[#25221D] dark:text-[#F5F0E6]'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-base shrink-0">{selectedItem.flag}</span>
          <span className="font-medium truncate">
            {mode === 'country'
              ? locale === 'fr' ? selectedItem.nameFr : selectedItem.name
              : `${selectedItem.dialCode} (${selectedItem.code})`}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-[#736C61] dark:text-[#81796D] shrink-0 ml-2" />
      </button>

      {error && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 rounded-2xl shadow-xl border overflow-hidden max-h-72 flex flex-col bg-[#FFFCF6] dark:bg-[#15130F] border-[#DFD7C8] dark:border-[#2B261F]">
          <div className="p-2.5 border-b border-[#DFD7C8]/70 dark:border-[#2B261F] bg-[#EDE8DE]/40 dark:bg-[#1D1A15]/60 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#736C61] dark:text-[#81796D] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country or code..."
              className="w-full text-xs sm:text-sm bg-transparent border-0 outline-hidden text-[#25221D] dark:text-[#F5F0E6] placeholder:text-[#81796D]"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#DFD7C8]/30 dark:divide-[#2B261F]/60">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#736C61] dark:text-[#81796D]">
                No matching country found
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = mode === 'country' ? item.code === value : item.dialCode === value;
                return (
                  <button
                    key={`${item.code}-${item.dialCode}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B] font-semibold'
                        : 'text-[#25221D] hover:bg-[#EDE8DE]/60 dark:text-[#C4BCAD] dark:hover:bg-[#1D1A15]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base shrink-0">{item.flag}</span>
                      <span className="truncate">{locale === 'fr' ? item.nameFr : item.name}</span>
                      <span className="text-xs text-[#736C61] dark:text-[#81796D] shrink-0 font-mono">
                        {item.dialCode} ({item.code})
                      </span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#C5A15B] shrink-0 ml-2" />}
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
