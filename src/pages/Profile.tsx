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
  { value: "privacidade", label: "Privacidade" },
  { value: "avancada", label: "Avançada" },
] as const;

export default function Profile() {
  const [activeTab, setActiveTab] = useState<
    "dados" | "privacidade" | "avancada"
  >("dados");
  const { user } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<UserInterface>(() => ({
    isPublic: user?.isPublic || false,
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    birthdaydata: user?.birthdaydata || "",
    facebook: user?.facebook || "",
    instagram: user?.instagram || "",
    mysite: user?.mysite || "",
    cpf: user?.cpf || "",
    avatar: user?.avatar || "",
    _id: user?._id || "",
    emailVerified: user?.emailVerified || false,
    tickets: user?.tickets || [],
    type: user?.type || "user",
    likedEvents: user?.likedEvents || [],
  }));

  useEffect(() => {
    setFormData({
      ...formData,
      ...user,
    });
  }, [user]);

  const [statusSaving, setStatusSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : name === "cpf"
        ? formatCPF(value.replace(/\D/g, ""))
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        "confirmNewPassword",
        "newPassword",
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
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

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
              onValueChange={(value: "dados" | "privacidade" | "avancada") =>
                setActiveTab(value)
              }
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
            <form onSubmit={handleSubmit} method="PUT">
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
                        defaultValue={formData.name}
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
                        defaultValue={formData.email}
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
                        defaultValue={formData.phoneNumber}
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
                        defaultValue={formData.birthdaydata}
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
                          defaultValue={formData?.facebook}
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
                          value={formData?.cpf}
                          inputMode="text"
                          onChange={handleChange}
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
                          defaultValue={formData.instagram}
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
                          defaultValue={formData.mysite}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
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
                            checked={formData.isPublic ?? false}
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
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">
                      Configurações avançadas
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Alterar senha</h4>
                        <div className="space-y-4">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-start mt-6 mb-6">
                  <Button
                    type="submit"
                    className="bg-[#02488C] text-white hover:bg-[#023a6f] cursor-pointer "
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>

                <div className="flex flex-col max-[370]:flex-row gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">
                      Ação irreversível
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Ações irreversíveis que afetarão permanentemente sua conta
                    </p>
                  </div>

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
                      permanentemente removidos e não poderão ser recuperados.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
