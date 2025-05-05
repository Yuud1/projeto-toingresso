import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User, Camera, Facebook, Instagram, Globe } from "lucide-react";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const Tab = ({ isActive, children, onClick }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isActive
          ? "text-[#02488C]"
          : "text-gray-500 hover:text-gray-700"
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
  const [activeTab, setActiveTab] = useState<"dados" | "pagamentos" | "privacidade" | "avancada">("dados");

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <Tab
                isActive={activeTab === "dados"}
                onClick={() => setActiveTab("dados")}
              >
                Conta
              </Tab>
              <Tab
                isActive={activeTab === "pagamentos"}
                onClick={() => setActiveTab("pagamentos")}
              >
                Pagamentos
              </Tab>
              <Tab
                isActive={activeTab === "privacidade"}
                onClick={() => setActiveTab("privacidade")}
              >
                Privacidade
              </Tab>
              <Tab
                isActive={activeTab === "avancada"}
                onClick={() => setActiveTab("avancada")}
              >
                Avançada
              </Tab>
            </div>
          </div>

          <div className="min-h-[calc(100vh-300px)]">
            {activeTab === "dados" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={40} className="text-gray-400" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-[#02488C] text-white p-2 rounded-full hover:bg-[#023a6f] transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Foto de perfil</h3>
                    <p className="text-sm text-gray-500">JPG, GIF ou PNG. Máximo 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <Input type="text" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <Input type="email" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input type="tel" placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de nascimento
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input type="text" placeholder="facebook.com/seu-usuario" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input type="text" placeholder="@seu-usuario" className="pl-10" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input type="url" placeholder="https://seu-site.com" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#02488C] text-white hover:bg-[#023a6f]">
                    Salvar alterações
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "pagamentos" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Métodos de pagamento</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-200 rounded"></div>
                        <div>
                          <h4 className="font-medium">Cartão de crédito</h4>
                          <p className="text-sm text-gray-500">Terminando em 4242</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Remover
                      </Button>
                    </div>
                    <Button className="w-full bg-[#02488C] text-white hover:bg-[#023a6f]">
                      Adicionar novo método
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacidade" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Configurações de privacidade</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Perfil público</h4>
                        <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu perfil</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Compartilhar dados de uso</h4>
                        <p className="text-sm text-gray-500">Permitir que usemos seus dados para melhorar nossos serviços</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Preferências de notificação</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notificações por e-mail</h4>
                        <p className="text-sm text-gray-500">Receba atualizações sobre seus eventos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02488C]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notificações push</h4>
                        <p className="text-sm text-gray-500">Receba alertas em tempo real</p>
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
                  <h3 className="text-lg font-semibold mb-4">Configurações avançadas</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Alterar senha</h4>
                      <div className="space-y-4">
                        <Input type="password" placeholder="Senha atual" />
                        <Input type="password" placeholder="Nova senha" />
                        <Input type="password" placeholder="Confirmar nova senha" />
                        <Button className="bg-[#02488C] text-white hover:bg-[#023a6f]">
                          Atualizar senha
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2 text-red-600">Zona de perigo</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Ações irreversíveis que afetarão permanentemente sua conta
                      </p>
                      <div className="space-y-4">
                        <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                          Excluir minha conta
                        </Button>
                        <p className="text-xs text-gray-500">
                          Ao excluir sua conta, todos os seus dados serão permanentemente removidos e não poderão ser recuperados.
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