import { useState, useCallback, useEffect } from "react";
import { ToastProps } from "@/components/ui/toast";

export const useToast = () => {
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

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};
