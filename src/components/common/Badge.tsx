/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'pilot';
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
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/60',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/60',
    pilot: 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium whitespace-nowrap shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
