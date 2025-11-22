import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div ref={modalRef} tabIndex={-1} className={clsx('relative bg-white rounded-t-card sm:rounded-card shadow-xl', 'w-full max-h-[90vh] overflow-y-auto', 'animate-slide-up sm:animate-fade-in', {
      'sm:max-w-sm': size === 'sm',
      'sm:max-w-lg': size === 'md',
      'sm:max-w-2xl': size === 'lg',
      'sm:max-w-full sm:m-16': size === 'full'
    })}>
        {/* Header */}
        {(title || showCloseButton) && <div className="flex items-center justify-between p-16 border-b border-neutral-100">
            {title && <h2 id="modal-title" className="text-h3 font-semibold text-neutral-900">
                {title}
              </h2>}
            {showCloseButton && <button onClick={onClose} className="p-4 rounded-button hover:bg-neutral-50 transition-colors" aria-label="Close modal">
                <XIcon className="w-5 h-5 text-neutral-500" />
              </button>}
          </div>}

        {/* Content */}
        <div className="p-16">{children}</div>
      </div>
    </div>;
}