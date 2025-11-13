import React from 'react';
import { clsx } from 'clsx';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return <button className={clsx('inline-flex items-center justify-center font-medium transition-all rounded-button', 'focus:outline-none focus:ring-2 focus:ring-offset-2', 'disabled:opacity-50 disabled:cursor-not-allowed', {
    // Variants
    'bg-primary text-white hover:bg-primary-dark focus:ring-primary': variant === 'primary',
    'bg-white text-primary border-2 border-primary hover:bg-neutral-50 focus:ring-primary': variant === 'secondary',
    'bg-danger text-white hover:bg-red-600 focus:ring-danger': variant === 'danger',
    'bg-transparent text-primary hover:bg-neutral-50 focus:ring-primary': variant === 'ghost',
    // Sizes
    'px-12 py-8 text-sm': size === 'sm',
    'px-16 py-12 text-base': size === 'md',
    'px-20 py-16 text-base': size === 'lg',
    // Full width
    'w-full': fullWidth
  }, className)} disabled={disabled || loading} {...props}>
      {loading ? <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </> : children}
    </button>;
}