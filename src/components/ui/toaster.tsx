import { useToast } from "@/contexts/ToastContext";
import ToastContainer from "./toast-container";

export function Toaster() {
  const { toasts } = useToast();

  return <ToastContainer toasts={toasts} />;
}
