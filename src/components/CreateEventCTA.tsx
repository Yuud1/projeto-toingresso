"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Users, Calendar } from "lucide-react";

const CreateEventCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-5 pb-25 px-4  relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plataforma Gratuita
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Pronto para Criar seu
            <span className="block bg-gradient-to-r from-[#FDC901] to-[#FFE066] bg-clip-text text-transparent">
              Próximo Evento?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-black/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Junte-se a milhares de organizadores que confiam na nossa plataforma
            para criar eventos memoráveis e inesquecíveis.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">10k+</div>
            <div className="text-black/80">Organizadores Ativos</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">50k+</div>
            <div className="text-black/80">Eventos Criados</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">100%</div>
            <div className="text-black/80">Seguro e Confiável</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="relative group flex items-center gap-3 px-8 py-4 rounded-xl text-white bg-black font-bold text-lg shadow-2xl min-w-[200px] cursor-pointer overflow-hidden"
            onClick={() => navigate("/criar-evento")}
          >
            {/* Efeito de preenchimento no hover */}
            <span className="absolute inset-0 bg-[#FDC901] w-0 group-hover:w-full transition-all duration-500 ease-in-out z-0"></span>

            {/* Conteúdo do botão por cima do span de fundo */}
            <span className="flex items-center gap-3 relative z-10 text-white group-hover:text-black transition-colors duration-300">
              <ShieldCheck className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Criar Evento Grátis
            </span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-black/60 text-sm mb-4">
            Recursos inclusos gratuitamente:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-black/80 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FDC901] rounded-full"></div>
              Gestão de ingressos
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FDC901] rounded-full"></div>
              Pagamentos seguros
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FDC901] rounded-full"></div>
              Relatórios detalhados
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FDC901] rounded-full"></div>
              Suporte 24/7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEventCTA;
