import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Excluir Item",
  description = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
}: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className={cn("border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer")}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}