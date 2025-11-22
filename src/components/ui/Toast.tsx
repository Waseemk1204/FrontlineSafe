import React, { useCallback, useState, createContext, useContext } from 'react';
import { clsx } from 'clsx';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';
type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}
const ToastContext = createContext<ToastContextValue | undefined>(undefined);
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
export function ToastProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = {
      id,
      message,
      type
    };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return <ToastContext.Provider value={{
    showToast
  }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-16 right-16 z-50 flex flex-col gap-8 max-w-sm" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />)}
      </div>
    </ToastContext.Provider>;
}
function ToastItem({
  toast,
  onClose
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InfoIcon
  };
  const Icon = icons[toast.type];
  return <div className={clsx('flex items-start gap-12 p-16 rounded-card shadow-lg', 'animate-slide-down bg-white border-l-4', {
    'border-success': toast.type === 'success',
    'border-danger': toast.type === 'error',
    'border-info': toast.type === 'info'
  })} role="alert">
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-1', {
      'text-success': toast.type === 'success',
      'text-danger': toast.type === 'error',
      'text-info': toast.type === 'info'
    })} />

      <p className="flex-1 text-sm text-neutral-900">{toast.message}</p>

      <button onClick={onClose} className="p-4 rounded-button hover:bg-neutral-50 transition-colors flex-shrink-0" aria-label="Close notification">
        <XIcon className="w-4 h-4 text-neutral-500" />
      </button>
    </div>;
}