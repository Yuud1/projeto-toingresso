import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Image, Tag, Ticket } from "lucide-react";

interface Ticket {
  name: string;
  price: number;
  quantity: number;
  description: string;
  type: 'regular' | 'student' | 'senior' | 'free';
}

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informações básicas
    title: "",
    image: null as File | null,
    category: "",

    // Data e horário
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",

    // Descrição
    description: "",

    // Localização
    venueName: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",

    // Ingressos
    tickets: [] as Ticket[],

    // Termos
    acceptedTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">1. Informações Básicas</h2>
            
            {/* Nome do evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do evento *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o nome do seu evento"
                className="w-full"
                required
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de divulgação
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <Image size={48} className="mx-auto" />
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
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 p-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="shows">Shows</option>
                  <option value="teatro">Teatro</option>
                  <option value="esportes">Esportes</option>
                  <option value="festas">Festas</option>
                  <option value="cursos">Cursos</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">2. Data e Horário</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Hora de Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Início *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Data de Término */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Término *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Hora de Término */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Término *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">3. Descrição do Evento</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva seu evento de forma detalhada..."
                className="w-full h-48"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">4. Local do Evento</h2>
            
            {/* Nome do Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Local *
              </label>
              <Input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="Ex: Teatro Municipal"
                className="w-full"
                required
              />
            </div>

            {/* CEP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="00000-000"
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Av./Rua *
                </label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <Input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Complemento e Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <Input
                  type="text"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Selecione o estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  {/* Adicionar todos os estados */}
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">5. Ingressos</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Que tipo de ingresso você deseja criar?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipos de Ingresso */}
                <div 
                  onClick={() => {
                    const newTicket: Ticket = {
                      name: "",
                      price: 0,
                      quantity: 0,
                      description: "",
                      type: "regular"
                    };
                    setFormData({
                      ...formData,
                      tickets: [...formData.tickets, newTicket]
                    });
                  }}
                  className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                >
                  <div className="text-center">
                    <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <h4 className="font-medium text-gray-900">Ingresso Regular</h4>
                    <p className="text-sm text-gray-500 mt-1">Ingresso com preço padrão</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    const newTicket: Ticket = {
                      name: "",
                      price: 0,
                      quantity: 0,
                      description: "",
                      type: "student"
                    };
                    setFormData({
                      ...formData,
                      tickets: [...formData.tickets, newTicket]
                    });
                  }}
                  className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                >
                  <div className="text-center">
                    <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <h4 className="font-medium text-gray-900">Meia-Entrada</h4>
                    <p className="text-sm text-gray-500 mt-1">Ingresso com 50% de desconto</p>
                  </div>
                </div>
              </div>

              {/* Lista de Ingressos */}
              {formData.tickets.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Ingressos Criados</h4>
                  <div className="space-y-4">
                    {formData.tickets.map((ticket, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nome do Ingresso */}
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
                                setFormData({ ...formData, tickets: updatedTickets });
                              }}
                              placeholder="Ex: VIP, Camarote, Pista"
                              className="w-full"
                              required
                            />
                          </div>

                          {/* Preço */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preço *
                            </label>
                            <Input
                              type="number"
                              value={ticket.price}
                              onChange={(e) => {
                                const updatedTickets = [...formData.tickets];
                                updatedTickets[index].price = Number(e.target.value);
                                setFormData({ ...formData, tickets: updatedTickets });
                              }}
                              placeholder="R$ 0,00"
                              className="w-full"
                              required
                            />
                          </div>

                          {/* Quantidade */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantidade Disponível *
                            </label>
                            <Input
                              type="number"
                              value={ticket.quantity}
                              onChange={(e) => {
                                const updatedTickets = [...formData.tickets];
                                updatedTickets[index].quantity = Number(e.target.value);
                                setFormData({ ...formData, tickets: updatedTickets });
                              }}
                              placeholder="0"
                              className="w-full"
                              required
                            />
                          </div>

                          {/* Descrição */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descrição
                            </label>
                            <Input
                              type="text"
                              value={ticket.description}
                              onChange={(e) => {
                                const updatedTickets = [...formData.tickets];
                                updatedTickets[index].description = e.target.value;
                                setFormData({ ...formData, tickets: updatedTickets });
                              }}
                              placeholder="Descrição do ingresso (opcional)"
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Botão Remover */}
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 text-red-600 hover:text-red-700"
                          onClick={() => {
                            const updatedTickets = formData.tickets.filter((_, i) => i !== index);
                            setFormData({ ...formData, tickets: updatedTickets });
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
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pt-8">6. Responsabilidades</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked: boolean) => 
                    setFormData({ ...formData, acceptedTerms: checked })
                  }
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
                    <a href="#" className="text-blue-600 hover:underline">Termos de uso</a>,{" "}
                    com as <a href="#" className="text-blue-600 hover:underline">Diretrizes de Comunidade</a> e{" "}
                    com as <a href="#" className="text-blue-600 hover:underline">Regras de meia-entrada</a>,{" "}
                    bem como declaro estar ciente da{" "}
                    <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a> e{" "}
                    das <a href="#" className="text-blue-600 hover:underline">Obrigatoriedades Legais</a>.
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
              {/* Progresso */}
              <div className="flex items-center justify-between mb-8 relative">
                {/* Linha de progresso */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
                  <div 
                    className="h-full bg-[#02488C] transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                  />
                </div>
                
                {/* Círculos de passo */}
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`relative z-10 flex flex-col items-center`}
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
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{step}</span>
                      )}
                    </div>
                    <span 
                      className={`absolute -bottom-6 text-xs font-medium ${
                        step === currentStep
                          ? "text-[#02488C]"
                          : step < currentStep
                          ? "text-[#02488C]"
                          : "text-gray-500"
                      }`}
                    >
                      {step === 1 && "Informações"}
                      {step === 2 && "Data/Hora"}
                      {step === 3 && "Descrição"}
                      {step === 4 && "Local"}
                      {step === 5 && "Ingressos"}
                      {step === 6 && "Termos"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Conteúdo do Step */}
              {renderStep()}

              {/* Navegação */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Voltar
                  </Button>
                )}
                {currentStep < 6 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="ml-auto"
                    disabled={!formData.acceptedTerms}
                  >
                    Publicar Evento
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 