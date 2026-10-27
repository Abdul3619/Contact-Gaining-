/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] min-w-[44px] select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 active:scale-[0.99]',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:outline-slate-400 active:scale-[0.99]',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400 active:scale-[0.99]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600 active:scale-[0.99]',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-400',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600 active:scale-[0.99] shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
