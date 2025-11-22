import React from 'react';
import { Button } from './ui/Button';
import { BoxIcon } from 'lucide-react';
export interface EmptyStateProps {
  icon?: BoxIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return <div className="flex flex-col items-center justify-center py-32 px-16 text-center">
      {Icon && <div className="w-16 h-16 mb-16 text-neutral-300">
          <Icon className="w-full h-full" />
        </div>}

      <h3 className="text-h3 font-semibold text-neutral-900 mb-8">{title}</h3>

      {description && <p className="text-base text-neutral-500 mb-16 max-w-md">
          {description}
        </p>}

      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>;
}