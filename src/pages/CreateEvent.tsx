import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, ImageIcon, Tag, Ticket } from "lucide-react";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { toast } from "sonner";
import FormBuilder from "@/components/FormBuilder";
import FormDataInterface from "@/interfaces/FormDataInterface";
import TicketType from "@/interfaces/TicketTypeInterface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const estadosMunicipios = {
  AC: { nome: "Acre" },
  AL: { nome: "Alagoas" },
  AP: { nome: "Amapá" },
  AM: { nome: "Amazonas" },
  BA: { nome: "Bahia" },
  CE: { nome: "Ceará" },
  DF: { nome: "Distrito Federal" },
  ES: { nome: "Espírito Santo" },
  GO: { nome: "Goiás" },
  MA: { nome: "Maranhão" },
  MT: { nome: "Mato Grosso" },
  MS: { nome: "Mato Grosso do Sul" },
  MG: { nome: "Minas Gerais" },
  PA: { nome: "Pará" },
  PB: { nome: "Paraíba" },
  PR: { nome: "Paraná" },
  PE: { nome: "Pernambuco" },
  PI: { nome: "Piauí" },
  RJ: { nome: "Rio de Janeiro" },
  RN: { nome: "Rio Grande do Norte" },
  RS: { nome: "Rio Grande do Sul" },
  RO: { nome: "Rondônia" },
  RR: { nome: "Roraima" },
  SC: { nome: "Santa Catarina" },
  SP: { nome: "São Paulo" },
  SE: { nome: "Sergipe" },
  TO: { nome: "Tocantins" },
};

