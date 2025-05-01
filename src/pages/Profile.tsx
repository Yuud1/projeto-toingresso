import { useState } from "react";
import Header  from "../components/header";
import  Footer  from "../components/footer";
import { Home, Edit2, User, Settings, Bell } from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("dados");

  return (
    <>
      <Header isScrolled={true} />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-6">
            <a href="/" className="flex items-center text-gray-500 hover:text-[#02488C]">
              <Home size={16} className="mr-1" />
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-[#02488C]">Minha Conta</span>
          </nav>

          {/* Título da Página */}
          <h1 className="text-2xl font-bold text-[#414141] mb-8">
            Minha Conta
          </h1>

          {/* Tabs de Navegação */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("dados")}
                  className={`flex items-center px-6 py-4 border-b-2 text-sm font-medium ${
                    activeTab === "dados"
                      ? "border-[#02488C] text-[#02488C]"
                      : "border-transparent text-gray-500 hover:text-[#02488C] hover:border-gray-300"
                  }`}
                >
                  <User className="w-5 h-5 mr-2" />
                  Dados da Conta
                </button>
                <button
                  onClick={() => setActiveTab("configuracoes")}
                  className={`flex items-center px-6 py-4 border-b-2 text-sm font-medium ${
                    activeTab === "configuracoes"
                      ? "border-[#02488C] text-[#02488C]"
                      : "border-transparent text-gray-500 hover:text-[#02488C] hover:border-gray-300"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Configurações
                </button>
                <button
                  onClick={() => setActiveTab("notificacoes")}
                  className={`flex items-center px-6 py-4 border-b-2 text-sm font-medium ${
                    activeTab === "notificacoes"
                      ? "border-[#02488C] text-[#02488C]"
                      : "border-transparent text-gray-500 hover:text-[#02488C] hover:border-gray-300"
                  }`}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Notificações
                </button>
              </nav>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="p-6">
              {activeTab === "dados" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg text-gray-600 bg-gray-50"
                        value="Lucas Y"
                        disabled
                      />
                      <button className="ml-2 p-2 text-[#02488C] hover:text-[#02488C]/80">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        className="flex-1 p-2 border rounded-lg text-gray-600 bg-gray-50"
                        value="y.modesto10@gmail.com"
                        disabled
                      />
                      <button className="ml-2 p-2 text-[#02488C] hover:text-[#02488C]/80">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="flex items-center">
                      <input
                        type="password"
                        className="flex-1 p-2 border rounded-lg text-gray-600 bg-gray-50"
                        value="********"
                        disabled
                      />
                      <button className="ml-2 p-2 text-[#02488C] hover:text-[#02488C]/80">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "configuracoes" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Dados cadastrais
                    </h3>
                    <div className="bg-[#e2f0ff] p-4 rounded-lg mb-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <User className="h-5 w-5 text-[#02488C]" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">
                            Para receber o valor das suas vendas, complete seu cadastro.
                            Para isso utilize dados de pessoa física (CPF) ou CNPJ para receber seus repasses de forma segura mais rápida.
                          </p>
                          <button className="mt-3 bg-[#02488C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#02488C]/90">
                            Completar cadastro
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Conta de repasse
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                      <p className="text-sm text-gray-500">
                        Nenhuma conta de repasse cadastrada
                      </p>
                      <button className="mt-3 text-[#02488C] border border-[#02488C] px-4 py-2 rounded-lg text-sm hover:bg-[#02488C]/10">
                        Cadastrar conta bancária
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notificacoes" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Preferências de notificação
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-[#02488C] rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Notificar me sobre vendas que um participante realizar uma compra
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-[#02488C] rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Quero receber as novidades do TOingresso por e-mail
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão de Excluir Conta */}
          <div className="text-right">
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Excluir conta
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 