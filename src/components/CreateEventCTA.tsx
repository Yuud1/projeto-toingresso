import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const CreateEventCTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-16 px-2 bg-gradient-to-r from-[#02488C] to-[#18181b] flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">
        Pronto para Criar seu Próximo Evento?
      </h2>
      <p className="text-lg md:text-2xl text-white/90 text-center mb-10 max-w-2xl">
        Junte-se a milhares de organizadores que confiam na nossa plataforma para criar eventos memoráveis.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#8b2be2] font-semibold text-base shadow hover:bg-gray-100 transition-all border border-white/30"
          onClick={() => navigate("/criar-evento")}
        >
          <ShieldCheck className="w-5 h-5" />
          Criar Evento Grátis
        </button>
        <button
          className="px-6 py-3 rounded-lg border border-white text-white font-semibold text-base hover:bg-white/10 transition-all"
          onClick={() => navigate("/ajuda")}
        >
          Saiba Mais
        </button>
      </div>
    </section>
  );
};

export default CreateEventCTA; 