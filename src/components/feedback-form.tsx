import { useState } from "react";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface FeedbackFormProps {
  question: string;
  onClose: () => void;
}

export function FeedbackForm({ question, onClose }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar o envio do feedback para sua API
    console.log({
      question,
      feedback,
      comment
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#414141]">Sua opinião é importante!</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={20} />
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Esta resposta foi útil para você?
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={feedback === "positive" ? "default" : "outline"}
              className={`flex-1 ${
                feedback === "positive"
                  ? "bg-green-500 hover:bg-green-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setFeedback("positive")}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Sim
            </Button>
            <Button
              type="button"
              variant={feedback === "negative" ? "default" : "outline"}
              className={`flex-1 ${
                feedback === "negative"
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setFeedback("negative")}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Não
            </Button>
          </div>

          {feedback && (
            <div className="mb-4">
              <Textarea
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#02488C] hover:bg-[#023b70]"
            >
              Enviar Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 