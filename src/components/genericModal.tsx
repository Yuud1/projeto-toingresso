import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface GenericModalProps {
  trigger?: ReactNode;
  onConfirm?: () => void;
  onClose: () => void;
  isOpen?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  variant?: "default" | "destructive" | "success";
  showFooter?: boolean;
}

export default function GenericModal({
  trigger,
  onConfirm,
  onClose,
  isOpen = false,
  title = "Modal",
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
  variant = "default",
  showFooter = true,
}: GenericModalProps) {
  const variantClasses = {
    default: "bg-[#02488C] hover:bg-[#02488C]/90",
    destructive: "bg-red-600 hover:bg-red-700",
    success: "bg-green-600 hover:bg-green-700"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        {showFooter && (
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                {cancelText}
              </Button>
            </DialogClose>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                className={`text-white cursor-pointer ${variantClasses[variant]}`}
              >
                {confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}