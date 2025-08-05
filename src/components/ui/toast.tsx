import React, { useEffect, useState, useRef } from "react";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          handleClose();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    // Auto-close
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX.current;
    const deltaY = Math.abs(currentY - startY.current);
    
    // Only allow horizontal swipe if vertical movement is minimal
    if (deltaY < 50) {
      const newOffset = Math.max(0, deltaX);
      setSwipeOffset(newOffset);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If swiped more than 50% of the width, close the toast
    if (swipeOffset > 150) {
      handleClose();
    } else {
      // Reset position
      setSwipeOffset(0);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      ref={toastRef}
      className={cn(
        "relative max-w-sm sm:max-w-md w-full transform transition-all duration-300 ease-in-out touch-pan-y select-none",
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      )}
      style={{
        transform: `translateX(${swipeOffset}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          "relative p-3 sm:p-4 rounded-xl border shadow-lg backdrop-blur-sm bg-white/95",
          getBackgroundColor()
        )}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight break-words">
              {title}
            </h4>
            {message && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-1 sm:ml-2 p-1 rounded-lg hover:bg-gray-200/50 transition-colors active:scale-95"
            aria-label="Fechar notificação"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-100 ease-linear",
              getProgressColor()
            )}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        
        {/* Swipe indicator for mobile */}
        <div className="absolute top-2 right-2 opacity-30 sm:hidden">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
