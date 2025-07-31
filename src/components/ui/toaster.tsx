import { useToast } from "@/hooks/use-toast";
import ToastContainer from "./toast-container";

export function Toaster() {
  const { toasts } = useToast();

  return <ToastContainer toasts={toasts} />;
}
