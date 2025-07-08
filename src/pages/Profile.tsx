import type React from "react";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User, Camera, Facebook, Instagram, Globe } from "lucide-react";
import { useUser } from "@/contexts/useContext";
import AddCardForm from "../components/AddCardForm";
import axios from "axios";
import { formatCPF } from "@/utils/formatUtils";
import UserInterface from "@/interfaces/UserInterface";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isActive ? "text-[#02488C]" : "text-gray-500 hover:text-gray-700",
        className
      )}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
      )}
    </button>
  );
};

const tabOptions = [
  { value: "dados", label: "Conta" },
  { value: "pagamentos", label: "Pagamentos" },
  { value: "privacidade", label: "Privacidade" },
  { value: "avancada", label: "Avançada" },
] as const;

export default function Profile() {
  const [activeTab, setActiveTab] = useState<
    "dados" | "pagamentos" | "privacidade" | "avancada"
  >("dados");
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<UserInterface>({
    isPublic: false,
    name: "",
    email: "",
    phoneNumber: "",
    birthdaydata: "",
    facebook: "",
    instagram: "",
    mysite: "",
    cpf: "",
    avatar: "",
    _id: "",
    emailVerified: "false",
    tickets: [],
    type: "user",
    likedEvents: [],
  });
  const [statusSaving, setStatusSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const token = localStorage.getItem("token");
  // Função para detectar a bandeira do cartão (fora do handleAddCard para reuso)
  const detectCardBrand = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "VISA";
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
      return "MASTERCARD";
    if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37"))
      return "AMEX";
    if (
      cleanNumber.startsWith("636368") ||
      cleanNumber.startsWith("438935") ||
      cleanNumber.startsWith("504175")
    )
      return "ELO";
    return "OUTRO";
  };

  async function getUserCards() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GET_USER_CARD
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.cards) {
        // Preenche o brand se não existir
        const cardsWithBrand = response.data.cards.map((card: Cards) => ({
          ...card,
          brand: card.brand || detectCardBrand(card.cardNumber),
        }));
        setCards(cardsWithBrand);
      }
    } catch (error) {
      console.log("Erro ao buscar cartões", error);
    }
  }

  useEffect(() => {
    if (user) {
      setFormData(user);
      getUserCards();
    }
  }, [user]);

  interface Cards {
    _id: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    isDefault: boolean;
    brand?: string;
  }
  const [cards, setCards] = useState<Cards[] | null>([]);

  const setDefaultCard = async (cardId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_UPDATE_USER_CARD_SET_DEFAULT
        }`,
        { cardId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!cards) {
        return;
      }
      if (response.data.updated) {
        setCards(
          cards.map((card) => ({
            ...card,
            isDefault: card._id === cardId,
          }))
        );
        console.log(`Cartão ${cardId} definido como padrão`);
      }

    } catch (error) {
      console.log("Erro ao definir cartão como padrão", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    const onlyNumbers = value.replace(/\D/g, ""); // remove tudo que não é número

    const maskedValue = name === "cpf" ? formatCPF(onlyNumbers) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: maskedValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setStatusSaving(false);

      // Campos permitidos para atualização
      const allowedFields = [
        "name",
        "email",
        "phoneNumber",
        "birthdaydata",
        "facebook",
        "instagram",
        "mysite",
        "cpf",
        "avatar",
        "isPublic",
      ];
      const filteredData: Record<string, any> = {};
      allowedFields.forEach((field) => {
        if ((formData as Record<string, any>)[field] !== undefined) {
          filteredData[field] = (formData as Record<string, any>)[field];
        }
      });

      let response;
      if (selectedFile) {
        // Se tem imagem, usa FormData
        const submitData = new FormData();
        Object.entries(filteredData).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            submitData.append(key, value ? "true" : "false");
          } else if (value !== undefined && value !== null) {
            submitData.append(key, value as string);
          }
        });
        submitData.append("profileImage", selectedFile);

        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_UPDATE_USER_DATA
          }`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Se não tem imagem, envia JSON puro
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_UPDATE_USER_DATA
          }`,
          filteredData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.updated) {
        setStatusSaving(true);
        window.location.href = "/perfil";
      }
    } catch (error: any) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "Erro ao atualizar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setStatusSaving(false);

      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_DELETE_USER
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.deleted) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      setErrorMessage("Erro ao excluir conta");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = (cardData: any) => {
    console.log("Novo cartão adicionado:", cardData);

    // Criar um novo cartão com os dados recebidos
    const newCard: Cards = {
      _id: cardData._id || Math.random().toString(36).substr(2, 9),
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiryDate,
      cvv: cardData.cvv,
      cardholderName: cardData.cardholderName,
      isDefault: cardData.isDefault || false,
      brand: cardData.brand || detectCardBrand(cardData.cardNumber),
    };

    let updatedCards = cards ? [...cards] : [];
    if (newCard.isDefault) {
      updatedCards = updatedCards.map((card) => ({
        ...card,
        isDefault: false,
      }));
    }
    updatedCards.push(newCard);
    setCards(updatedCards);
    setShowAddCard(false);
  };

  async function handleDeleteCard(cardId: string) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_DELETE_USER_CARD
        }`,
        { headers: { Authorization: `Bearer ${token}` }, data: { cardId } }
      );

      if (response.data.deleted) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Erro ao excluir cartão ", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabOptions.map((option) => (
                <Tab
                  key={option.value}
                  isActive={activeTab === option.value}
                  onClick={() => setActiveTab(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </Tab>
              ))}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="sm:hidden mb-6">
            <Select
              value={activeTab}
              onValueChange={(
                value: "dados" | "pagamentos" | "privacidade" | "avancada"
              ) => setActiveTab(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma seção" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[calc(100vh-300px)]">
            {activeTab === "dados" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer">
                      {previewImage ? (
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover "
                        />
                      ) : (
                        <User size={40} className="text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-0 cursor-pointer right-0 bg-[#02488C] text-white p-2 rounded-full hover:bg-[#023a6f] transition-colors"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Foto de perfil</h3>
                    <p className="text-sm text-gray-500">
                      JPG, GIF ou PNG. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      defaultValue={user?.name}
                      name="name"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="seu@email.com"
                      defaultValue={user?.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="(00) 00000-0000"
                      defaultValue={user?.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de nascimento
                    </label>
                    <Input
                      type="date"
                      name="birthdaydata"
                      defaultValue={user?.birthdaydata}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <div className="relative">
                      <Facebook
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="facebook.com/seu-usuario"
                        className="pl-10"
                        name="facebook"
                        defaultValue={user?.facebook}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="000.000.000-00"
                        className=""
                        name="cpf"
                        defaultValue={user?.cpf}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={handleChange}
                        value={formData.cpf}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="@seu-usuario"
                        className="pl-10"
                        name="instagram"
                        defaultValue={user?.instagram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        type="url"
                        placeholder="https://seu-site.com"
                        className="pl-10"
                        name="mysite"
                        defaultValue={user?.mysite}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-[#02488C] text-white hover:bg-[#023a6f] cursor-pointer "
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
                {statusSaving && (
                  <div className="text-green-600 text-sm text-right">
                    Alterações salvas com sucesso!
                  </div>
                )}
                {errorMessage && (
                  <div className="text-red-600 text-sm text-right">
                    {errorMessage}
                  </div>
                )}
              </div>
            )}

            {activeTab === "pagamentos" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">
                    Métodos de pagamento
                  </h3>
                  <div className="space-y-4">
                    {cards?.map((card) => (
                      <div
                        key={card._id}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4",
                          card.isDefault && "border-[#02488C] bg-blue-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="min-w-[60px] w-15 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md relative overflow-hidden">
                            {card.brand === "VISA" && (
                              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                <span className="relative z-10 font-bold tracking-wider">
                                  VISA
                                </span>
                              </div>
                            )}
                            {card.brand === "MASTERCARD" && (
                              <div className="w-full h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                <div className="relative z-10 flex items-center">
                                  <div className="w-4 h-4 bg-red-600 rounded-full opacity-80"></div>
                                  <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-2 opacity-80"></div>
                                </div>
                              </div>
                            )}
                            {card.brand === "AMEX" && (
                              <div className="w-full h-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                <span className="relative z-10 font-bold text-xs">
                                  AMEX
                                </span>
                              </div>
                            )}
                            {card.brand === "ELO" && (
                              <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                <span className="relative z-10 font-bold text-xs">
                                  ELO
                                </span>
                              </div>
                            )}
                            {card.brand &&
                              !["VISA", "MASTERCARD", "AMEX", "ELO"].includes(
                                card.brand
                              ) && (
                                <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center relative">
                                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                  <span className="relative z-10 font-bold text-xs">
                                    {card.brand}
                                  </span>
                                </div>
                              )}
                            {!card.brand && (
                              <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                                <span className="relative z-10 font-bold text-xs">
                                  Cartão
                                </span>
                              </div>
                            )}
                            {/* Chip do cartão */}
                            <div className="absolute bottom-1 left-1 w-2 h-1.5 bg-yellow-300 rounded-sm opacity-60"></div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Cartão de crédito</h4>
                              {card.isDefault && (
                                <span className="bg-blue-100 text-[#02488C] text-xs px-2 py-1 rounded-full">
                                  Principal
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Terminando em {card.cardNumber.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          {!card.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDefaultCard(card._id)}
                              className="text-[#02488C] border-[#02488C] hover:bg-blue-50 w-full sm:w-auto"
                            >
                              Definir como principal
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleDeleteCard(card._id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => setShowAddCard(true)}
                      className="w-full bg-[#02488C] text-white hover:bg-[#023a6f] cursor-pointer"
                    >
                      Adicionar novo cartão
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacidade" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">
                    Configurações de privacidade
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Perfil público</h4>
                        <p className="text-sm text-gray-500">
                          Permitir que outros usuários vejam seu perfil
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="isPublic"
                          defaultChecked={user?.isPublic}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                    {/* <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Compartilhar dados de uso
                        </h4>
                        <p className="text-sm text-gray-500">
                          Permitir que usemos seus dados para melhorar nossos
                          serviços
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div> */}
                  </div>
                </div>

                {/* <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">
                    Preferências de notificação
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notificações por e-mail</h4>
                        <p className="text-sm text-gray-500">
                          Receba atualizações sobre seus eventos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notificações push</h4>
                        <p className="text-sm text-gray-500">
                          Receba alertas em tempo real
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {activeTab === "avancada" && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">
                      Configurações avançadas
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Alterar senha</h4>
                        <div className="space-y-4">
                          {/* <Input
                            type="password"
                            id="newPassword"
                            placeholder="Senha atual"
                            name="newPassword"
                            onChange={handleChange}
                          /> */}
                          <Input
                            type="password"
                            id="newPassword"
                            placeholder="Nova senha"
                            name="newPassword"
                            onChange={handleChange}
                          />
                          <Input
                            type="password"
                            id="confirmNewPassword"
                            placeholder="Confirmar nova senha"
                            name="confirmNewPassword"
                            onChange={handleChange}
                          />
                          <div className="w-full h-full">
                            <p className="text-sm text-destructive">
                              {errorMessage}
                            </p>
                          </div>
                          <Button
                            className="bg-[#02488C] text-white hover:bg-[#023a6f] cursor-pointer"
                            disabled={loading}
                          >
                            {loading ? "Atualizando..." : "Atualizar senha"}
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-2 text-red-600">
                          Ação irreversível
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Ações irreversíveis que afetarão permanentemente sua
                          conta
                        </p>
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="border-red-500 text-destructive hover:bg-red-500 hover:text-white cursor-pointer"
                            disabled={loading}
                            onClick={handleDelete}
                          >
                            Excluir minha conta
                          </Button>
                          <p className="text-xs text-gray-500">
                            Ao excluir sua conta, todos os seus dados serão
                            permanentemente removidos e não poderão ser
                            recuperados.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <AddCardForm
        isOpen={showAddCard}
        onClose={() => setShowAddCard(false)}
        onSave={handleAddCard}
      />

      <Footer />
    </div>
  );
}
