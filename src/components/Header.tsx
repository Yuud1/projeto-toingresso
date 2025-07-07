import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import SearchDropdown from "./SearchDropdown";

import {
  ChevronDown,
  MapPin,
  CalendarPlus,
  Ticket,
  ClipboardList,
  Heart,
  User,
  HelpCircle,
  LogOut,
  LogIn,
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
import { Avatar } from "./ui/avatar";

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
  sigla: string,
  nome: string
}

const CidadeDropdown = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [selectedCity, setSelectedCity] = useState<estadosMunicipios>(() => {
    const saved = localStorage.getItem("selectedCity");
    return saved ? JSON.parse(saved) : { nome: "Selecione", sigla: "" };
  });
  const [isOpen, setIsOpen] = useState(false);
    console.log(selectedCity);
    
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 bg-[#e2f0ff] text-[#02488C] border-none cursor-pointer hover:!bg-[#e2f0ff] hover:!text-[#02488C]"
        >
          <MapPin size={16} />
          {isMobile ? selectedCity?.sigla : selectedCity?.nome}
          <ChevronDown size={16} />
        </Button>
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
                setSelectedCity(cidade);
                localStorage.setItem("selectedCity", JSON.stringify(cidade));
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (isScrolledProp === undefined) {
      const handleScroll = () => {
        setIsScrolledInternal(window.scrollY > 50);
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
    "cursor-pointer hover:bg-transparent hover:text-inherit";

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
          className="outline-none flex items-center gap-2 border-2 border-gray-300 rounded-full px-2 py-1 cursor-pointer hover:bg-white/30"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="w-6 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            {user?.avatar ? (
              <Avatar src={user.avatar} className="w-9 h-9"></Avatar>
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div className="p-1">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>

        {isOpen && (
          <div
            className={cn(
              "absolute bg-white rounded-lg shadow-lg border border-gray-200 z-50 mt-4 ",
              isMobile
                ? "fixed inset-x-0 top-[56px] w-full rounded-none border-t border-gray-200"
                : "right-0 mt-2 w-56"
            )}
          >
            {/* Conteúdo para mobile */}
            {isMobile && (
              <>
                <div className="p-2">
                  <SearchDropdown isScrolled={false} />
                </div>

                <div
                  onClick={() => {
                    navigate("/criar-evento");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>Criar evento</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/meus-eventos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Meus eventos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/meus-ingressos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  <span>Meus ingressos</span>
                </div>

                <div className="h-px bg-gray-200 my-1" />

                <div
                  onClick={() => {
                    navigate("/perfil");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Minha conta</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/favoritos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favoritos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/question-help");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Central de Ajuda</span>
                </div>

                <div className="h-px bg-gray-200 my-1" />

                <div
                  onClick={handleSair}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </div>
              </>
            )}

            {/* Conteúdo para desktop */}
            {!isMobile && (
              <>
                <div
                  onClick={() => {
                    navigate("/perfil");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Minha conta</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/favoritos");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favoritos</span>
                </div>

                <div
                  onClick={() => {
                    navigate("/question-help");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Central de Ajuda</span>
                </div>

                <div className="h-px bg-gray-200 my-1" />

                <div
                  onClick={handleSair}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </div>
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
        "fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm p-5",
        isScrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex flex-col gap-4">
        {/* TOPO MOBILE */}
        <div className="flex items-center justify-between sm:hidden py-2">
          <a href="/">
            <img className="w-10" src="/icon.png" alt="Logo" />
          </a>
          <div className="flex items-center gap-3">
            <CidadeDropdown isMobile={true} />
            {user ? (
              <ProfileMenu isMobile={true} />
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>

        {/* TOPO DESKTOP */}
        {!isScrolled && (
          <div className="hidden sm:flex items-center justify-between gap-4">
            <a href="/">
              <img className="w-32" src="/logo-sf.png" alt="Logo" />
            </a>
            <div
              className={cn(
                "flex items-center gap-4 text-sm text-muted-foreground whitespace-nowrap"
              )}
            >
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("criar-evento");
                      navigate("/criar-evento");
                    }}
                  >
                    <CalendarPlus size={16} />
                    Criar evento
                    {activeMenu === "criar-evento" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("meus-eventos");
                      navigate("/meus-eventos");
                    }}
                  >
                    <ClipboardList size={16} />
                    Meus eventos
                    {activeMenu === "meus-eventos" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("meus-ingressos");
                      navigate("/meus-ingressos");
                    }}
                  >
                    <Ticket size={16} />
                    Meus ingressos
                    {activeMenu === "meus-ingressos" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <ProfileMenu />
                </>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <LogIn size={16} />
                  <span>Entrar</span>
                </Button>
              )}
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
            <div
              className={cn(
                "flex items-center gap-4 text-sm text-muted-foreground whitespace-nowrap"
              )}
            >
              <CidadeDropdown />
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("criar-evento");
                      navigate("/criar-evento");
                    }}
                  >
                    <CalendarPlus size={16} />
                    Criar evento
                    {activeMenu === "criar-evento" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("meus-eventos");
                      navigate("/meus-eventos");
                    }}
                  >
                    <ClipboardList size={16} />
                    Meus eventos
                    {activeMenu === "meus-eventos" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className={`relative flex items-center gap-2 ${baseButtonClass}`}
                    onClick={() => {
                      setActiveMenu("meus-ingressos");
                      navigate("/meus-ingressos");
                    }}
                  >
                    <Ticket size={16} />
                    Meus ingressos
                    {activeMenu === "meus-ingressos" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
                    )}
                  </Button>
                  <ProfileMenu />
                </>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <LogIn size={16} />
                  <span>Entrar</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* FILTROS (DESKTOP) */}
        {!isScrolled && (
          <div className="hidden sm:flex justify-center flex-wrap gap-2">
            <CidadeDropdown />

            <Button
              onClick={() => {
                setActiveFilter("festas-shows");
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className={cn(
                "relative cursor-pointer px-4 py-2",
                activeFilter === "festas-shows"
                  ? "!bg-[#02488C] !text-white"
                  : "!bg-white !text-[#02488C]"
              )}
            >
              Festas & Shows
            </Button>

            <Button
              onClick={() => {
                setActiveFilter("standup");
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className={cn(
                "relative cursor-pointer px-4 py-2",
                activeFilter === "standup"
                  ? "!bg-[#02488C] !text-white"
                  : "!bg-white !text-[#02488C]"
              )}
            >
              Stand-up Comedy
            </Button>

            <Button
              onClick={() => {
                setActiveFilter("esportes");
                const target = document.getElementById("filter-grid");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="secondary"
              className={cn(
                "relative cursor-pointer px-4 py-2",
                activeFilter === "esportes"
                  ? "!bg-[#02488C] !text-white"
                  : "!bg-white !text-[#02488C]"
              )}
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
