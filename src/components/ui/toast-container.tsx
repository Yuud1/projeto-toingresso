import React from "react";
import Toast, { ToastProps } from "./toast";

interface ToastContainerProps {
  toasts: ToastProps[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] space-y-3 sm:space-y-4 max-w-sm sm:max-w-md mx-auto sm:mx-0 pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 