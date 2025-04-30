import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, MapPin, Search } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300",
        isScrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex flex-col gap-4">
        {/* Logo grande + navegação (topo) */}
        {!isScrolled && (
          <div className="flex items-center justify-between gap-4">
            <a href="/">
              <img className="w-32" src="logo-sf.png" alt="Logo" />
            </a>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Button variant="ghost">Criar evento</Button>
              <Button variant="ghost">Meus eventos</Button>
              <Button variant="ghost">Meus ingressos</Button>
            </div>
          </div>
        )}

        {/* Input e elementos adaptativos */}
        <div
          className={cn(
            "flex items-center gap-4 flex-wrap w-full",
            isScrolled ? "justify-between" : "justify-center"
          )}
        >
          {/* Logo + input */}
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

          {/* Parte da direita (scroll) */}
          {isScrolled && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 whitespace-nowrap">
              <Button variant="outline" className="flex items-center gap-1">
                <MapPin size={16} />
                Qualquer lugar
                <ChevronDown size={16} />
              </Button>
              <Button variant="ghost">Criar evento</Button>
              <Button variant="ghost">Meus eventos</Button>
              <Button variant="ghost">Meus ingressos</Button>
            </div>
          )}
        </div>

        {/* Filtros (só no topo) */}
        {!isScrolled && (
          <div className="flex justify-center flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <MapPin size={16} />
              Qualquer lugar
              <ChevronDown size={16} />
            </Button>
            <Button variant="secondary" className="gap-2">Festas & Shows</Button>
            <Button variant="secondary">Stand-up Comedy</Button>
            <Button variant="secondary">Esportes</Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
