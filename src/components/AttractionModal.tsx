import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink } from "lucide-react";
import React from "react";

interface AttractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attraction: any | null;
}

const AttractionModal: React.FC<AttractionModalProps> = React.memo(({ open, onOpenChange, attraction }) => {
  if (!attraction) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-white shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {attraction.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            {attraction.description || "Prepare-se para uma experiência incrível!"}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {attraction.startTime && (
            <div className="flex items-center gap-3 p-3 rounded-xl ">
              <Clock className="w-5 h-5 " />
              <span className="text-gray-700">
                <strong className="text-gray-800">Início:</strong> {attraction.startTime}
              </span>
            </div>
          )}
          {attraction.endTime && (
            <div className="flex items-center gap-3 p-3 rounded-xl ">
              <Clock className="w-5 h-5 " />
              <span className="text-gray-700">
                <strong className="text-gray-800">Término:</strong> {attraction.endTime}
              </span>
            </div>
          )}
          {attraction.social && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <ExternalLink className="w-5 h-5 text-amber-600" />
              <a
                href={attraction.social}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
              >
                Ver perfil/rede social
              </a>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button className="mt-8 w-full text-white border-0 rounded-xl py-3 text-lg font-semibold">
            Fechar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
});

export default AttractionModal; 