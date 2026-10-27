/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold';
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 min-h-[44px] min-w-[44px] select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
  };

  const variantStyles = {
    // Gold is our high-intent primary CTA accent
    gold: 'bg-[#C5A15B] text-black hover:bg-[#D4B36D] active:bg-[#B38F49] focus-visible:outline-[#C5A15B] shadow-xs font-semibold active:scale-[0.99]',
    primary: 'bg-[#15130F] text-[#F5F0E6] hover:bg-[#25221D] dark:bg-[#F5F0E6] dark:text-[#15130F] dark:hover:bg-[#FFFFFF] focus-visible:outline-[#C5A15B] active:scale-[0.99] shadow-xs font-semibold',
    secondary: 'bg-[#EDE8DE] text-[#25221D] hover:bg-[#E3DCD0] dark:bg-[#1D1A15] dark:text-[#F5F0E6] dark:hover:bg-[#2B261F] border border-[#DFD7C8] dark:border-[#2B261F] focus-visible:outline-[#C5A15B] active:scale-[0.99]',
    outline: 'border border-[#DFD7C8] bg-transparent text-[#25221D] hover:bg-[#EDE8DE]/70 dark:border-[#2B261F] dark:text-[#F5F0E6] dark:hover:bg-[#1D1A15] focus-visible:outline-[#C5A15B] active:scale-[0.99]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 focus-visible:outline-rose-500 active:scale-[0.99]',
    ghost: 'text-[#5C5549] hover:text-[#1E1B16] hover:bg-[#EDE8DE]/60 dark:text-[#B8B1A4] dark:hover:text-[#FFFFFF] dark:hover:bg-[#1D1A15] focus-visible:outline-[#C5A15B]',
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
