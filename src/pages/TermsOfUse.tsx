import type React from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Shield, CreditCard, RefreshCw, Users, Lock, Copyright, AlertTriangle, Mail, Phone } from 'lucide-react'

const TermsSection = ({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode
  title: string
  children: React.ReactNode 
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="prose prose-sm sm:prose-base max-w-none">
      {children}
    </CardContent>
  </Card>
)

export default function TermsOfUse() {
  const lastUpdated = "15 de janeiro de 2024"

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-gray-600 mb-2">
              Bem-vindo à nossa plataforma de venda de ingressos
            </p>
            <p className="text-sm text-gray-500">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Introdução */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Estes Termos de Uso regem o uso da nossa plataforma de compra e venda de ingressos. 
                Ao acessar ou usar nossos serviços, você concorda em cumprir estes termos. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </CardContent>
          </Card>

          {/* Seções dos termos */}
          <div className="space-y-6">
            <TermsSection
              icon={<FileText className="text-[#02488C]" size={20} />}
              title="1. Definições"
            >
              <div className="space-y-3">
                <p><strong>"Plataforma"</strong>: Refere-se ao nosso site e aplicativo de venda de ingressos.</p>
                <p><strong>"Usuário"</strong>: Qualquer pessoa que acesse ou use nossa plataforma.</p>
                <p><strong>"Organizador"</strong>: Pessoa ou empresa que cria e vende ingressos para eventos.</p>
                <p><strong>"Comprador"</strong>: Usuário que adquire ingressos através da plataforma.</p>
                <p><strong>"Evento"</strong>: Qualquer atividade, show, espetáculo ou experiência oferecida na plataforma.</p>
              </div>
            </TermsSection>

            <TermsSection
              icon={<Users className="text-[#02488C]" size={20} />}
              title="2. Uso da Plataforma"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">2.1 Elegibilidade</h4>
                <p>Você deve ter pelo menos 18 anos para usar nossa plataforma ou ter autorização de um responsável legal.</p>
                
                <h4 className="font-semibold">2.2 Conta do Usuário</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Você é responsável por manter a confidencialidade de sua conta</li>
                  <li>Deve fornecer informações precisas e atualizadas</li>
                  <li>É responsável por todas as atividades em sua conta</li>
                  <li>Deve notificar-nos imediatamente sobre uso não autorizado</li>
                </ul>

                <h4 className="font-semibold">2.3 Uso Proibido</h4>
                <p>É proibido:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usar a plataforma para atividades ilegais</li>
                  <li>Revender ingressos por preços superiores ao valor de face (cambismo)</li>
                  <li>Criar contas falsas ou usar informações de terceiros</li>
                  <li>Interferir no funcionamento da plataforma</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<CreditCard className="text-[#02488C]" size={20} />}
              title="3. Compra de Ingressos"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">3.1 Processo de Compra</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Os preços são exibidos em reais (BRL) e incluem taxas aplicáveis</li>
                  <li>A compra é confirmada após o processamento do pagamento</li>
                  <li>Você receberá um e-mail de confirmação com os detalhes do ingresso</li>
                  <li>Os ingressos são enviados eletronicamente ou disponibilizados para retirada</li>
                </ul>

                <h4 className="font-semibold">3.2 Disponibilidade</h4>
                <p>Os ingressos estão sujeitos à disponibilidade. Reservamo-nos o direito de limitar a quantidade de ingressos por pessoa.</p>

                <h4 className="font-semibold">3.3 Verificação de Idade</h4>
                <p>Alguns eventos podem ter restrições de idade. É responsabilidade do comprador verificar e cumprir essas restrições.</p>
              </div>
            </TermsSection>

            <TermsSection
              icon={<RefreshCw className="text-[#02488C]" size={20} />}
              title="4. Cancelamentos e Reembolsos"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">4.1 Cancelamento pelo Organizador</h4>
                <p>Se um evento for cancelado pelo organizador, você terá direito ao reembolso integral do valor pago.</p>

                <h4 className="font-semibold">4.2 Cancelamento pelo Comprador</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cancelamentos até 7 dias antes do evento: reembolso de 80% do valor</li>
                  <li>Cancelamentos entre 3-7 dias: reembolso de 50% do valor</li>
                  <li>Cancelamentos com menos de 3 dias: sem direito a reembolso</li>
                  <li>Taxas de processamento não são reembolsáveis</li>
                </ul>

                <h4 className="font-semibold">4.3 Transferência de Ingressos</h4>
                <p>Ingressos podem ser transferidos para terceiros através da plataforma, sujeito às políticas do organizador.</p>
              </div>
            </TermsSection>

            <TermsSection
              icon={<Shield className="text-[#02488C]" size={20} />}
              title="5. Responsabilidades"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">5.1 Responsabilidade da Plataforma</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Facilitamos a venda de ingressos entre organizadores e compradores</li>
                  <li>Processamos pagamentos de forma segura</li>
                  <li>Fornecemos suporte ao cliente</li>
                  <li>Não somos responsáveis pelo conteúdo ou qualidade dos eventos</li>
                </ul>

                <h4 className="font-semibold">5.2 Responsabilidade do Organizador</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Realizar o evento conforme anunciado</li>
                  <li>Fornecer informações precisas sobre o evento</li>
                  <li>Cumprir todas as leis e regulamentações aplicáveis</li>
                  <li>Honrar os ingressos vendidos através da plataforma</li>
                </ul>

                <h4 className="font-semibold">5.3 Responsabilidade do Comprador</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verificar detalhes do evento antes da compra</li>
                  <li>Apresentar-se no local e horário corretos</li>
                  <li>Portar documento de identificação válido</li>
                  <li>Seguir as regras do evento e local</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<Lock className="text-[#02488C]" size={20} />}
              title="6. Privacidade e Proteção de Dados"
            >
              <div className="space-y-3">
                <p>Respeitamos sua privacidade e protegemos seus dados pessoais conforme nossa Política de Privacidade.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Coletamos apenas dados necessários para fornecer nossos serviços</li>
                  <li>Não vendemos ou compartilhamos dados pessoais com terceiros sem consentimento</li>
                  <li>Implementamos medidas de segurança para proteger suas informações</li>
                  <li>Você pode solicitar acesso, correção ou exclusão de seus dados</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<Copyright className="text-[#02488C]" size={20} />}
              title="7. Propriedade Intelectual"
            >
              <div className="space-y-3">
                <p>Todo o conteúdo da plataforma, incluindo design, textos, imagens e software, é protegido por direitos autorais.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização</li>
                  <li>Organizadores mantêm direitos sobre o conteúdo de seus eventos</li>
                  <li>Respeitamos os direitos de propriedade intelectual de terceiros</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<AlertTriangle className="text-[#02488C]" size={20} />}
              title="8. Limitações de Responsabilidade"
            >
              <div className="space-y-3">
                <p>Nossa responsabilidade é limitada ao valor pago pelos ingressos. Não nos responsabilizamos por:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Danos indiretos, incidentais ou consequenciais</li>
                  <li>Perda de lucros ou oportunidades</li>
                  <li>Ações ou omissões de organizadores de eventos</li>
                  <li>Problemas técnicos fora de nosso controle</li>
                  <li>Força maior (eventos naturais, greves, etc.)</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<FileText className="text-[#02488C]" size={20} />}
              title="9. Modificações dos Termos"
            >
              <div className="space-y-3">
                <p>Podemos modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Notificaremos sobre mudanças significativas por e-mail</li>
                  <li>O uso continuado da plataforma constitui aceitação dos novos termos</li>
                  <li>Se não concordar com as alterações, deve parar de usar a plataforma</li>
                </ul>
              </div>
            </TermsSection>

            <TermsSection
              icon={<Mail className="text-[#02488C]" size={20} />}
              title="10. Contato"
            >
              <div className="space-y-4">
                <p>Para dúvidas sobre estes termos ou nossa plataforma, entre em contato:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-[#02488C]" size={20} />
                    <div>
                      <p className="font-semibold text-sm">E-mail</p>
                      <p className="text-sm text-gray-600">suporte@empresa.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="text-[#02488C]" size={20} />
                    <div>
                      <p className="font-semibold text-sm">Telefone</p>
                      <p className="text-sm text-gray-600">(11) 1234-5678</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h
                  </p>
                </div>
              </div>
            </TermsSection>
          </div>

          <Separator className="my-8" />

          {/* Footer da página */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              Ao usar nossa plataforma, você concorda com estes Termos de Uso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="cursor-pointer"
              >
                Voltar
              </Button>
              <Button 
                onClick={() => window.location.href = "/"}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                Ir para Home
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
