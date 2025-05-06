import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function QuestionHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('questionHelpOpen');
    if (savedState) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem('questionHelpOpen', JSON.stringify(open));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Como funciona?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Como funciona?</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Criar Evento</h4>
            <p className="text-sm text-muted-foreground">
              1. Clique no botão "Criar Evento"<br />
              2. Preencha os detalhes do evento<br />
              3. Adicione imagens e descrições<br />
              4. Configure as datas e horários<br />
              5. Salve o evento
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Gerenciar Eventos</h4>
            <p className="text-sm text-muted-foreground">
              • Visualize todos os seus eventos na lista<br />
              • Edite eventos existentes<br />
              • Exclua eventos quando necessário<br />
              • Acompanhe o status de cada evento
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 