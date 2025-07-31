"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import SearchDropdown from "./SearchDropdown";
import Logo from "../../public/icons/windows11/SmallTile.scale-400.png";

import {
  CalendarPlus,
  Ticket,
  ClipboardList,
  Heart,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,  
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/useContext";
import getInitials from "@/utils/getInitials";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

type HeaderProps = {
  isScrolled?: boolean;
};

const estadosMunicipios = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

interface estadosMunicipios {
  sigla: string;
  nome: string;
}

const CidadeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Dropdown trigger content here */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        sideOffset={5}
        className="w-56"
      >
        <div className="max-h-64 overflow-y-auto">
          {estadosMunicipios.map((cidade) => (
            <DropdownMenuItem
              key={cidade.nome}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {cidade.nome}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp }) => {
  const [isScrolledInternal, setIsScrolledInternal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isScrolledProp === undefined) {
      const handleScroll = () => {
        setIsScrolledInternal(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isScrolledProp]);

  useEffect(() => {
    if (location.pathname.startsWith("/criar-evento"))
      setActiveMenu("criar-evento");
    else if (location.pathname.startsWith("/meus-eventos"))
      setActiveMenu("meus-eventos");
    else if (location.pathname.startsWith("/meus-ingressos"))
      setActiveMenu("meus-ingressos");
  }, [location.pathname]);

  const isScrolled = isScrolledProp ?? isScrolledInternal;

  const baseButtonClass =
    "cursor-pointer hover:bg-[#00498D]/10 hover:text-black transition-all duration-200";

  const ProfileMenu = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSair() {
      if (localStorage.length > 0) {
        localStorage.clear();
      }
      window.location.href = "/login";
    }

    if (!user) {
      return null;
    }

    return (
      <div className="relative" ref={dropdownRef}>
        
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="outline-none flex items-center gap-2 border-2 border-black/20 rounded-full px-3 py-2 cursor-pointer hover:bg-gray/100"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(!isOpen);
            }
          }}
        >          
          <div className="w-8 h-8 rounded-full  flex items-center justify-center text-sm font-medium text-black">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="p-1 text-black">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        </div>

        {isOpen && (
          <div
            className={cn(
              "absolute bg-white rounded-xl shadow-2xl border border-gray-100 z-50 mt-3 overflow-hidden",
              isMobile
                ? "fixed inset-x-4 top-[70px] w-auto rounded-2xl"
                : "right-0 w-64"
            )}
          >
            {/* Mobile content */}
            {isMobile && (
              <>
                <div className="p-4 ">
                  <SearchDropdown isScrolled={false} />
                </div>

                <div
                  onClick={() => {
                    navigate("/criar-evento");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <CalendarPlus className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Criar evento</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/meus-eventos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <ClipboardList className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Meus eventos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/meus-ingressos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <Ticket className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Meus ingressos</span>
                </div>

                <div className="h-px bg-gray-200 mx-4" />

                <div
                  onClick={() => {
                    navigate("/perfil");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <User className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Minha conta</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/favoritos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <Heart className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Favoritos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/question-help");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <HelpCircle className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Central de Ajuda</span>
                </div>

                <div className="h-px bg-gray-200 mx-4" />

                <div
                  onClick={handleSair}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Sair</span>
                </div>
                <div className="pb-2"></div>
              </>
            )}

            {/* Desktop content */}
            {!isMobile && (
              <>
                <div
                  onClick={() => {
                    navigate("/perfil");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <User className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Minha conta</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/favoritos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <Heart className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Favoritos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/question-help");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-black cursor-pointer transition-colors"
                >
                  <HelpCircle className="mr-3 h-5 w-5 text-black" />
                  <span className="font-medium">Central de Ajuda</span>
                </div>

                <div className="h-px bg-gray-200 mx-4" />

                <div
                  onClick={handleSair}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Sair</span>
                </div>
                <div className="pb-2"></div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-gray-100/50 transition-all duration-300",
        isScrolled ? "shadow-lg py-3" : "py-5"
      )}
    >
      <div className="container mx-auto px-10 flex flex-col gap-4">
        {/* MOBILE TOP */}
        <div className="flex items-center justify-between sm:hidden py-2">
          <a href="/" className="transition-transform hover:scale-105">
            <img className="w-10" src={Logo} alt="Logo" />
          </a>
          <div className="flex items-center gap-3">
            <CidadeDropdown />
            {user ? (
              <ProfileMenu isMobile={true} />
            ) : (
              <>
                <button
                  className="text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray/100 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>

        {/* TABLET TOP */}
        <div className="hidden sm:flex lg:hidden items-center justify-between py-2">
          <a href="/" className="transition-transform hover:scale-105">
            <img className="w-10" src={Logo} alt="Logo" />
          </a>
          <div className="flex items-center gap-3">
            <CidadeDropdown />
            {user ? (
              <ProfileMenu isMobile={true} />
            ) : (
              <>
                <button
                  className="text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray/100 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>

        {/* DESKTOP TOP */}
        {!isScrolled && (
          <div className="hidden lg:flex items-center justify-between gap-4">
            <a href="/" className="transition-transform hover:scale-105">
              <img className="w-14" src={Logo} alt="Logo" />
            </a>
            <div className="flex items-center gap-6 text-sm whitespace-nowrap">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("criar-evento");
                      navigate("/criar-evento");
                    }}
                  >
                    <CalendarPlus size={18} />
                    Criar evento
                    {activeMenu === "criar-evento" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("meus-eventos");
                      navigate("/meus-eventos");
                    }}
                  >
                    <ClipboardList size={18} />
                    Meus eventos
                    {activeMenu === "meus-eventos" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("meus-ingressos");
                      navigate("/meus-ingressos");
                    }}
                  >
                    <Ticket size={18} />
                    Meus ingressos
                    {activeMenu === "meus-ingressos" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <ProfileMenu />
                </>
              ) : (
                <>
                  <button
                    className="text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray/100 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Entrar
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SEARCH BAR - DESKTOP */}
        <div
          className={cn(
            "hidden lg:flex items-center gap-4 flex-wrap w-full",
            isScrolled ? "justify-between" : "justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              isScrolled ? "flex-1 min-w-[300px]" : "w-full justify-center"
            )}
          >
            {isScrolled && (
              <a
                href="/"
                className="transition-all duration-300 ease-out transform hover:scale-105"
              >
                <img
                  className="w-11 animate-in fade-in slide-in-from-left-2 duration-300"
                  src="/icon.png"
                  alt="Logo"
                />
              </a>
            )}
            <div
              className={cn(
                "relative animate-in fade-in duration-300 ease-out",
                isScrolled ? "w-full max-w-md" : "w-full max-w-xl mx-auto"
              )}
            >
              <SearchDropdown isScrolled={isScrolled} />
            </div>
          </div>

          {isScrolled && (
            <div className="flex items-center gap-6 text-sm whitespace-nowrap">
              <CidadeDropdown />
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("criar-evento");
                      navigate("/criar-evento");
                    }}
                  >
                    <CalendarPlus size={16} />
                    Criar evento
                    {activeMenu === "criar-evento" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("meus-eventos");
                      navigate("/meus-eventos");
                    }}
                  >
                    <ClipboardList size={16} />
                    Meus eventos
                    {activeMenu === "meus-eventos" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass} font-medium`}
                    onClick={() => {
                      setActiveMenu("meus-ingressos");
                      navigate("/meus-ingressos");
                    }}
                  >
                    <Ticket size={16} />
                    Meus ingressos
                    {activeMenu === "meus-ingressos" && (
                      <div className="absolute bottom-0 left-0 w-full  h-0.5 rounded-full" />
                    )}
                  </Button>
                  <ProfileMenu />
                </>
              ) : (
                <>
                  <button
                    className="text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray/100 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Entrar
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* FILTERS (DESKTOP) */}
        {!isScrolled && (
          <div className="hidden lg:flex justify-center flex-wrap gap-3">
            <CidadeDropdown />

            <Button
              onClick={() => {
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className="cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:scale-105 bg-white text-black"
            >
              Festas & Shows
            </Button>

            <Button
              onClick={() => {
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className="cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:scale-105 bg-white text-black"
            >
              Stand-up Comedy
            </Button>

            <Button
              onClick={() => {
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className="cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:scale-105 bg-white text-black"
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
