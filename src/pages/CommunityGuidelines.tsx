"use client"

import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  Ban,
  Flag,
  Award,
  ThumbsUp,
  HeartHandshake,
} from "lucide-react"

const GuidelineSection = ({
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

export default function CommunityGuidelines() {
  const lastUpdated = "20 de maio de 2024"

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Diretrizes da Comunidade</h1>
            <p className="text-gray-600 mb-2">Construindo uma comunidade segura e respeitosa</p>
            <p className="text-sm text-gray-500">Última atualização: {lastUpdated}</p>
          </div>

          {/* Introdução */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Nossas Diretrizes da Comunidade foram criadas para garantir que todos os usuários da plataforma tenham
                uma experiência positiva e segura. Estas diretrizes se aplicam a todos os usuários, sejam compradores,
                vendedores ou organizadores de eventos. Ao usar nossa plataforma, você concorda em seguir estas
                diretrizes.
              </p>
            </CardContent>
          </Card>

          {/* Seções das diretrizes */}
          <div className="space-y-6">
            <GuidelineSection icon={<UserCheck className="text-[#02488C]" size={20} />} title="1. Princípios Básicos">
              <div className="space-y-3">
                <p>
                  Nossa comunidade é baseada em respeito mútuo e confiança. Pedimos que todos os usuários sigam estes
                  princípios básicos:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tratar todos os membros da comunidade com respeito e cortesia</li>
                  <li>Agir com honestidade e transparência em todas as interações</li>
                  <li>Respeitar a diversidade de opiniões, culturas e identidades</li>
                  <li>Cumprir as leis locais e nacionais aplicáveis</li>
                  <li>Priorizar a segurança e o bem-estar de todos os participantes</li>
                </ul>
              </div>
            </GuidelineSection>

            <GuidelineSection icon={<Users className="text-[#02488C]" size={20} />} title="2. Comportamento Esperado">
              <div className="space-y-3">
                <h4 className="font-semibold">2.1 Para Todos os Usuários</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer informações precisas e verdadeiras</li>
                  <li>Comunicar-se de forma respeitosa e construtiva</li>
                  <li>Respeitar a privacidade e os dados pessoais de outros usuários</li>
                  <li>Reportar comportamentos inadequados ou suspeitos</li>
                </ul>

                <h4 className="font-semibold">2.2 Para Compradores</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Realizar pagamentos apenas através dos canais oficiais da plataforma</li>
                  <li>Comparecer aos eventos para os quais adquiriu ingressos</li>
                  <li>Respeitar as regras específicas de cada evento</li>
                  <li>Não transferir ingressos de forma não autorizada</li>
                </ul>

                <h4 className="font-semibold">2.3 Para Organizadores</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer descrições precisas e completas dos eventos</li>
                  <li>Cumprir com os termos e condições anunciados</li>
                  <li>Garantir a segurança e acessibilidade dos eventos</li>
                  <li>Responder prontamente às dúvidas e preocupações dos compradores</li>
                </ul>
              </div>
            </GuidelineSection>

            <GuidelineSection icon={<Ban className="text-[#02488C]" size={20} />} title="3. Comportamentos Proibidos">
              <div className="space-y-3">
                <p>Os seguintes comportamentos são estritamente proibidos em nossa plataforma:</p>

                <h4 className="font-semibold">3.1 Atividades Fraudulentas</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criar eventos falsos ou enganosos</li>
                  <li>Vender ingressos falsos ou duplicados</li>
                  <li>Usar informações de pagamento fraudulentas</li>
                  <li>Criar múltiplas contas para contornar restrições</li>
                </ul>

                <h4 className="font-semibold">3.2 Cambismo</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Comprar ingressos com o único propósito de revenda</li>
                  <li>Revender ingressos por preços acima do valor de face</li>
                  <li>Usar bots ou scripts para comprar ingressos em massa</li>
                  <li>Criar escassez artificial de ingressos</li>
                </ul>

                <h4 className="font-semibold">3.3 Conteúdo Inadequado</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Discurso de ódio ou discriminação</li>
                  <li>Assédio ou intimidação</li>
                  <li>Conteúdo sexualmente explícito ou ofensivo</li>
                  <li>Promoção de atividades ilegais</li>
                  <li>Informações pessoais de terceiros sem consentimento</li>
                </ul>
              </div>
            </GuidelineSection>

            <GuidelineSection
              icon={<ShieldAlert className="text-[#02488C]" size={20} />}
              title="4. Segurança e Proteção"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">4.1 Segurança da Conta</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Use senhas fortes e exclusivas</li>
                  <li>Não compartilhe suas credenciais de acesso</li>
                  <li>Ative a autenticação de dois fatores quando disponível</li>
                  <li>Monitore regularmente a atividade da sua conta</li>
                </ul>

                <h4 className="font-semibold">4.2 Transações Seguras</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Realize todas as transações dentro da plataforma</li>
                  <li>Desconfie de ofertas com preços muito abaixo do mercado</li>
                  <li>Verifique a reputação e avaliações dos vendedores</li>
                  <li>Não envie dinheiro por transferências diretas não autorizadas</li>
                </ul>

                <h4 className="font-semibold">4.3 Proteção de Dados</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Não solicite dados pessoais desnecessários de outros usuários</li>
                  <li>Não compartilhe informações sensíveis em áreas públicas</li>
                  <li>Respeite a privacidade de todos os membros da comunidade</li>
                </ul>
              </div>
            </GuidelineSection>

            <GuidelineSection
              icon={<HeartHandshake className="text-[#02488C]" size={20} />}
              title="5. Inclusão e Acessibilidade"
            >
              <div className="space-y-3">
                <p>
                  Estamos comprometidos em criar uma comunidade inclusiva e acessível para todos. Incentivamos os
                  seguintes comportamentos:
                </p>

                <h4 className="font-semibold">5.1 Respeito à Diversidade</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Reconhecer e respeitar a diversidade de nossa comunidade</li>
                  <li>Evitar linguagem ou comportamentos discriminatórios</li>
                  <li>Considerar diferentes perspectivas e experiências</li>
                </ul>

                <h4 className="font-semibold">5.2 Acessibilidade</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Organizadores devem fornecer informações sobre acessibilidade dos eventos</li>
                  <li>Considerar as necessidades de pessoas com deficiência</li>
                  <li>Oferecer opções inclusivas quando possível</li>
                </ul>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mt-3">
                  <p className="text-sm">
                    <strong>Nota:</strong> Eventos que promovam discriminação ou exclusão não são permitidos em nossa
                    plataforma.
                  </p>
                </div>
              </div>
            </GuidelineSection>

            <GuidelineSection
              icon={<MessageSquare className="text-[#02488C]" size={20} />}
              title="6. Comunicação e Avaliações"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">6.1 Comunicação Respeitosa</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Mantenha um tom respeitoso em todas as comunicações</li>
                  <li>Evite linguagem ofensiva ou agressiva</li>
                  <li>Responda às mensagens em tempo hábil</li>
                  <li>Seja claro e direto em suas comunicações</li>
                </ul>

                <h4 className="font-semibold">6.2 Avaliações e Comentários</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Forneça avaliações honestas e construtivas</li>
                  <li>Baseie suas avaliações em experiências reais</li>
                  <li>Evite comentários pessoais ou ofensivos</li>
                  <li>Não use avaliações como forma de retaliação</li>
                </ul>

                <p>
                  Reservamo-nos o direito de remover avaliações que violem estas diretrizes ou que contenham informações
                  falsas.
                </p>
              </div>
            </GuidelineSection>

            <GuidelineSection icon={<Flag className="text-[#02488C]" size={20} />} title="7. Denúncias e Moderação">
              <div className="space-y-3">
                <h4 className="font-semibold">7.1 Como Denunciar</h4>
                <p>Se você encontrar conteúdo ou comportamento que viole nossas diretrizes, denuncie:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Use o botão "Denunciar" disponível em eventos, perfis e mensagens</li>
                  <li>Forneça detalhes específicos sobre a violação</li>
                  <li>Inclua evidências, se disponíveis (capturas de tela, etc.)</li>
                  <li>Para casos urgentes, entre em contato com nosso suporte</li>
                </ul>

                <h4 className="font-semibold">7.2 Processo de Moderação</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Todas as denúncias são revisadas por nossa equipe de moderação</li>
                  <li>Mantemos a confidencialidade do denunciante</li>
                  <li>Tomamos decisões baseadas em evidências e no contexto</li>
                  <li>Agimos de forma imparcial e consistente</li>
                </ul>

                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 mt-3">
                  <p className="text-sm">
                    <strong>Importante:</strong> Denúncias falsas ou maliciosas também são consideradas violações destas
                    diretrizes.
                  </p>
                </div>
              </div>
            </GuidelineSection>

            <GuidelineSection
              icon={<AlertTriangle className="text-[#02488C]" size={20} />}
              title="8. Consequências de Violações"
            >
              <div className="space-y-3">
                <p>
                  Violações destas diretrizes podem resultar em diversas ações, dependendo da gravidade e frequência:
                </p>

                <h4 className="font-semibold">8.1 Possíveis Ações</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Aviso formal</li>
                  <li>Remoção de conteúdo</li>
                  <li>Restrição temporária de funcionalidades</li>
                  <li>Suspensão temporária da conta</li>
                  <li>Banimento permanente da plataforma</li>
                  <li>Retenção de fundos em casos de fraude</li>
                  <li>Encaminhamento às autoridades legais em casos graves</li>
                </ul>

                <h4 className="font-semibold">8.2 Processo de Apelação</h4>
                <p>
                  Se você acredita que uma ação foi tomada injustamente contra sua conta, pode solicitar uma revisão
                  através do nosso suporte ao cliente.
                </p>
              </div>
            </GuidelineSection>

            <GuidelineSection icon={<Award className="text-[#02488C]" size={20} />} title="9. Reconhecimento Positivo">
              <div className="space-y-3">
                <p>
                  Valorizamos e reconhecemos membros que contribuem positivamente para nossa comunidade. Usuários
                  exemplares podem receber:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Badges de reconhecimento em seus perfis</li>
                  <li>Status de usuário verificado</li>
                  <li>Acesso antecipado a novos recursos</li>
                  <li>Convites para programas de embaixadores</li>
                  <li>Destaque em nossas redes sociais e comunicações</li>
                </ul>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-3">
                  <p className="text-sm">
                    <strong>Dica:</strong> Seja um exemplo positivo na comunidade seguindo estas diretrizes e ajudando
                    outros usuários.
                  </p>
                </div>
              </div>
            </GuidelineSection>

            <GuidelineSection icon={<ThumbsUp className="text-[#02488C]" size={20} />} title="10. Feedback e Evolução">
              <div className="space-y-3">
                <p>
                  Nossas diretrizes são um documento vivo que evolui com nossa comunidade. Valorizamos seu feedback para
                  melhorá-las:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Envie sugestões através do formulário de feedback</li>
                  <li>Participe de pesquisas sobre a experiência da comunidade</li>
                  <li>Junte-se aos nossos fóruns de discussão</li>
                  <li>Compartilhe exemplos de boas práticas que observou</li>
                </ul>

                <p>
                  Revisamos regularmente estas diretrizes para garantir que continuem relevantes e eficazes. Mudanças
                  significativas serão comunicadas a todos os usuários.
                </p>
              </div>
            </GuidelineSection>
          </div>

          <Separator className="my-8" />

          {/* Footer da página */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              Juntos, podemos construir uma comunidade segura, respeitosa e vibrante para todos os amantes de eventos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
                Voltar
              </Button>
              <Button
                onClick={() => (window.location.href = "/termos-de-uso")}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                Ver Termos de Uso
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
