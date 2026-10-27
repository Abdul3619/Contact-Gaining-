/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showText = false }) => {
  const { themeMode, resolvedTheme, setThemeMode, toggleTheme, t } = useApp();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-200 border cursor-pointer min-h-[44px] min-w-[44px] bg-[#EDE8DE]/80 hover:bg-[#E3DCD0] border-[#DFD7C8] text-[#25221D] dark:bg-[#15130F]/80 dark:hover:bg-[#1D1A15] dark:border-[#2B261F] dark:text-[#F5F0E6] shadow-xs"
        aria-label={resolvedTheme === 'dark' ? t('themeLight') : t('themeDark')}
        title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="sr-only">{t('themeToggleLabel')}</span>
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#C5A15B] transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#9D7B43] transition-transform duration-300 group-hover:-rotate-12" />
        )}

        {showText && (
          <span className="ml-2 text-xs font-medium">
            {resolvedTheme === 'dark' ? t('themeLight') : t('themeDark')}
          </span>
        )}
      </button>
    </div>
  );
};
