/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'gold' | 'bronze';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    neutral: 'bg-[#EDE8DE]/90 text-[#5C5549] border border-[#DFD7C8] dark:bg-[#1D1A15] dark:text-[#A8A196] dark:border-[#2B261F]',
    gold: 'bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B] border border-[#C5A15B]/30 font-semibold',
    bronze: 'bg-[#9D7B43]/15 text-[#9D7B43] dark:text-[#C5A15B] border border-[#9D7B43]/30',
    success: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium whitespace-nowrap shrink-0 transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
