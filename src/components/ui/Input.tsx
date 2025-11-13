import React from 'react';
import { clsx } from 'clsx';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}
export function Input({
  label,
  error,
  helperText,
  multiline = false,
  rows = 3,
  className,
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const inputClasses = clsx('w-full px-12 py-8 text-base rounded-input border transition-colors', 'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent', 'disabled:bg-neutral-50 disabled:cursor-not-allowed', {
    'border-danger focus:ring-danger': error,
    'border-neutral-200 hover:border-neutral-300': !error
  }, className);
  const InputElement = multiline ? 'textarea' : 'input';
  return <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 mb-4">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>}

      <InputElement id={inputId} className={inputClasses} aria-invalid={error ? 'true' : 'false'} aria-describedby={clsx({
      [errorId]: error,
      [helperId]: helperText && !error
    })} required={required} rows={multiline ? rows : undefined} {...props as any} />

      {error && <p id={errorId} className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>}

      {helperText && !error && <p id={helperId} className="mt-4 text-sm text-neutral-500">
          {helperText}
        </p>}
    </div>;
}