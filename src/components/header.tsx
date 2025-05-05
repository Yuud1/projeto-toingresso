import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

const cidadesTocantins = [
  "Palmas",
  "Gurupi",
  "Araguaína",
  "Porto Nacional",
  "Paraíso do Tocantins",
  "Guaraí",
  "Dianópolis",
  "Miracema do Tocantins",
  "Formoso do Araguaia",
  "Pedro Afonso",
  "Tocantinópolis",
];

const CidadeDropdown = () => {
  const [selectedCity, setSelectedCity] = useState("Qualquer lugar");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu 
      open={isOpen} 
      onOpenChange={setIsOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 bg-[#e2f0ff] text-[#02488C] border-none cursor-pointer hover:!bg-[#e2f0ff] hover:!text-[#02488C]">
          <MapPin size={16} />
          {selectedCity}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center"
        side="bottom"
        sideOffset={5}
        className="w-56"
      >
        <DropdownMenuItem onClick={() => {
          setSelectedCity("Qualquer lugar");
          setIsOpen(false);
        }}>
          Qualquer lugar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {cidadesTocantins.map((cidade) => (
          <DropdownMenuItem 
            key={cidade} 
            onClick={() => {
              setSelectedCity(cidade);
              setIsOpen(false);
            }}
          >
            {cidade}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp }) => {
  const [isScrolledInternal, setIsScrolledInternal] = useState(false);
  const navigate = useNavigate();

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
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="outline-none flex items-center gap-2 border rounded-full px-2 py-1 cursor-pointer hover:bg-gray-50"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            LY
          </div>
          <div className="p-1">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>

        {isOpen && (
          <div 
            className={cn(
              "absolute bg-white rounded-lg shadow-lg border border-gray-200 z-50",
              isMobile
                ? "fixed inset-x-0 top-[56px] w-full rounded-none border-t border-gray-200"
                : "right-0 mt-2 w-56"
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
                <div 
                  onClick={() => navigate('/criar-evento')} 
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>Criar evento</span>
                </div>
                <div 
                  onClick={() => {/* ação */}} 
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Meus eventos</span>
                </div>
                <div 
                  onClick={() => navigate('/meus-ingressos')} 
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  <span>Meus ingressos</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
              </>
            )}
            <div 
              onClick={() => window.location.href = '/perfil'} 
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Minha conta</span>
            </div>
            <div 
              onClick={() => navigate('/favoritos')} 
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4" />
              <span>Favoritos</span>
            </div>
            <div 
              onClick={() => window.location.href = '/question-help'} 
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Central de Ajuda</span>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div 
              onClick={() => {/* ação de logout */}} 
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </div>
          </div>
        )}
      </div>
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
            <CidadeDropdown />
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
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 ${baseButtonClass}`}
                onClick={() => navigate('/criar-evento')}
              >
                <CalendarPlus size={16} />
                Criar evento
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <ClipboardList size={16} />
                Meus eventos
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 ${baseButtonClass}`}
                onClick={() => navigate('/meus-ingressos')}
              >
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <CidadeDropdown />
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 ${baseButtonClass}`}
                onClick={() => navigate('/criar-evento')}
              >
                <CalendarPlus size={16} />
                Criar evento
              </Button>
              <Button variant="ghost" className={`flex items-center gap-2 ${baseButtonClass}`}>
                <ClipboardList size={16} />
                Meus eventos
              </Button>
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 ${baseButtonClass}`}
                onClick={() => navigate('/meus-ingressos')}
              >
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
            <CidadeDropdown />
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