const CATEGORIES = [
  { value: "shows", label: "Shows" },
  { value: "teatro", label: "Teatro" },
  { value: "esportes", label: "Esportes" },
  { value: "festas", label: "Festas" },
  { value: "comedia", label: "Comédia" },
  { value: "gospel", label: "Gospel" },
];

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clickedGratuito, setClickedGratuito] = useState(false);
  const [buscandoCoordenadas, setBuscandoCoordenadas] = useState(false);
  const [coordenadasEncontradas, setCoordenadasEncontradas] = useState(false);
  const [buscandoSugestoes, setBuscandoSugestoes] = useState(false);
  const [sugestoesEndereco, setSugestoesEndereco] = useState<any[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [municipiosPorUF, setMunicipiosPorUF] = useState<
    Record<string, string[]>
  >({});
  console.log(errors);

  const [formData, setFormData] = useState<FormDataInterface & { searchAddress?: string }>({
    title: "",
    image: null,
    category: "",
    startDate: "",
    startTime: "",
    formTitle: "",
    endDate: "",
    endTime: "",
    description: "",
    policy: "",
    venueName: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    tickets: [],
    isFree: false,
    customFields: [],
    acceptedTerms: false,
    token: localStorage.getItem("token"),
    status: "active",
    searchAddress: "",
  });

  // Função de busca de estado

  const buscarMunicipios = async (sigla: string) => {
    if (municipiosPorUF[sigla]) return;

    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`
      );
      const data = await res.json();
      const nomes = data.map((m: any) => m.nome);
      setMunicipiosPorUF((prev) => ({ ...prev, [sigla]: nomes }));
    } catch (err) {
      console.error("Erro ao buscar municípios:", err);
    }
  };

  // Função para buscar coordenadas pelo CEP
  const buscarCoordenadasPorCEP = async (cep: string) => {
    if (!cep || cep.length < 8) return;

    setBuscandoCoordenadas(true);
    try {
      // Primeiro tenta buscar pelo CEP
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await cepResponse.json();

      if (!cepData.erro) {
        // Monta o endereço completo
        const endereco = `${cepData.logradouro}, ${formData.number}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, ${cep}`;
        
        // Usa o Google Geocoding para obter coordenadas
        const geocodingResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const geocodingData = await geocodingResponse.json();

        if (geocodingData.results && geocodingData.results.length > 0) {
          const location = geocodingData.results[0].geometry.location;
          setFormData(prev => ({
            ...prev,
            latitude: location.lat.toString(),
            longitude: location.lng.toString(),
            street: cepData.logradouro || prev.street,
            neighborhood: cepData.bairro || prev.neighborhood,
            city: cepData.localidade || prev.city,
            state: cepData.uf || prev.state
          }));
          setCoordenadasEncontradas(true);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
    } finally {
      setBuscandoCoordenadas(false);
    }
  };

  // Função para buscar sugestões de endereço
  const buscarSugestoesEndereco = async (query: string) => {
    try {
      setBuscandoSugestoes(true);
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      // Usar apenas Geocoding API (sem problemas de CORS)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}&region=br&language=pt-BR`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Formatar resultados do geocoding
        const formattedResults = data.results.slice(0, 5).map((result: any) => ({
          place_id: null,
          description: result.formatted_address,
          structured_formatting: {
            main_text: result.formatted_address.split(',')[0],
            secondary_text: result.formatted_address.split(',').slice(1).join(',').trim()
          },
          formatted_address: result.formatted_address,
          address_components: result.address_components,
          geometry: result.geometry
        }));
        setSugestoesEndereco(formattedResults);
      } else {
        setSugestoesEndereco([]);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSugestoesEndereco([]);
    } finally {
      setBuscandoSugestoes(false);
    }
  };

  // Função para selecionar uma sugestão
  const selecionarSugestao = async (sugestao: any) => {
    try {
      // Usar dados já obtidos do geocoding
      const location = sugestao.geometry.location;
      const addressComponents = sugestao.address_components;
      
      // Extrair informações do endereço
      let street = "";
      let number = "";
      let neighborhood = "";
      let city = "";
      let state = "";
      let zipCode = "";
      let venueName = "";
      
      // Tentar extrair nome do estabelecimento do endereço
      const addressParts = sugestao.formatted_address.split(',');
      if (addressParts.length > 0) {
        venueName = addressParts[0].trim();
      }
      
      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes("route")) {
          street = component.long_name;
        } else if (types.includes("street_number")) {
          number = component.long_name;
        } else if (types.includes("sublocality") || types.includes("neighborhood")) {
          neighborhood = component.long_name;
        } else if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });
      
      // Atualizar formulário com todos os dados
      setFormData(prev => ({
        ...prev,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        venueName: venueName || prev.venueName,
        street: street || prev.street,
        number: number || prev.number,
        neighborhood: neighborhood || prev.neighborhood,
        city: city || prev.city,
        state: state || prev.state,
        zipCode: zipCode || prev.zipCode,
        searchAddress: sugestao.formatted_address
      }));
      
      setCoordenadasEncontradas(true);
      toast.success(`Local selecionado: ${venueName || sugestao.formatted_address}`);
      
      // Limpar sugestões
      setSugestoesEndereco([]);
      
    } catch (error) {
      console.error('Erro ao selecionar sugestão:', error);
      toast.error('Erro ao selecionar local. Tente novamente.');
    }
  };

  // Função para buscar endereço reverso usando coordenadas
  const buscarEnderecoPorCoordenadas = async (lat: number, lng: number) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        // Extrair informações do endereço
        let street = "";
        let number = "";
        let neighborhood = "";
        let city = "";
        let state = "";
        let zipCode = "";
        let venueName = "";
        
        // Tentar extrair o nome do local (establishment)
        if (result.types && result.types.includes("establishment")) {
          venueName = result.name || "";
        }
        
        addressComponents.forEach((component: any) => {
          const types = component.types;
          if (types.includes("route")) {
            street = component.long_name;
          } else if (types.includes("street_number")) {
            number = component.long_name;
          } else if (types.includes("sublocality") || types.includes("neighborhood")) {
            neighborhood = component.long_name;
          } else if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
        
        // Atualizar o formulário com os dados encontrados
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
          venueName: venueName || prev.venueName,
          street: street || prev.street,
          number: number || prev.number,
          neighborhood: neighborhood || prev.neighborhood,
          city: city || prev.city,
          state: state || prev.state,
          zipCode: zipCode || prev.zipCode
        }));
        
        setCoordenadasEncontradas(true);
        toast.success(`Localização selecionada! ${venueName ? `Local: ${venueName}` : 'Endereço atualizado automaticamente.'}`);
      }
    } catch (error) {
      console.error('Erro ao buscar endereço por coordenadas:', error);
      toast.error('Erro ao buscar endereço. Tente novamente.');
    }
  };

  // Função para gerar URL do mapa com coordenadas
  const getMapUrl = () => {
    if (formData.latitude && formData.longitude) {
      return `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`;
    }
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr";
  };

  // Função para validar os campos da etapa atual
  const validateCurrentStep = useCallback(() => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Informações Básicas
        if (!formData.title.trim())
          newErrors.title = "Nome do evento é obrigatório";
        if (!formData.category) newErrors.category = "Categoria é obrigatória";
        break;

      case 2: // Data e Horário
        if (!formData.startDate)
          newErrors.startDate = "Data de início é obrigatória";
        if (!formData.startTime)
          newErrors.startTime = "Hora de início é obrigatória";
        if (!formData.endDate)
          newErrors.endDate = "Data de término é obrigatória";
        if (!formData.endTime)
          newErrors.endTime = "Hora de término é obrigatória";

        // Validação adicional para datas
        if (formData.startDate && formData.endDate) {
          const startDate = new Date(formData.startDate);
          const endDate = new Date(formData.endDate);

          if (endDate < startDate) {
            newErrors.endDate =
              "Data de término não pode ser anterior à data de início";
          }
        }
        break;

      case 3: // Descrição
        if (!formData.description.trim())
          newErrors.description = "Descrição é obrigatória";
        if (!formData.policy.trim())
          newErrors.policy = "Política do evento é obrigatória";
        break;

      case 4: // Local
        if (!formData.venueName.trim())
          newErrors.venueName = "Nome do local é obrigatório";
        if (!formData.zipCode || formData.zipCode.length < 8)
          newErrors.zipCode = "CEP inválido";
        if (!formData.street.trim()) newErrors.street = "Rua é obrigatória";
        if (!formData.number.trim()) newErrors.number = "Número é obrigatório";
        if (!formData.neighborhood.trim())
          newErrors.neighborhood = "Bairro é obrigatório";
        if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
        if (!formData.state) newErrors.state = "Estado é obrigatório";
        break;

      case 5: // Ingressos
        if (formData.tickets.length === 0 && formData.isFree === false) {
          newErrors.tickets = "Pelo menos um tipo de ingresso é obrigatório";
        } else {
          formData.tickets.forEach((ticket, index) => {
            if (!ticket.name.trim())
              newErrors[`ticket-${index}-name`] =
                "Nome do ingresso é obrigatório";
            if (ticket.price <= 0)
              newErrors[`ticket-${index}-price`] =
                "Preço deve ser maior que zero";
            if (ticket.quantity <= 0)
              newErrors[`ticket-${index}-quantity`] =
                "Quantidade deve ser maior que zero";
          });
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  // Funções de formatação memoizadas
  const formatCEP = useCallback((cep: string) => {
    if (!cep) return "";
    cep = cep.replace(/\D/g, "");
    if (cep.length > 5) {
      return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }
    return cep;
  }, []);

  const formatNumber = useCallback((number: string) => {
    if (!number) return "";
    return number.replace(/\D/g, "");
  }, []);

  // Manipuladores de eventos memoizados
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
      }
    },
    []
  );

  const nextStep = useCallback(() => {
    if (
      formData.isFree &&
      formData.customFields.length == 0 &&
      currentStep == 5
    ) {
      setErrors((prev) => ({
        ...prev,
        customFields:
          "Você deve adicionar pelo menos um campo de formulário para eventos gratuitos.",
      }));
      toast.error(
        "Você deve adicionar pelo menos um campo de formulário para eventos gratuitos."
      );
      console.log("naoo cadastrei o evento");
      throw new Error(
        "Nenhum campo de formulário adicionado para eventos gratuitos."
      );
    }

    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios");
    }
  }, [validateCurrentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setFormData((prev) => ({ ...prev, acceptedTerms: false }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.acceptedTerms) {
        toast.error("Você deve aceitar os termos e condições");
        return;
      }

      if (!validateCurrentStep()) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      try {
        setLoading(true);
        const data = new FormData();

        if (formData.image) {
          data.append("image", formData.image);
        }

        // Gerar URL do mapa antes de enviar
        const mapUrl = formData.latitude && formData.longitude 
          ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${formData.latitude},${formData.longitude}&zoom=15`
          : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr";

        const formDataToSend = {
          ...formData,
          mapUrl: mapUrl
        };

        const { image, ...rest } = formDataToSend;
        data.append("formData", JSON.stringify(rest));

        console.log(formData);
        if (formData.isFree && formData.customFields.length == 0) {
          toast.error(
            "Você deve adicionar pelo menos um campo de formulário para eventos gratuitos."
          );
          console.log("naoo cadastrei o evento");
          throw new Error(
            "Nenhum campo de formulário adicionado para eventos gratuitos."
          );
        }

        console.log("cadastrei o evento");
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_CREATE_EVENT
          }`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${formData.token}`,
            },
          }
        );

        if (response.data.saved) {
          setCreated(true);
          toast.success("Evento criado com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao criar Evento", error);
        toast.error("Erro ao criar evento. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [formData, validateCurrentStep]
  );

  // Efeito para redirecionar após criação
  useEffect(() => {
    if (created) {
      window.location.href = "/";
    }
  }, [created]);

  // Componente para renderizar o progresso
  const renderProgressSteps = () => {
    const totalSteps = 6;
    const steps = [1, 2, 3, 4, 5, 6];
    const stepLabels = [
      "Informações",
      "Data/Hora",
      "Descrição",
      "Local",
      "Ingressos",
      "Termos",
    ];

    return (
      <>
        {/* Desktop version - mostra todos os steps */}
        <div className="hidden md:flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-[#02488C] transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step) => (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step === currentStep
                    ? "bg-[#02488C] text-white border-4 border-[#e2f0ff] ring-4 ring-[#02488C]/20"
                    : step < currentStep
                    ? "bg-[#02488C] text-white"
                    : "bg-white border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step < currentStep ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              <span
                className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                  step === currentStep
                    ? "text-[#02488C]"
                    : step < currentStep
                    ? "text-[#02488C]"
                    : "text-gray-500"
                }`}
              >
                {stepLabels[step - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile version - mostra apenas anterior, atual e próximo */}
        <div className="md:hidden mb-8">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-200 mb-6">
            <div
              className="h-full bg-[#02488C] transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps container */}
          <div className="flex items-center justify-center space-x-4">
            {/* Lógica simplificada para mostrar apenas os steps relevantes */}
            {(() => {
              // Determina quais steps mostrar
              let stepsToShow = [];

              if (currentStep === 1) {
                // No primeiro step, mostrar apenas atual e próximo
                stepsToShow = [1, 2];
              } else if (currentStep === 6) {
                // No último step, mostrar apenas anterior e atual
                stepsToShow = [5, 6];
              } else {
                // Nos steps intermediários, mostrar anterior, atual e próximo
                stepsToShow = [currentStep - 1, currentStep, currentStep + 1];
              }

              return stepsToShow.map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? "bg-[#02488C] text-white border-2 border-[#e2f0ff] ring-2 ring-[#02488C]/20"
                        : step < currentStep
                        ? "bg-[#02488C] text-white"
                        : "bg-white border-2 border-gray-300 text-gray-500"
                    }`}
                  >
                    {step < currentStep ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${
                      step === currentStep
                        ? "text-[#02488C]"
                        : step < currentStep
                        ? "text-[#02488C]"
                        : "text-gray-500"
                    }`}
                  >
                    {stepLabels[step - 1]}
                  </span>
                </div>
              ));
            })()}
          </div>

          {/* Current step indicator */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Etapa {currentStep} de {totalSteps}
            </span>
          </div>
        </div>
      </>
    );
  };

  // Componente para renderizar a navegação
  const renderNavigation = () => (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="cursor-pointer"
        >
          Voltar
        </Button>
      )}
      {currentStep < 6 ? (
        <Button
          type="button"
          onClick={nextStep}
          className="ml-auto cursor-pointer"
        >
          Próximo
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-auto"
          disabled={!formData.acceptedTerms || loading}
        >
          {loading ? "Publicando..." : "Publicar Evento"}
        </Button>
      )}
    </div>
  );

  // Componente para renderizar o upload de imagem
  const renderImageUpload = () => (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
      <div className="space-y-2 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <ImageIcon size={48} className="mx-auto" />
        </div>
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="image-upload"
            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <span>Carregar arquivo</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
          <p className="pl-1">ou arraste e solte</p>
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, GIF até 10MB (Recomendado: 1200x600px)
        </p>
        {formData.image && (
          <p className="text-sm text-green-600">
            Arquivo selecionado: {formData.image.name}
          </p>
        )}
      </div>
    </div>
  );

  // Função para renderizar mensagem de erro
  const renderError = (field: string) =>
    errors[field] && (
      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    );

  // Componente para renderizar cada passo do formulário
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              1. Informações Básicas
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do evento *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Digite o nome do seu evento"
                className="w-full"
                required
              />
              {renderError("title")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de divulgação
              </label>
              {renderImageUpload()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full pl-10 p-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              {renderError("category")}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              2. Data e Horário
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  field: "startDate",
                  label: "Data de Início",
                  error: errors.startDate,
                },
                {
                  field: "startTime",
                  label: "Hora de Início",
                  error: errors.startTime,
                },
                {
                  field: "endDate",
                  label: "Data de Término",
                  error: errors.endDate,
                },
                {
                  field: "endTime",
                  label: "Hora de Término",
                  error: errors.endTime,
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.label} *
                  </label>
                  <div className="relative">
                    {item.label.includes("Hora") ? (
                      <Clock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    ) : (
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    )}
                    <Input
                      type={item.label.includes("Hora") ? "time" : "date"}
                      value={
                        formData[
                          item.field as keyof FormDataInterface
                        ] as string
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [item.field]: e.target.value,
                        }))
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                  {item.error && (
                    <p className="mt-1 text-sm text-red-600">{item.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              3. Descrição do Evento
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva seu evento de forma detalhada..."
                className="w-full h-48"
                required
              />
              {renderError("description")}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              4. Política do Evento
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                value={formData.policy}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, policy: e.target.value }))
                }
                placeholder="Descreva as políticas do seu evento de forma detalhada..."
                className="w-full h-48"
                required
              />
              {renderError("policy")}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              5. Local do Evento
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Local *
              </label>
              <Input
                type="text"
                value={formData.venueName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    venueName: e.target.value,
                  }))
                }
                placeholder="Ex: Teatro Municipal"
                className="w-full"
                required
              />
              {renderError("venueName")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatCEP(formData.zipCode)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, zipCode: rawValue }));
                      setCoordenadasEncontradas(false);
                      
                      // Busca coordenadas quando o CEP estiver completo
                      if (rawValue.length === 8) {
                        buscarCoordenadasPorCEP(rawValue);
                      }
                    }}
                    placeholder="00000-000"
                    className="w-full"
                    maxLength={9}
                    required
                  />
                  {buscandoCoordenadas && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {renderError("zipCode")}
                {buscandoCoordenadas && (
                  <p className="mt-1 text-sm text-blue-600">Buscando localização...</p>
                )}
                {coordenadasEncontradas && !buscandoCoordenadas && (
                  <p className="mt-1 text-sm text-green-600">✓ Localização encontrada!</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Av./Rua *
                </label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, street: e.target.value }))
                  }
                  className="w-full"
                  required
                />
                {renderError("street")}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <Input
                  type="text"
                  value={formatNumber(formData.number)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, number: rawValue }));
                  }}
                  className="w-full"
                  maxLength={6}
                  required
                />
                {renderError("number")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <Input
                  type="text"
                  value={formData.complement}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      complement: e.target.value,
                    }))
                  }
                  placeholder="Apto, Sala, Conjunto..."
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <Input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      neighborhood: e.target.value,
                    }))
                  }
                  className="w-full"
                  required
                />
                {renderError("neighborhood")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o Estado *
                </label>
                <Select
                  onValueChange={async (sigla) => {
                    console.log("Sigla", sigla);

                    setFormData((prev) => ({
                      ...prev,
                      state: sigla,
                      city: "",
                    }));
                    await buscarMunicipios(sigla);
                  }}
                  value={formData.state}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(estadosMunicipios).map(
                      ([sigla, { nome }]) => (
                        <SelectItem key={sigla} value={sigla}>
                          {nome}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {renderError("city")}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione a Cidade
                </label>
                <Select
                  onValueChange={(municipio) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: municipio,
                    }))
                  }
                  value={formData.city}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        formData.city
                          ? "Selecione um estado primeiro"
                          : "Selecione o município"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(municipiosPorUF[formData.state] || []).map(
                      (municipio) => (
                        <SelectItem key={municipio} value={municipio}>
                          {municipio}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {renderError("state")}
              </div>
            </div>

            {/* Busca de Local */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Buscar Local
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digite o nome do local ou endereço
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Ex: Shopping Ibirapuera, Teatro Municipal, Rua das Flores 123..."
                      className="w-full pr-10"
                      value={formData.searchAddress || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, searchAddress: value }));
                        
                        // Limpar timeout anterior
                        if (searchTimeout) {
                          clearTimeout(searchTimeout);
                        }
                        
                        // Buscar sugestões com debounce
                        if (value.length > 2) {
                          const timeout = setTimeout(() => {
                            buscarSugestoesEndereco(value);
                          }, 500); // 500ms de delay
                          setSearchTimeout(timeout);
                        } else {
                          setSugestoesEndereco([]);
                        }
                      }}
                    />
                    {buscandoSugestoes && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Lista de sugestões */}
                  {sugestoesEndereco.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                      {sugestoesEndereco.map((sugestao, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selecionarSugestao(sugestao)}
                        >
                          <div className="font-medium text-gray-900">
                            {sugestao.structured_formatting?.main_text || sugestao.name || sugestao.description?.split(',')[0]}
                          </div>
                          <div className="text-sm text-gray-600">
                            {sugestao.structured_formatting?.secondary_text || sugestao.formatted_address || sugestao.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Botão para buscar endereço atual */}
                {formData.latitude && formData.longitude && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const lat = parseFloat(formData.latitude);
                      const lng = parseFloat(formData.longitude);
                      if (!isNaN(lat) && !isNaN(lng)) {
                        buscarEnderecoPorCoordenadas(lat, lng);
                      }
                    }}
                    className="w-full"
                  >
                    🔄 Atualizar endereço das coordenadas atuais
                  </Button>
                )}
              </div>
            </div>

            {/* Mapa */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Visualização no Mapa
              </h3>
              
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border">
                <iframe
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  O mapa será atualizado automaticamente com a localização selecionada.
                </p>
                
                {formData.latitude && formData.longitude && (
                  <div className="mt-2 text-sm text-green-600">
                    <p>✓ Localização definida: {formData.latitude}, {formData.longitude}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              6. Ingressos
            </h2>

            {errors.tickets && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.tickets}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Que tipo de ingresso você deseja criar?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    type: "regular",
                    label: "Ingresso Regular",
                    description: "Ingresso com preço padrão",
                  },
                  {
                    type: "student",
                    label: "Meia-Entrada",
                    description: "Ingresso com 50% de desconto",
                  },
                  {
                    type: "free",
                    label: "Gratuito",
                    description:
                      "Valide seu evento com formulário de inscrição",
                  },
                ].map((ticketType, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const newTicket: TicketType = {
                          name: "",
                          price: 0,
                          quantity: 0,
                          description: "",
                          type: ticketType.type as TicketType["type"],
                        };

                        if (ticketType.type != "free") {
                          setFormData((prev) => ({
                            ...prev,
                            tickets: [...prev.tickets, newTicket],
                            customFields: [],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            tickets: [],
                          }));
                        }

                        setErrors((prev) => ({ ...prev, tickets: "" }));

                        // Se for o ingresso gratuito (índice 2), avançar o step
                        if (ticketType.type === "free") {
                          setFormData((prev) => ({
                            ...prev,
                            isFree: true,
                          }));
                          setClickedGratuito(true);
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            isFree: false,
                          }));
                          setClickedGratuito(false);
                        }
                      }}
                      className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                    >
                      <div className="text-center">
                        <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h4 className="font-medium text-gray-900">
                          {ticketType.label}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {ticketType.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.tickets.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Ingressos Criados
                  </h4>
                  <div className="space-y-4">
                    {formData.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome do Ingresso *
                            </label>
                            <Input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => {
                                const updatedTickets = [...formData.tickets];
                                updatedTickets[index].name = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  tickets: updatedTickets,
                                }));
                                setErrors((prev) => ({
                                  ...prev,
                                  [`ticket-${index}-name`]: "",
                                }));
                              }}
                              placeholder="Ex: VIP, Camarote, Pista"
                              className="w-full"
                              required
                            />
                            {renderError(`ticket-${index}-name`)}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preço *
                            </label>
                            <NumericFormat
                              value={ticket.price}
                              onValueChange={({ floatValue }) => {
                                const updatedTickets = [...formData.tickets];
                                updatedTickets[index].price = floatValue ?? 0;
                                setFormData((prev) => ({
                                  ...prev,
                                  tickets: updatedTickets,
                                }));
                                setErrors((prev) => ({
                                  ...prev,
                                  [`ticket-${index}-price`]: "",
                                }));
                              }}
                              thousandSeparator="."
                              decimalSeparator=","
                              prefix="R$ "
                              allowNegative={false}
                              decimalScale={2}
                              fixedDecimalScale
                              placeholder="R$ 0,00"
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                            {renderError(`ticket-${index}-price`)}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantidade Disponível *
                            </label>
                            <Input
                              type="number"
                              value={ticket.quantity}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                  const updatedTickets = [...formData.tickets];
                                  updatedTickets[index].quantity = value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    tickets: updatedTickets,
                                  }));
                                  setErrors((prev) => ({
                                    ...prev,
                                    [`ticket-${index}-quantity`]: "",
                                  }));
                                }
                              }}
                              placeholder="0"
                              className="w-full"
                              min="0"
                              required
                            />
                            {renderError(`ticket-${index}-quantity`)}
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 text-red-600 hover:text-red-700 cursor-pointer"
                          onClick={() => {
                            const updatedTickets = formData.tickets.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              tickets: updatedTickets,
                            }));
                          }}
                        >
                          Remover Ingresso
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {clickedGratuito ? (
              <FormBuilder form={formData} setForm={setFormData}></FormBuilder>
            ) : null}
            <div className="ml-5">
              <p className="mt-1 text-sm text-red-600">{errors.customFields}</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">
              7. Responsabilidades
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({ ...prev, acceptedTerms: checked }))
                  }
                  className="cursor-pointer"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceitar termos e condições
                  </label>
                  <p className="text-sm text-gray-500">
                    Ao publicar este evento, estou de acordo com os{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Termos de uso
                    </a>
                    , com as{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Diretrizes de Comunidade
                    </a>{" "}
                    e com as{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Regras de meia-entrada
                    </a>
                    , bem como declaro estar ciente da{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Política de Privacidade
                    </a>{" "}
                    e das{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Obrigatoriedades Legais
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header isScrolled={true} />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderProgressSteps()}
              {renderStep()}
              {renderNavigation()}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
