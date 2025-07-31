"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Users, Calendar } from "lucide-react";

const CreateEventCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-4 pb-20 px-4 relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-black text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-medium mb-3 md:mb-5">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            Plataforma Gratuita
          </div>

          <h2 className="text-4xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-black mb-3 md:mb-5 leading-tight">
            Pronto para Criar seu
            <span className="block bg-gradient-to-r from-[#FDC901] to-[#FFE066] bg-clip-text text-transparent">
              Próximo Evento?
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/90 mb-5 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Junte-se a milhares de organizadores que confiam na nossa plataforma
            para criar eventos memoráveis e inesquecíveis.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-10">
          <div className="text-center">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Users className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-black mb-1 md:mb-2">10k+</div>
            <div className="text-xs md:text-sm text-black/80">Organizadores Ativos</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Calendar className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-black mb-1 md:mb-2">50k+</div>
            <div className="text-xs md:text-sm text-black/80">Eventos Criados</div>
          </div>

          <div className="text-center col-span-2 md:col-span-1">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
              <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-black mb-1 md:mb-2">100%</div>
            <div className="text-xs md:text-sm text-black/80">Seguro e Confiável</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            className="relative group flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-7 md:py-3.5 rounded-xl text-white bg-black font-bold text-sm md:text-base shadow-2xl min-w-[160px] md:min-w-[180px] cursor-pointer overflow-hidden"
            onClick={() => navigate("/criar-evento")}
          >
            {/* Efeito de preenchimento no hover */}
            <span className="absolute inset-0 bg-[#FDC901] w-0 group-hover:w-full transition-all duration-500 ease-in-out z-0"></span>

            {/* Conteúdo do botão por cima do span de fundo */}
            <span className="flex items-center gap-2 md:gap-3 relative z-10 text-white group-hover:text-black transition-colors duration-300">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
              Criar Evento Grátis
            </span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 md:mt-10 text-center">
          <p className="text-black/60 text-xs md:text-sm mb-2 md:mb-3">
            Recursos inclusos gratuitamente:
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-black/80 text-xs md:text-sm px-2">
            <span className="flex items-center gap-1 md:gap-1.5">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#FDC901] rounded-full"></div>
              Gestão de ingressos
            </span>
            <span className="flex items-center gap-1 md:gap-1.5">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#FDC901] rounded-full"></div>
              Pagamentos seguros
            </span>
            <span className="flex items-center gap-1 md:gap-1.5">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#FDC901] rounded-full"></div>
              Relatórios detalhados
            </span>
            <span className="flex items-center gap-1 md:gap-1.5">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#FDC901] rounded-full"></div>
              Suporte 24/7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEventCTA;
