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
  Heart,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type HeaderProps = {
  isScrolled?: boolean;
};

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp }) => {
  const [isScrolledInternal, setIsScrolledInternal] = useState(false);

  useEffect(() => {
    if (isScrolledProp === undefined) {
      const handleScroll = () => {
        setIsScrolledInternal(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isScrolledProp]);

  const isScrolled = isScrolledProp ?? isScrolledInternal;

  const baseButtonClass = "cursor-pointer hover:bg-transparent hover:text-inherit";

  const ProfileMenu = ({ isMobile = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <DropdownMenu 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        modal={isMobile}
      >
        <DropdownMenuTrigger asChild>
          <div className="outline-none flex items-center gap-2 border rounded-full px-2 py-1 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              LY
            </div>
            <button className="p-1 cursor-pointer">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
  align="start"
  side="top"
  sideOffset={0}
  className={cn(
    isMobile
      ? "w-screen left-0 mt-2 rounded-none border-t border-gray-200"
      : "w-56"
  )}
>
          {isMobile && (
            <>
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="Pesquisar eventos..."
                  className="px-4 py-2 text-base rounded-md"
                />
              </div>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>Criar evento</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Meus eventos</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                <Ticket className="mr-2 h-4 w-4" />
                <span>Meus ingressos</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
            <User className="mr-2 h-4 w-4" />
            <span><a href="/perfil">Minha conta</a></span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favoritos</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span><a href="/question-help">Central de Ajuda</a></span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-gray-100 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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
            <img className="w-10" src="/icon.png" alt="Logo" />
          </a>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-1 text-sm bg-[#e2f0ff] text-[#02488C] border-none cursor-pointer hover:!bg-[#e2f0ff] hover:!text-[#02488C]">
              <MapPin size={16} />
              Qualquer lugar
              <ChevronDown size={16} />
            </Button>
            <ProfileMenu isMobile={true} />
          </div>
        </div>

        {/* TOPO DESKTOP */}
        {!isScrolled && (
          <div className="hidden sm:flex items-center justify-between gap-4">
            <a href="/">
              <img className="w-32" src="/logo-sf.png" alt="Logo" />
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
              <ProfileMenu />
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
                <img className="w-12" src="/icon.png" alt="Logo" />
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
              <Button variant="outline" className="bg-[#e2f0ff] text-[#02488C] border-none flex items-center gap-1 cursor-pointer hover:!bg-[#e2f0ff] hover:!text-[#02488C]">
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
              <ProfileMenu />
            </div>
          )}
        </div>

        {/* FILTROS (DESKTOP) */}
        {!isScrolled && (
          <div className="hidden sm:flex justify-center flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-[#e2f0ff] text-[#02488C] border-none cursor-pointer hover:!bg-[#e2f0ff] hover:!text-[#02488C]"
            >
              <MapPin size={16} />
              Qualquer lugar
              <ChevronDown size={16} />
            </Button>
            <Button 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
            >
              Festas & Shows
            </Button>
            <Button 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
            >
              Stand-up Comedy
            </Button>
            <Button 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
            >
              Esportes
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
