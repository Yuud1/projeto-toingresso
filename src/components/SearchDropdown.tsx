import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";

interface SearchDropdownProps {
  isScrolled?: boolean;
  className?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  isScrolled = false, 
  className 
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<EventInterface[]>([]);
  console.log("results",results);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Função para buscar eventos
  const searchEvents = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GET_FILTERED_EVENTS
        }`,
        {
          params: { querySearch: searchQuery },
        }
      );
      
      // Verificar diferentes possíveis estruturas da resposta
      let eventos = [];
      if (response.data.eventos) {
        eventos = response.data.eventos;
      } else if (response.data.events) {
        eventos = response.data.events;
      } else if (Array.isArray(response.data)) {
        eventos = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        eventos = response.data.data;
      }
      
      if (eventos.length > 0) {
        setResults(eventos.slice(0, 6)); // Limita a 6 resultados
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {        
        searchEvents(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegação com teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (event: EventInterface) => {
    navigate(`/evento/${event._id}`);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Pesquisar eventos, shows, teatros, cursos"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query && results.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-12 pr-6 text-base shadow-lg rounded-xl transition-all duration-300",
            isScrolled ? "py-5" : "py-7"
          )}
        />
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02488C] mx-auto mb-2"></div>
              <p>Buscando eventos...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((event, index) => (
                <div
                  key={event._id}
                  onClick={() => handleResultClick(event)}
                  className={cn(
                    "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                    selectedIndex === index && "bg-[#e2f0ff] hover:bg-[#e2f0ff]"
                  )}
                >
                  {/* Imagem do evento */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/flyer1.jpg"; // Imagem padrão
                      }}
                    />
                  </div>

                  {/* Informações do evento */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span className="truncate">{event.venueName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(event.dates[0].startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatTime(event.dates[0].startTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {event.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={12} />
                        <span>{event.batches[0].tickets.length} tipos de ingresso</span>
                      </div>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="flex-shrink-0 text-right">
                    {event.isFree ? (
                      <span className="text-green-600 font-semibold text-sm">Grátis</span>
                    ) : (
                      <span className="text-[#02488C] font-semibold text-sm">
                        A partir de R$ {Math.min(...event.batches[0].tickets.map(t => t.price))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 text-gray-400" />
              <p>Nenhum evento encontrado para "{query}"</p>
              <p className="text-xs mt-1">Tente usar termos diferentes</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown; 