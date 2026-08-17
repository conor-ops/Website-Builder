import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'email-trigger' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  email?: string;
  quoteId?: string;
  duration?: number;
  createdAt: number;
  meta?: {
    linearFeet?: number;
    material?: string;
    totalCost?: number;
    firebaseTrigger?: boolean;
    jobType?: string;
  };
}

interface ToastContextType {
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id' | 'createdAt'>) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
  showQuoteSuccessToast: (params: {
    quoteId: string;
    email?: string;
    customerName?: string;
    linearFeet?: number;
    material?: string;
    totalCost?: number;
    isEmailDispatched?: boolean;
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((toast: Omit<ToastNotification, 'id' | 'createdAt'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = {
      ...toast,
      id,
      createdAt: Date.now(),
      duration: toast.duration ?? (toast.type === 'email-trigger' ? 9000 : 6000),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 visible toasts
    return id;
  }, []);

  const showQuoteSuccessToast = useCallback(({
    quoteId,
    email,
    customerName,
    linearFeet,
    material,
    totalCost,
    isEmailDispatched = true,
  }: {
    quoteId: string;
    email?: string;
    customerName?: string;
    linearFeet?: number;
    material?: string;
    totalCost?: number;
    isEmailDispatched?: boolean;
  }) => {
    const recipient = email && email.trim() ? email.trim() : 'the customer';
    const hasEmail = Boolean(email && email.trim());

    showToast({
      type: 'email-trigger',
      title: 'Estimate Logged & Confirmation Dispatched',
      message: hasEmail
        ? `Quote #${quoteId} was saved to Firestore. A project confirmation & itemized BOM breakdown has been sent to ${recipient} via Firebase Cloud Triggers.`
        : `Quote #${quoteId} was saved to Firestore. (Add an email address anytime to auto-dispatch itemized PDF proposals via Firebase).`,
      email: hasEmail ? recipient : undefined,
      quoteId,
      duration: 10000,
      meta: {
        linearFeet,
        material,
        totalCost,
        firebaseTrigger: isEmailDispatched && hasEmail,
      },
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, clearAll, showQuoteSuccessToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
