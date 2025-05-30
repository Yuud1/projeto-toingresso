"use client"

import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Settings,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

const PolicySection = ({
  icon,
  title,
  children,
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
    <CardContent className="prose prose-sm sm:prose-base max-w-none">{children}</CardContent>
  </Card>
)

export default function PrivacyPolicy() {
  const lastUpdated = "10 de junho de 2024"

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-gray-600 mb-2">Protegendo seus dados pessoais com transparência</p>
            <p className="text-sm text-gray-500">Última atualização: {lastUpdated}</p>
          </div>

          {/* Introdução */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações
                pessoais quando você usa nossa plataforma de compra e venda de ingressos. Estamos comprometidos em
                proteger sua privacidade e garantir a transparência sobre o tratamento de seus dados pessoais, em
                conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
              </p>
            </CardContent>
          </Card>

          {/* Seções da política */}
          <div className="space-y-6">
            <PolicySection icon={<Database className="text-[#02488C]" size={20} />} title="1. Dados que Coletamos">
              <div className="space-y-3">
                <p>Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:</p>

                <h4 className="font-semibold">1.1 Dados Fornecidos por Você</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Informações de conta:</strong> Nome, e-mail, telefone, data de nascimento, CPF/CNPJ
                  </li>
                  <li>
                    <strong>Informações de pagamento:</strong> Dados do cartão de crédito, informações bancárias
                  </li>
                  <li>
                    <strong>Informações de perfil:</strong> Foto, preferências, redes sociais
                  </li>
                  <li>
                    <strong>Comunicações:</strong> Mensagens, avaliações, comentários, suporte ao cliente
                  </li>
                  <li>
                    <strong>Dados de eventos:</strong> Para organizadores - descrições, imagens, informações do evento
                  </li>
                </ul>

                <h4 className="font-semibold">1.2 Dados Coletados Automaticamente</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Informações técnicas:</strong> Endereço IP, tipo de dispositivo, navegador, sistema
                    operacional
                  </li>
                  <li>
                    <strong>Dados de uso:</strong> Páginas visitadas, tempo de permanência, cliques, pesquisas
                  </li>
                  <li>
                    <strong>Localização:</strong> Localização aproximada baseada no IP (com seu consentimento)
                  </li>
                  <li>
                    <strong>Cookies:</strong> Identificadores únicos para personalizar sua experiência
                  </li>
                </ul>

                <h4 className="font-semibold">1.3 Dados de Terceiros</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Informações de redes sociais (quando você conecta suas contas)</li>
                  <li>Dados de verificação de identidade de parceiros autorizados</li>
                  <li>Informações de prevenção à fraude de provedores especializados</li>
                </ul>
              </div>
            </PolicySection>

            <PolicySection icon={<Eye className="text-[#02488C]" size={20} />} title="2. Como Usamos seus Dados">
              <div className="space-y-3">
                <p>Utilizamos suas informações pessoais para os seguintes propósitos:</p>

                <h4 className="font-semibold">2.1 Prestação de Serviços</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Processar compras e vendas de ingressos</li>
                  <li>Gerenciar sua conta e perfil</li>
                  <li>Facilitar comunicação entre compradores e organizadores</li>
                  <li>Processar pagamentos e reembolsos</li>
                  <li>Verificar identidade e prevenir fraudes</li>
                </ul>

                <h4 className="font-semibold">2.2 Comunicação</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Enviar confirmações de compra e atualizações de eventos</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Enviar notificações importantes sobre a conta</li>
                  <li>Comunicar mudanças em nossos termos e políticas</li>
                </ul>

                <h4 className="font-semibold">2.3 Personalização e Marketing</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Personalizar recomendações de eventos</li>
                  <li>Enviar ofertas e promoções relevantes (com seu consentimento)</li>
                  <li>Melhorar a experiência do usuário na plataforma</li>
                  <li>Realizar pesquisas de satisfação</li>
                </ul>

                <h4 className="font-semibold">2.4 Segurança e Conformidade</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Detectar e prevenir atividades fraudulentas</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Proteger direitos e propriedade da empresa</li>
                  <li>Resolver disputas e fazer cumprir nossos termos</li>
                </ul>
              </div>
            </PolicySection>

            <PolicySection icon={<Share2 className="text-[#02488C]" size={20} />} title="3. Compartilhamento de Dados">
              <div className="space-y-3">
                <p>Compartilhamos suas informações apenas nas seguintes circunstâncias:</p>

                <h4 className="font-semibold">3.1 Com Organizadores de Eventos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nome e informações de contato para eventos que você comprou</li>
                  <li>Informações necessárias para entrada no evento</li>
                  <li>Dados agregados e anonimizados sobre vendas</li>
                </ul>

                <h4 className="font-semibold">3.2 Com Prestadores de Serviços</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Processadores de pagamento para transações financeiras</li>
                  <li>Provedores de e-mail para comunicações</li>
                  <li>Serviços de análise para melhorar a plataforma</li>
                  <li>Provedores de segurança para prevenção de fraudes</li>
                </ul>

                <h4 className="font-semibold">3.3 Por Obrigação Legal</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Para proteger direitos, propriedade ou segurança</li>
                  <li>Em investigações de atividades ilegais</li>
                  <li>Para cumprir regulamentações governamentais</li>
                </ul>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-3">
                  <p className="text-sm">
                    <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros para fins comerciais.
                  </p>
                </div>
              </div>
            </PolicySection>

            <PolicySection icon={<Lock className="text-[#02488C]" size={20} />} title="4. Segurança dos Dados">
              <div className="space-y-3">
                <p>
                  Implementamos medidas técnicas e organizacionais robustas para proteger suas informações pessoais:
                </p>

                <h4 className="font-semibold">4.1 Medidas Técnicas</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia SSL/TLS para transmissão de dados</li>
                  <li>Criptografia de dados sensíveis em repouso</li>
                  <li>Firewalls e sistemas de detecção de intrusão</li>
                  <li>Autenticação de dois fatores para contas administrativas</li>
                  <li>Monitoramento contínuo de segurança</li>
                </ul>

                <h4 className="font-semibold">4.2 Medidas Organizacionais</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Acesso limitado aos dados apenas para funcionários autorizados</li>
                  <li>Treinamento regular de segurança para equipe</li>
                  <li>Políticas internas de proteção de dados</li>
                  <li>Auditorias regulares de segurança</li>
                  <li>Planos de resposta a incidentes</li>
                </ul>

                <h4 className="font-semibold">4.3 Armazenamento Seguro</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Servidores localizados em data centers certificados</li>
                  <li>Backups regulares e seguros</li>
                  <li>Controles de acesso físico rigorosos</li>
                  <li>Conformidade com padrões internacionais de segurança</li>
                </ul>
              </div>
            </PolicySection>

            <PolicySection icon={<UserCheck className="text-[#02488C]" size={20} />} title="5. Seus Direitos (LGPD)">
              <div className="space-y-3">
                <p>
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos sobre seus
                  dados pessoais:
                </p>

                <h4 className="font-semibold">5.1 Direitos Fundamentais</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Acesso:</strong> Solicitar informações sobre quais dados temos sobre você
                  </li>
                  <li>
                    <strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados
                  </li>
                  <li>
                    <strong>Exclusão:</strong> Solicitar a eliminação de dados desnecessários ou excessivos
                  </li>
                  <li>
                    <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
                  </li>
                  <li>
                    <strong>Oposição:</strong> Opor-se ao tratamento de dados em certas situações
                  </li>
                </ul>

                <h4 className="font-semibold">5.2 Como Exercer seus Direitos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Através das configurações da sua conta na plataforma</li>
                  <li>Enviando solicitação para nosso e-mail de privacidade</li>
                  <li>Entrando em contato com nosso Encarregado de Dados (DPO)</li>
                  <li>Através do formulário de solicitação em nosso site</li>
                </ul>

                <h4 className="font-semibold">5.3 Prazos de Resposta</h4>
                <p>
                  Responderemos às suas solicitações em até 15 dias úteis. Em casos complexos, este prazo pode ser
                  estendido por mais 15 dias, com devida justificativa.
                </p>
              </div>
            </PolicySection>

            <PolicySection icon={<Settings className="text-[#02488C]" size={20} />} title="6. Cookies e Tecnologias">
              <div className="space-y-3">
                <p>Utilizamos cookies e tecnologias similares para melhorar sua experiência:</p>

                <h4 className="font-semibold">6.1 Tipos de Cookies</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Essenciais:</strong> Necessários para o funcionamento básico da plataforma
                  </li>
                  <li>
                    <strong>Funcionais:</strong> Lembram suas preferências e configurações
                  </li>
                  <li>
                    <strong>Analíticos:</strong> Ajudam a entender como você usa a plataforma
                  </li>
                  <li>
                    <strong>Marketing:</strong> Personalizam anúncios e ofertas (com seu consentimento)
                  </li>
                </ul>

                <h4 className="font-semibold">6.2 Gerenciamento de Cookies</h4>
                <p>Você pode gerenciar cookies através de:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Configurações do seu navegador</li>
                  <li>Nossa central de preferências de cookies</li>
                  <li>Ferramentas de opt-out de terceiros</li>
                </ul>

                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 mt-3">
                  <p className="text-sm">
                    <strong>Nota:</strong> Desabilitar cookies essenciais pode afetar o funcionamento da plataforma.
                  </p>
                </div>
              </div>
            </PolicySection>

            <PolicySection
              icon={<Trash2 className="text-[#02488C]" size={20} />}
              title="7. Retenção e Exclusão de Dados"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">7.1 Períodos de Retenção</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Dados de conta:</strong> Mantidos enquanto a conta estiver ativa
                  </li>
                  <li>
                    <strong>Dados de transação:</strong> 5 anos após a transação (obrigação legal)
                  </li>
                  <li>
                    <strong>Dados de marketing:</strong> Até você retirar o consentimento
                  </li>
                  <li>
                    <strong>Logs de segurança:</strong> 6 meses para fins de segurança
                  </li>
                </ul>

                <h4 className="font-semibold">7.2 Exclusão de Conta</h4>
                <p>Quando você exclui sua conta:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Dados pessoais são removidos em até 30 dias</li>
                  <li>Alguns dados podem ser mantidos por obrigações legais</li>
                  <li>Dados anonimizados podem ser mantidos para análises</li>
                  <li>Você receberá confirmação da exclusão</li>
                </ul>
              </div>
            </PolicySection>

            <PolicySection
              icon={<Download className="text-[#02488C]" size={20} />}
              title="8. Transferência Internacional"
            >
              <div className="space-y-3">
                <p>
                  Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Quando transferimos
                  dados internacionalmente:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Garantimos que o país possui nível adequado de proteção</li>
                  <li>Implementamos salvaguardas contratuais apropriadas</li>
                  <li>Obtemos seu consentimento quando necessário</li>
                  <li>Monitoramos a conformidade dos parceiros internacionais</li>
                </ul>

                <p>
                  Você pode solicitar informações específicas sobre transferências que envolvem seus dados pessoais.
                </p>
              </div>
            </PolicySection>

            <PolicySection icon={<Shield className="text-[#02488C]" size={20} />} title="9. Menores de Idade">
              <div className="space-y-3">
                <p>Nossa plataforma não é destinada a menores de 18 anos. Entretanto:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Menores podem usar a plataforma com autorização dos responsáveis</li>
                  <li>Coletamos dados de menores apenas com consentimento dos pais/responsáveis</li>
                  <li>Implementamos proteções especiais para dados de menores</li>
                  <li>Pais/responsáveis podem solicitar exclusão de dados de menores</li>
                </ul>

                <p>
                  Se tomarmos conhecimento de que coletamos dados de menores sem autorização, excluiremos essas
                  informações imediatamente.
                </p>
              </div>
            </PolicySection>

            <PolicySection
              icon={<Mail className="text-[#02488C]" size={20} />}
              title="10. Contato e Encarregado de Dados"
            >
              <div className="space-y-4">
                <p>Para questões sobre privacidade e proteção de dados, entre em contato:</p>

                <h4 className="font-semibold">Encarregado de Proteção de Dados (DPO)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-[#02488C]" size={20} />
                    <div>
                      <p className="font-semibold text-sm">E-mail</p>
                      <p className="text-sm text-gray-600">dpo@empresa.com</p>
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

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-[#02488C] mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Endereço</p>
                    <p className="text-sm text-gray-600">
                      Rua das Empresas, 123 - Sala 456
                      <br />
                      São Paulo, SP - CEP 01234-567
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong> Você também pode entrar em contato
                    com a ANPD para questões sobre proteção de dados pessoais.
                  </p>
                </div>
              </div>
            </PolicySection>
          </div>

          <Separator className="my-8" />

          {/* Footer da página */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              Estamos comprometidos em proteger sua privacidade e manter a transparência sobre o uso de seus dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
                Voltar
              </Button>
              <Button
                onClick={() => (window.location.href = "/diretrizes-comunidade")}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                Ver Diretrizes da Comunidade
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
