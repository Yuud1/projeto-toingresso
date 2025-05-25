import { useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User, Camera, Facebook, Instagram, Globe } from "lucide-react";
import { useUser } from "@/contexts/useContext";
import axios from "axios";

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

export default function Profile() {
  const [activeTab, setActiveTab] = useState<
    "dados" | "pagamentos" | "privacidade" | "avancada"
  >("dados");
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({});
  const [statusSaving, setStatusSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          submitData.append(key, value as string);
        }
      });

      if (selectedFile) {
        submitData.append('profileImage', selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_UPDATE_USER_DATA
        }`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.updated) {
        setStatusSaving(true);
        window.location.href = "/perfil";
      }
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Erro ao atualizar perfil");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <div className="flex space-x-8">
                <Tab
                  isActive={activeTab === "dados"}
                  onClick={() => setActiveTab("dados")}
                  className="cursor-pointer"
                >
                  Conta
                </Tab>
                <Tab
                  isActive={activeTab === "pagamentos"}
                  onClick={() => setActiveTab("pagamentos")}
                  className="cursor-pointer"
                >
                  Pagamentos
                </Tab>
                <Tab
                  isActive={activeTab === "privacidade"}
                  onClick={() => setActiveTab("privacidade")}
                  className="cursor-pointer"
                >
                  Privacidade
                </Tab>
                <Tab
                  isActive={activeTab === "avancada"}
                  onClick={() => setActiveTab("avancada")}
                  className="cursor-pointer"
                >
                  Avançada
                </Tab>
              </div>
            </div>
          </div>

          <div className="min-h-[calc(100vh-300px)]">
            {activeTab === "dados" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
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
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-200 rounded"></div>
                        <div>
                          <h4 className="font-medium">Cartão de crédito</h4>
                          <p className="text-sm text-gray-500">
                            Terminando em 4242
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                    <Button className="w-full bg-[#02488C] text-white hover:bg-[#023a6f] cursor-pointer">
                      Adicionar novo método
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
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
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
                </div>
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
                          placeholder="Nova senha"
                          name="newPassword"
                          onChange={handleChange}
                        />
                        <Input
                          type="password"
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
                          onClick={handleSubmit}
                        >
                          {loading ? "Atualizando..." : "Atualizar senha"}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2 text-red-600">
                        Zona de perigo
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}