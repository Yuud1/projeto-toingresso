"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ImageIcon,
  Tag,
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  Upload,
  Search,
  Plus,
  Trash2,
  Music,
  Ticket,
  RollerCoaster,
  PartyPopper,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormBuilder from "@/components/FormBuilder";
import type FormDataInterface from "@/interfaces/FormDataInterface";
import Header from "@/components/Header";
import { FaFootballBall, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { formatDateTimeForInput } from "@/utils/formatUtils";

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
  { value: "shows", label: "Shows", icon: Music },
  { value: "teatro", label: "Teatro", icon: Users },
  { value: "esportes", label: "Esportes", icon: FaFootballBall },
  { value: "festas", label: "Festas", icon: PartyPopper },
  { value: "comedia", label: "Comédia", icon: Users },
  { value: "gospel", label: "Gospel", icon: Music },
  { value: "diversões", label: "Diversões", icon: RollerCoaster },
  { value: "publico", label: "Evento Público", icon: Users },
  { value: "outros", label: "Outros", icon: FaQuestionCircle },
];

export default function EditEvent() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [buscandoCoordenadas, setBuscandoCoordenadas] = useState(false);
  const [coordenadasEncontradas, setCoordenadasEncontradas] = useState(false);
  const [buscandoSugestoes, setBuscandoSugestoes] = useState(false);
  const [sugestoesEndereco, setSugestoesEndereco] = useState<any[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [municipiosPorUF, setMunicipiosPorUF] = useState<
    Record<string, string[]>
  >({});

  const [formData, setFormData] = useState<
    FormDataInterface & { searchAddress?: string }
  >({
    title: "",
    image: null,
    category: "",
    dates: [
      {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        attractions: [],
      },
    ],
    formTitle: "",
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
    batches: [],
    isFree: false,
    customFields: [],
    acceptedTerms: false, // garantir que só exista uma vez
    token: null,
    status: "active",
    searchAddress: "",
  });
  

  useEffect(() => {
    async function fetchEventDataToEdit() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GETID_PROTECTED
          }${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response) {
          setIsOwner(response.data.isOwner);          
          setFormData((prev) => ({...prev,...response.data.event,acceptedTerms: false}));
        }
      } catch (error: any) {
        console.log("ERror", error);
        setIsOwner(error.response.data.owner);
      }
    }

    if (id) {
      fetchEventDataToEdit();
    }
  }, [id]);

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

  useEffect(() => {
    if (formData.state.length > 1) {
      buscarMunicipios(formData.state);
    }
  }, [formData.state]);

  const buscarCoordenadasPorCEP = async (cep: string) => {
    if (!cep || cep.length < 8) return;

    setBuscandoCoordenadas(true);
    try {
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await cepResponse.json();

      if (!cepData.erro) {
        // const endereco = `${cepData.logradouro}, ${formData.number}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, ${cep}`

        // Mock Google Geocoding response for demo
        const mockLocation = { lat: -23.5505, lng: -46.6333 };

        setFormData((prev) => ({
          ...prev,
          latitude: mockLocation.lat.toString(),
          longitude: mockLocation.lng.toString(),
          street: cepData.logradouro || prev.street,
          neighborhood: cepData.bairro || prev.neighborhood,
          city: cepData.localidade || prev.city,
          state: cepData.uf || prev.state,
        }));
        setCoordenadasEncontradas(true);
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
    } finally {
      setBuscandoCoordenadas(false);
    }
  };

  const buscarSugestoesEndereco = async (query: string) => {
    try {
      setBuscandoSugestoes(true);
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      // Usar apenas Geocoding API (sem problemas de CORS)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=${apiKey}&region=br&language=pt-BR`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Formatar resultados do geocoding
        const formattedResults = data.results
          .slice(0, 5)
          .map((result: any) => ({
            place_id: null,
            description: result.formatted_address,
            structured_formatting: {
              main_text: result.formatted_address.split(",")[0],
              secondary_text: result.formatted_address
                .split(",")
                .slice(1)
                .join(",")
                .trim(),
            },
            formatted_address: result.formatted_address,
            address_components: result.address_components,
            geometry: result.geometry,
          }));
        setSugestoesEndereco(formattedResults);
      } else {
        setSugestoesEndereco([]);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      setSugestoesEndereco([]);
    } finally {
      setBuscandoSugestoes(false);
    }
  };

  const selecionarSugestao = async (sugestao: any) => {
    try {
      const location = sugestao.geometry.location;

      setFormData((prev) => ({
        ...prev,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        venueName: sugestao.structured_formatting.main_text || prev.venueName,
        searchAddress: sugestao.formatted_address,
      }));

      setCoordenadasEncontradas(true);
      setSugestoesEndereco([]);
    } catch (error) {
      console.error("Erro ao selecionar sugestão:", error);
    }
  };

  const getMapUrl = () => {
    if (formData.latitude && formData.longitude) {
      return `https://www.google.com/maps/embed/v1/place?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&q=${formData.latitude},${formData.longitude}&zoom=15`;
    }
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr";
  };

  const validateCurrentStep = useCallback(() => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.title.trim())
          newErrors.title = "Nome do evento é obrigatório";
        if (!formData.category) newErrors.category = "Categoria é obrigatória";
        break;
      case 2:
        if (formData.dates.length === 0) {
          newErrors.dates = "Pelo menos um período é obrigatório";
        } else {
          formData.dates.forEach((date, index) => {
            if (!date.startDate)
              newErrors[`startDate-${index}`] = "Data de início é obrigatória";
            if (!date.startTime)
              newErrors[`startTime-${index}`] = "Hora de início é obrigatória";
            if (!date.endDate)
              newErrors[`endDate-${index}`] = "Data de término é obrigatória";
            if (!date.endTime)
              newErrors[`endTime-${index}`] = "Hora de término é obrigatória";
          });
        }
        break;
      case 3:
        if (!formData.description.trim())
          newErrors.description = "Descrição é obrigatória";
        if (!formData.policy.trim())
          newErrors.policy = "Política do evento é obrigatória";
        break;
      case 4:
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
      case 5:
        if (formData.batches.length === 0 && formData.isFree === false) {
          newErrors.batches = "Pelo menos um lote de ingresso é obrigatório";
        }
        if (formData.isFree && formData.customFields.length === 0) {
          newErrors.customFields =
            "Você deve adicionar pelo menos um campo de formulário para eventos gratuitos.";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

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

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
      }
    },
    []
  );

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
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
        return;
      }

      if (!validateCurrentStep()) {
        return;
      }

      try {
        setLoading(true);
        const data = new FormData();

        if (formData.image) {
          data.append("image", formData.image);
        }

        // Gerar URL do mapa antes de enviar
        const mapUrl =
          formData.latitude && formData.longitude
            ? `https://www.google.com/maps/embed/v1/place?key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }&q=${formData.latitude},${formData.longitude}&zoom=15`
            : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr";

        const formDataToSend = {
          ...formData,
          mapUrl: mapUrl,
        };

        const { image, ...rest } = formDataToSend;
        data.append("editedEvent", JSON.stringify(rest));

        if (formData.isFree && formData.customFields.length == 0) {
          throw new Error(
            "Nenhum campo de formulário adicionado para eventos gratuitos."
          );
        }

        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_UPDATEID
          }`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.edited) {
          setCreated(true);
        }
      } catch (error) {
        console.error("Erro ao Editar evento", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, validateCurrentStep]
  );

  useEffect(() => {
    if (created) {
      window.location.href = "/";
    }
  }, [created]);

  const totalSteps = 6;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const stepIcons = [
    { icon: FileText, label: "Informações" },
    { icon: Calendar, label: "Data/Hora" },
    { icon: FileText, label: "Descrição" },
    { icon: MapPin, label: "Local" },
    { icon: Ticket, label: "Ingressos" },
    { icon: CheckCircle, label: "Termos" },
  ];

  const renderProgressSteps = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="text-sm">
          Etapa {currentStep} de {totalSteps}
        </Badge>
      </div>

      <div className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />

        <div className="hidden md:flex items-center justify-between">
          {stepIcons.map((step, index) => {
            const stepNumber = index + 1;
            const Icon = step.icon;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => setCurrentStep(stepNumber)}
              >
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    isActive
                      ? "bg-gray-200 text-gray-500 shadow-lg scale-110"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon
                      className="w-6 h-6"
                      color={isActive ? "white" : "white"}
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-gray-500"
                      : isCompleted
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex items-center space-x-2 bg-transparent"
        >
          <span>← Voltar</span>
        </Button>
      ) : (
        <div />
      )}

      {currentStep < 6 ? (
        <Button
          type="button"
          onClick={nextStep}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <span>Próximo →</span>
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!formData.acceptedTerms || loading}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Publicando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Editar Evento</span>
            </>
          )}
        </Button>
      )}
    </div>
  );

  const renderImageUpload = () => (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            {formData.image ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Upload className="w-8 h-8 text-blue-500" />
            )}
          </div>

          <div>
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              {formData.image ? "Alterar imagem" : "Carregar imagem"}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            <p className="text-gray-500 mt-1">ou arraste e solte aqui</p>
          </div>

          <p className="text-sm text-gray-400">
            PNG, JPG, GIF até 10MB (Recomendado: 1200x600px)
          </p>

          {formData.image && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                ✓ {formData.image.name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderError = (field: string) =>
    errors[field] && (
      <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
        <span>⚠</span>
        <span>{errors[field]}</span>
      </p>
    );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4">Criar Evento</h1>
              <div className="text-left space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Informações Básicas
                </h2>
                <p className="text-gray-600">
                  Vamos começar com as informações essenciais do seu evento
                </p>
              </div>
            </div>

            <div className="grid gap-6 w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Nome do Evento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Digite o nome do seu evento"
                    className="text-lg"
                  />
                  {renderError("title")}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Imagem de Divulgação</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderImageUpload()}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5" />
                    <span>Categoria</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              category: cat.value,
                            }))
                          }
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            formData.category === cat.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {renderError("category")}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Data, Horário e Atrações
              </h2>
              <p className="text-gray-600">
                Defina quando seu evento acontecerá e quais serão as atrações
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex lg:flex-row flex-col gap-3 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Períodos do Evento</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        dates: [
                          ...prev.dates,
                          {
                            startDate: "",
                            startTime: "",
                            endDate: "",
                            endTime: "",
                            attractions: [],
                          },
                        ],
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Período
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.dates.map((dateObj, idx) => (
                  <div key={idx} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        Período {idx + 1}
                      </h3>
                      {formData.dates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newDates = formData.dates.filter(
                              (_, i) => i !== idx
                            );
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Início
                        </label>
                        <Input
                          type="datetime-local"
                          value={formatDateTimeForInput(dateObj.startDate)}
                          onChange={(e) => {
                            const newDates = [...formData.dates];
                            newDates[idx].startDate = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                        />
                        {renderError(`startDate-${idx}`)}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora de Início
                        </label>
                        <Input
                          type="time"
                          value={dateObj.startTime}
                          onChange={(e) => {
                            const newDates = [...formData.dates];
                            newDates[idx].startTime = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                        />
                        {renderError(`startTime-${idx}`)}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Término
                        </label>
                        <Input
                          type="datetime-local"
                          value={formatDateTimeForInput(dateObj.endDate)}
                          onChange={(e) => {
                            const newDates = [...formData.dates];
                            newDates[idx].endDate = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                        />
                        {renderError(`endDate-${idx}`)}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora de Término
                        </label>
                        <Input
                          type="time"
                          value={dateObj.endTime}
                          onChange={(e) => {
                            const newDates = [...formData.dates];
                            newDates[idx].endTime = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                        />
                        {renderError(`endTime-${idx}`)}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex lg:flex-row flex-col gap-3 items-center justify-between mb-4">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Music className="w-4 h-4" />
                          <span>Atrações deste período</span>
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDates = [...formData.dates];
                            if (!newDates[idx].attractions)
                              newDates[idx].attractions = [];
                            newDates[idx].attractions.push({
                              name: "",
                              social: "",
                              description: "",
                              startTime: "",
                              endTime: "",
                            });
                            setFormData((prev) => ({
                              ...prev,
                              dates: newDates,
                            }));
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Atração
                        </Button>
                      </div>

                      {dateObj.attractions && dateObj.attractions.length > 0 ? (
                        <div className="space-y-3">
                          {dateObj.attractions.map((attraction, a) => (
                            <div
                              key={a}
                              className="flex lg:flex-row flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="lg:w-1/2 w-full h-full flex flex-col gap-3">
                                <Input
                                  type="text"
                                  value={attraction.name}
                                  onChange={(e) => {
                                    const newDates = [...formData.dates];
                                    newDates[idx].attractions[a].name =
                                      e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      dates: newDates,
                                    }));
                                  }}
                                  placeholder={`Nome da atração ${a + 1}`}
                                  className="flex-1"
                                />
                                <Input
                                  type="text"
                                  value={attraction.social || ""}
                                  onChange={(e) => {
                                    const newDates = [...formData.dates];
                                    newDates[idx].attractions[a].social =
                                      e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      dates: newDates,
                                    }));
                                  }}
                                  placeholder="Rede social ou site (opcional)"
                                  className="flex-1"
                                />
                                <div className="flex gap-2">
                                  <Input
                                    type="time"
                                    value={attraction.startTime || ""}
                                    onChange={(e) => {
                                      const newDates = [...formData.dates];
                                      newDates[idx].attractions[a].startTime =
                                        e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        dates: newDates,
                                      }));
                                    }}
                                    placeholder="Início"
                                    className="flex-1"
                                  />
                                  <Input
                                    type="time"
                                    value={attraction.endTime || ""}
                                    onChange={(e) => {
                                      const newDates = [...formData.dates];
                                      newDates[idx].attractions[a].endTime =
                                        e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        dates: newDates,
                                      }));
                                    }}
                                    placeholder="Término"
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <Textarea
                                value={attraction.description || ""}
                                onChange={(e) => {
                                  const newDates = [...formData.dates];
                                  newDates[idx].attractions[a].description =
                                    e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    dates: newDates,
                                  }));
                                }}
                                placeholder="Descrição (opcional)"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newDates = [...formData.dates];
                                  newDates[idx].attractions = newDates[
                                    idx
                                  ].attractions.filter((_, i) => i !== a);
                                  setFormData((prev) => ({
                                    ...prev,
                                    dates: newDates,
                                  }));
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          Nenhuma atração adicionada ainda
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Descrição e Política
              </h2>
              <p className="text-gray-600">
                Conte mais sobre seu evento e defina as regras
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Descrição do Evento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descreva seu evento de forma detalhada. Fale sobre o que os participantes podem esperar, o que será oferecido, e qualquer informação importante..."
                    className="min-h-[150px] resize-none"
                  />
                  {renderError("description")}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Política do Evento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.policy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        policy: e.target.value,
                      }))
                    }
                    placeholder="Defina as regras e políticas do seu evento. Por exemplo: política de cancelamento, regras de comportamento, itens permitidos/proibidos, etc..."
                    className="min-h-[150px] resize-none"
                  />
                  {renderError("policy")}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Local do Evento
              </h2>
              <p className="text-gray-600">Onde seu evento acontecerá?</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Informações do Local</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Local
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
                      placeholder="Ex: Teatro Municipal, Centro de Convenções..."
                    />
                    {renderError("venueName")}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={formatCEP(formData.zipCode)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setFormData((prev) => ({
                              ...prev,
                              zipCode: rawValue,
                            }));
                            setCoordenadasEncontradas(false);
                            if (rawValue.length === 8) {
                              buscarCoordenadasPorCEP(rawValue);
                            }
                          }}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        {buscandoCoordenadas && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {renderError("zipCode")}
                      {coordenadasEncontradas && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Localização encontrada!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua/Avenida
                      </label>
                      <Input
                        type="text"
                        value={formData.street}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                        placeholder="Nome da rua ou avenida"
                      />
                      {renderError("street")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número
                      </label>
                      <Input
                        type="text"
                        value={formatNumber(formData.number)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            number: rawValue,
                          }));
                        }}
                        placeholder="123"
                        maxLength={6}
                      />
                      {renderError("number")}
                    </div>
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
                        placeholder="Apto, Sala..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
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
                        placeholder="Nome do bairro"
                      />
                      {renderError("neighborhood")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <Select
                        onValueChange={async (sigla) => {
                          setFormData((prev) => ({
                            ...prev,
                            state: sigla,
                            city: "",
                          }));
                        }}
                        value={formData.state}
                      >
                        <SelectTrigger>
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
                      {renderError("state")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <Select
                        onValueChange={(municipio) =>
                          setFormData((prev) => ({ ...prev, city: municipio }))
                        }
                        value={formData.city}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              formData.state
                                ? "Selecione a cidade"
                                : "Selecione um estado primeiro"
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
                      {renderError("city")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Buscar Local</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Digite o nome do local ou endereço para buscar..."
                      value={formData.searchAddress || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          searchAddress: value,
                        }));

                        if (searchTimeout) clearTimeout(searchTimeout);

                        if (value.length > 2) {
                          const timeout = setTimeout(() => {
                            buscarSugestoesEndereco(value);
                          }, 500);
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

                  {sugestoesEndereco.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                      {sugestoesEndereco.map((sugestao, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selecionarSugestao(sugestao)}
                        >
                          <div className="font-medium text-gray-900">
                            {sugestao.structured_formatting?.main_text ||
                              sugestao.description?.split(",")[0]}
                          </div>
                          <div className="text-sm text-gray-600">
                            {sugestao.structured_formatting?.secondary_text ||
                              sugestao.formatted_address}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visualização no Mapa</CardTitle>
                </CardHeader>
                <CardContent>
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
                  {formData.latitude && formData.longitude && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Localização definida: {formData.latitude},{" "}
                      {formData.longitude}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Ingressos e Formulário
              </h2>
              <p className="text-gray-600">
                Configure os ingressos ou formulário de inscrição
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tipo de Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, isFree: true }))
                    }
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      formData.isFree
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <Users className="w-8 h-8 mx-auto" />
                      <h3 className="font-semibold">Evento Gratuito</h3>
                      <p className="text-sm opacity-75">
                        Inscrições através de formulário
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, isFree: false }))
                    }
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      !formData.isFree
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <Ticket className="w-8 h-8 mx-auto" />
                      <h3 className="font-semibold">Evento Pago</h3>
                      <p className="text-sm opacity-75">
                        Venda de ingressos por lotes
                      </p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {formData.isFree ? (
              <FormBuilder form={formData} setForm={setFormData} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex lg:flex-row flex-col gap-3 items-center justify-between">
                    <span>Lotes de Ingressos</span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => {
                          const batches = prev.batches;
                          let newSaleStart = "";
                          if (batches.length > 0) {
                            newSaleStart = batches[batches.length - 1].saleEnd;
                          }
                          return {
                            ...prev,
                            batches: [
                              ...batches,
                              {
                                batchName: "",
                                saleStart: newSaleStart,
                                saleEnd: "",
                                tickets: [],
                              },
                            ],
                          };
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Lote
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.batches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum lote criado ainda</p>
                      <p className="text-sm">
                        Clique em "Adicionar Lote" para começar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.batches.map((batch, batchIdx) => (
                        <div
                          key={batchIdx}
                          className="border rounded-lg p-6 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">
                              Lote {batchIdx + 1}
                            </h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newBatches = formData.batches.filter(
                                  (_, i) => i !== batchIdx
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  batches: newBatches,
                                }));
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Lote
                              </label>
                              <Input
                                type="text"
                                value={batch.batchName}
                                onChange={(e) => {
                                  const newBatches = [...formData.batches];
                                  newBatches[batchIdx].batchName =
                                    e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    batches: newBatches,
                                  }));
                                }}
                                placeholder="Ex: 1º Lote, 2º Lote, Virada"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Início das vendas
                              </label>
                              <Input
                                type="datetime-local"
                                value={formatDateTimeForInput(batch.saleStart)}
                                onChange={(e) => {
                                  const newBatches = [...formData.batches];
                                  newBatches[batchIdx].saleStart =
                                    e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    batches: newBatches,
                                  }));
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fim das vendas
                              </label>
                              <Input
                                type="datetime-local"
                                value={formatDateTimeForInput(batch.saleEnd)}
                                onChange={(e) => {
                                  const newBatches = [...formData.batches];
                                  newBatches[batchIdx].saleEnd = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    batches: newBatches,
                                  }));
                                }}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <div className="flex lg:flex-row flex-col gap-3 items-center justify-between mb-4">
                              <h4 className="font-medium">Ingressos do Lote</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newBatches = [...formData.batches];
                                  newBatches[batchIdx].tickets.push({
                                    name: "",
                                    price: 0,
                                    quantity: 0,
                                    description: "",
                                    type: "regular",
                                    soldQuantity: 0,
                                  });
                                  setFormData((prev) => ({
                                    ...prev,
                                    batches: newBatches,
                                  }));
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Ingresso
                              </Button>
                            </div>

                            {batch.tickets.length === 0 ? (
                              <p className="text-center text-gray-500 py-4">
                                Nenhum ingresso adicionado
                              </p>
                            ) : (
                              <div className="space-y-4">
                                {batch.tickets.map((ticket, ticketIdx) => (
                                  <div
                                    key={ticketIdx}
                                    className="bg-gray-50 p-4 rounded-lg"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Nome do Ingresso
                                        </label>
                                        <Input
                                          type="text"
                                          value={ticket.name}
                                          onChange={(e) => {
                                            const newBatches = [
                                              ...formData.batches,
                                            ];
                                            newBatches[batchIdx].tickets[
                                              ticketIdx
                                            ].name = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              batches: newBatches,
                                            }));
                                          }}
                                          placeholder="Ex: Inteira, Meia, VIP"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Preço
                                        </label>
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={ticket.price}
                                          onChange={(e) => {
                                            const newBatches = [
                                              ...formData.batches,
                                            ];
                                            newBatches[batchIdx].tickets[
                                              ticketIdx
                                            ].price =
                                              Number.parseFloat(
                                                e.target.value
                                              ) || 0;
                                            setFormData((prev) => ({
                                              ...prev,
                                              batches: newBatches,
                                            }));
                                          }}
                                          placeholder="0,00"
                                        />
                                        <p className="text-xs text-green-700 mt-1">
                                          Você receberá:{" "}
                                          <b>
                                            R${" "}
                                            {((ticket.price || 0) * 0.9)
                                              .toFixed(2)
                                              .replace(".", ",")}
                                          </b>{" "}
                                          (descontando 10% de taxa)
                                        </p>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Quantidade
                                        </label>
                                        <Input
                                          type="number"
                                          value={ticket.quantity}
                                          onChange={(e) => {
                                            const value = Number(
                                              e.target.value
                                            );
                                            if (value >= 0) {
                                              const newBatches = [
                                                ...formData.batches,
                                              ];
                                              newBatches[batchIdx].tickets[
                                                ticketIdx
                                              ].quantity = value;
                                              setFormData((prev) => ({
                                                ...prev,
                                                batches: newBatches,
                                              }));
                                            }
                                          }}
                                          placeholder="0"
                                          min="0"
                                        />
                                      </div>
                                      <div className="flex items-end">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const newBatches = [
                                              ...formData.batches,
                                            ];
                                            newBatches[batchIdx].tickets =
                                              newBatches[
                                                batchIdx
                                              ].tickets.filter(
                                                (_, i) => i !== ticketIdx
                                              );
                                            setFormData((prev) => ({
                                              ...prev,
                                              batches: newBatches,
                                            }));
                                          }}
                                          className="text-red-600 hover:text-red-700 w-full"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Remover
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {renderError("customFields")}
            {renderError("batches")}
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Termos e Condições
              </h2>
              <p className="text-gray-600">
                Revise e aceite os termos para publicar seu evento
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Resumo do Evento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <p className="text-gray-900">
                      {formData.title || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Categoria:
                    </span>
                    <p className="text-gray-900">
                      {CATEGORIES.find((c) => c.value === formData.category)
                        ?.label || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Local:</span>
                    <p className="text-gray-900">
                      {formData.venueName || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo:</span>
                    <p className="text-gray-900">
                      {formData.isFree ? "Gratuito" : "Pago"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked: boolean) =>
                      setFormData((prev) => ({
                        ...prev,
                        acceptedTerms: checked,
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Aceitar termos e condições
                    </label>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Ao publicar este evento, estou de acordo com os{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Termos de uso
                      </a>
                      , com as{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Diretrizes de Comunidade
                      </a>{" "}
                      e com as{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Regras de meia-entrada
                      </a>
                      , bem como declaro estar ciente da{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Política de Privacidade
                      </a>{" "}
                      e das{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Obrigatoriedades Legais
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOwner && !loading) {
    return (
      <div>
        <h1>Você não é o proprietário deste evento</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderProgressSteps()}
            {renderStep()}
            {renderNavigation()}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
