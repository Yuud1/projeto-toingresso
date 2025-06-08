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

interface DeleteDialogProps {
  trigger?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  isOpen?: boolean;
  title?: string;
  description?: string;
}

export default function DeleteModal({
  trigger,
  onConfirm,
  onClose,
  isOpen = false,
  title = "Finalizar Evento",
  description = "Deseja finalizar o evento? Essa ação não poderá ser desfeita",
}: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
