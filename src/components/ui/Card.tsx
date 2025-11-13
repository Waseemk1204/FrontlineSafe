import React from 'react';
import { clsx } from 'clsx';
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
export function Card({
  children,
  className,
  padding = 'md',
  hover = false
}: CardProps) {
  return <div className={clsx('bg-white rounded-card border border-neutral-100 shadow-sm', {
    'p-0': padding === 'none',
    'p-12': padding === 'sm',
    'p-16': padding === 'md',
    'p-24': padding === 'lg',
    'transition-shadow hover:shadow-md': hover
  }, className)}>
      {children}
    </div>;
}