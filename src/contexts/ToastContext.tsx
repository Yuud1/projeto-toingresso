import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastProps } from "@/components/ui/toast";

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id" | "onClose">) => void;
  removeToast: (id: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      },
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration = 5000) => {
    addToast({
      type: "success",
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, duration = 5000) => {
    addToast({
      type: "error",
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, duration = 5000) => {
    addToast({
      type: "warning",
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, duration = 5000) => {
    addToast({
      type: "info",
      title,
      message,
      duration,
    });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
