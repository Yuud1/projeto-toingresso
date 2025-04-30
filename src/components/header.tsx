import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  MapPin,
  Search,
  CalendarPlus,
  Ticket,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const baseButtonClass = "hover:bg-transparent hover:text-inherit cursor-pointer";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 p-5",
        isScrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex flex-col gap-4">
        {/* TOPO MOBILE */}
        <div className="flex items-center justify-between sm:hidden">
          <a href="/">
            <img className="w-10" src="icon.png" alt="Logo" />
          </a>
          <div className="flex items-center gap-3">
            <img
              src="/profile.jpg"
              alt="Perfil"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <button onClick={toggleMenu}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE DROPDOWN */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-gray-200 py-4 flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Pesquisar eventos..."
              className="px-4 py-2 text-base rounded-md"
            />
            <Button variant="outline" className="flex items-center gap-2 justify-start">
              <MapPin size={16} />
              Qualquer lugar
              <ChevronDown size={16} />
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 justify-start">
              <CalendarPlus size={16} />
              Criar evento
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 justify-start">
              <ClipboardList size={16} />
              Meus eventos
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 justify-start">
              <Ticket size={16} />
              Meus ingressos
            </Button>
          </div>
        )}

        {/* TOPO DESKTOP */}
        {!isScrolled && (
          <div className="hidden sm:flex items-center justify-between gap-4">
            <a href="/">
              <img className="w-32" src="logo-sf.png" alt="Logo" />
            </a>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <CalendarPlus size={16} />
                Criar evento
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <ClipboardList size={16} />
                Meus eventos
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <Ticket size={16} />
                Meus ingressos
              </Button>
              <img
                src="/profile.jpg"
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border"
              />
            </div>
          </div>
        )}

        {/* BARRA DE PESQUISA */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-4 flex-wrap w-full",
            isScrolled ? "justify-between" : "justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isScrolled ? "flex-1 min-w-[300px]" : "w-full justify-center"
            )}
          >
            {isScrolled && (
              <a href="/">
                <img className="w-12" src="icon.png" alt="Logo" />
              </a>
            )}
            <div
              className={cn(
                "relative transition-all duration-300",
                isScrolled ? "w-full max-w-md" : "w-full max-w-xl mx-auto"
              )}
            >
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                type="text"
                placeholder="Pesquisar eventos, shows, teatros, cursos"
                className={cn(
                  "pl-12 pr-6 text-base shadow-lg rounded-xl transition-all duration-300",
                  isScrolled ? "py-5" : "py-7"
                )}
              />
            </div>
          </div>

          {isScrolled && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 whitespace-nowrap">
              <Button variant="outline" className={`bg-[#e2f0ff] text-[#02488C] border-none flex items-center gap-1 ${baseButtonClass}`}>
                <MapPin size={16} />
                Qualquer lugar
                <ChevronDown size={16} />
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <CalendarPlus size={16} />
                Criar evento
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <ClipboardList size={16} />
                Meus eventos
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <Ticket size={16} />
                Meus ingressos
              </Button>
              <img
                src="/profile.jpg"
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border"
              />
            </div>
          )}
        </div>

        {/* FILTROS (DESKTOP) */}
        {!isScrolled && (
          <div className="hidden sm:flex justify-center flex-wrap gap-2">
            <Button
              variant="outline"
              className={`flex items-center gap-1 bg-[#e2f0ff] text-[#02488C] border-none ${baseButtonClass}`}
            >
              <MapPin size={16} />
              Qualquer lugar
              <ChevronDown size={16} />
            </Button>
            <Button variant="secondary" className={`gap-2 ${baseButtonClass}`}>
              Festas & Shows
            </Button>
            <Button variant="secondary" className={baseButtonClass}>
              Stand-up Comedy
            </Button>
            <Button variant="secondary" className={baseButtonClass}>
              Esportes
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
