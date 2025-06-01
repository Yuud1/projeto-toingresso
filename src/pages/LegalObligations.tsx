"use client"

import type React from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Scale,
  CreditCard,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Gavel,
  Receipt,
  UserCheck,
} from "lucide-react"

const LegalSection = ({
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

export default function LegalObligations() {
  const lastUpdated = "25 de maio de 2024"

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Obrigatoriedades Legais</h1>
            <p className="text-gray-600 mb-2">Conformidade legal e regulamentações aplicáveis</p>
            <p className="text-sm text-gray-500">Última atualização: {lastUpdated}</p>
          </div>

          {/* Introdução */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Esta página detalha as principais obrigatoriedades legais que regem nossa plataforma de compra e venda
                de ingressos no Brasil. Estamos comprometidos em cumprir todas as leis e regulamentações aplicáveis,
                incluindo o Código de Defesa do Consumidor, Lei Geral de Proteção de Dados (LGPD), legislação tributária
                e demais normas pertinentes ao setor de entretenimento e comércio eletrônico.
              </p>
            </CardContent>
          </Card>

          {/* Seções das obrigatoriedades */}
          <div className="space-y-6">
            <LegalSection
              icon={<Scale className="text-[#02488C]" size={20} />}
              title="1. Marco Legal Civil da Internet (Lei 12.965/2014)"
            >
              <div className="space-y-3">
                <p>
                  Como plataforma digital, cumprimos integralmente o Marco Civil da Internet, garantindo os direitos dos
                  usuários:
                </p>

                <h4 className="font-semibold">1.1 Princípios Fundamentais</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Garantia da liberdade de expressão, comunicação e manifestação de pensamento</li>
                  <li>Proteção da privacidade e dos dados pessoais</li>
                  <li>Preservação e garantia da neutralidade de rede</li>
                  <li>Preservação da estabilidade, segurança e funcionalidade da rede</li>
                </ul>

                <h4 className="font-semibold">1.2 Responsabilidades da Plataforma</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Manter registros de conexão por 6 meses em ambiente controlado e de segurança</li>
                  <li>Guardar registros de acesso a aplicações de internet por 6 meses</li>
                  <li>Fornecer informações mediante ordem judicial</li>
                  <li>Notificar usuários sobre coleta, uso, armazenamento e tratamento de dados</li>
                </ul>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-3">
                  <p className="text-sm">
                    <strong>Conformidade:</strong> Mantemos logs de acesso e conexão conforme exigido pela legislação.
                  </p>
                </div>
              </div>
            </LegalSection>

            <LegalSection
              icon={<Shield className="text-[#02488C]" size={20} />}
              title="2. Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)"
            >
              <div className="space-y-3">
                <p>Cumprimos integralmente a LGPD em todas as operações de tratamento de dados pessoais:</p>

                <h4 className="font-semibold">2.1 Bases Legais para Tratamento</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Execução de contrato:</strong> Para processar compras e fornecer serviços
                  </li>
                  <li>
                    <strong>Legítimo interesse:</strong> Para prevenção de fraudes e segurança
                  </li>
                  <li>
                    <strong>Consentimento:</strong> Para marketing e comunicações promocionais
                  </li>
                  <li>
                    <strong>Cumprimento de obrigação legal:</strong> Para questões fiscais e regulamentares
                  </li>
                </ul>

                <h4 className="font-semibold">2.2 Direitos dos Titulares</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso aos dados</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Informação sobre compartilhamento de dados</li>
                  <li>Revogação do consentimento</li>
                </ul>

                <h4 className="font-semibold">2.3 Medidas de Segurança</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia de dados sensíveis</li>
                  <li>Controles de acesso baseados em função</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Plano de resposta a incidentes</li>
                  <li>Treinamento regular da equipe</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<Users className="text-[#02488C]" size={20} />}
              title="3. Código de Defesa do Consumidor (Lei 8.078/1990)"
            >
              <div className="space-y-3">
                <p>
                  Como intermediadores de vendas de ingressos, respeitamos integralmente os direitos dos consumidores:
                </p>

                <h4 className="font-semibold">3.1 Direitos Básicos do Consumidor</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Proteção da vida, saúde e segurança contra riscos</li>
                  <li>Educação e divulgação sobre consumo adequado</li>
                  <li>Informação adequada e clara sobre produtos e serviços</li>
                  <li>Proteção contra publicidade enganosa e abusiva</li>
                  <li>Modificação de cláusulas contratuais desproporcionais</li>
                  <li>Prevenção e reparação de danos patrimoniais e morais</li>
                </ul>

                <h4 className="font-semibold">3.2 Informações Obrigatórias</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Preços claros e completos, incluindo todas as taxas</li>
                  <li>Condições de pagamento e entrega</li>
                  <li>Políticas de cancelamento e reembolso</li>
                  <li>Dados completos do organizador do evento</li>
                  <li>Características essenciais do evento</li>
                </ul>

                <h4 className="font-semibold">3.3 Direito de Arrependimento</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>7 dias para desistir de compras online (quando aplicável)</li>
                  <li>Reembolso integral em caso de exercício do direito</li>
                  <li>Exceções para eventos com data específica</li>
                  <li>Política clara de cancelamento para cada tipo de evento</li>
                </ul>

                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 mt-3">
                  <p className="text-sm">
                    <strong>Importante:</strong> O direito de arrependimento pode não se aplicar a ingressos para
                    eventos com data específica, conforme jurisprudência consolidada.
                  </p>
                </div>
              </div>
            </LegalSection>

            <LegalSection
              icon={<Receipt className="text-[#02488C]" size={20} />}
              title="4. Obrigações Tributárias e Fiscais"
            >
              <div className="space-y-3">
                <p>Cumprimos todas as obrigações tributárias aplicáveis ao nosso modelo de negócio:</p>

                <h4 className="font-semibold">4.1 Impostos e Contribuições</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>ISS:</strong> Recolhimento do Imposto Sobre Serviços conforme legislação municipal
                  </li>
                  <li>
                    <strong>COFINS:</strong> Contribuição para Financiamento da Seguridade Social
                  </li>
                  <li>
                    <strong>PIS:</strong> Programa de Integração Social
                  </li>
                  <li>
                    <strong>IRPJ:</strong> Imposto de Renda Pessoa Jurídica
                  </li>
                  <li>
                    <strong>CSLL:</strong> Contribuição Social sobre o Lucro Líquido
                  </li>
                </ul>

                <h4 className="font-semibold">4.2 Obrigações Acessórias</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Emissão de notas fiscais eletrônicas para todas as transações</li>
                  <li>Escrituração fiscal digital (EFD)</li>
                  <li>Declaração de Informações Econômico-Fiscais (DEFIS)</li>
                  <li>Demonstrativo de Apuração de Contribuições Sociais (DACON)</li>
                </ul>

                <h4 className="font-semibold">4.3 Retenções e Repasses</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Retenção de impostos quando aplicável</li>
                  <li>Repasse correto dos valores aos organizadores</li>
                  <li>Informações fiscais claras para todos os participantes</li>
                  <li>Relatórios fiscais detalhados</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<Building2 className="text-[#02488C]" size={20} />}
              title="5. Regulamentações do Setor de Entretenimento"
            >
              <div className="space-y-3">
                <p>Cumprimos as regulamentações específicas do setor de entretenimento e eventos:</p>

                <h4 className="font-semibold">5.1 Lei de Direitos Autorais (Lei 9.610/1998)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Respeito aos direitos autorais de artistas e produtores</li>
                  <li>Verificação de licenças para uso de imagens e conteúdo</li>
                  <li>Proteção contra pirataria e uso não autorizado</li>
                  <li>Cumprimento de acordos com entidades de gestão coletiva</li>
                </ul>

                <h4 className="font-semibold">5.2 Estatuto da Criança e do Adolescente (ECA)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verificação de classificação etária dos eventos</li>
                  <li>Controle de acesso de menores a eventos restritos</li>
                  <li>Exigência de autorização dos pais quando necessário</li>
                  <li>Proteção especial para dados de menores de idade</li>
                </ul>

                <h4 className="font-semibold">5.3 Normas de Segurança e Acessibilidade</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verificação de alvarás e licenças dos locais de eventos</li>
                  <li>Cumprimento de normas de segurança contra incêndio</li>
                  <li>Garantia de acessibilidade conforme NBR 9050</li>
                  <li>Capacidade máxima dos locais respeitada</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<CreditCard className="text-[#02488C]" size={20} />}
              title="6. Regulamentações Financeiras"
            >
              <div className="space-y-3">
                <p>Cumprimos as normas do Sistema Financeiro Nacional e órgãos reguladores:</p>

                <h4 className="font-semibold">6.1 Banco Central do Brasil (BACEN)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cumprimento das normas de arranjos de pagamento</li>
                  <li>Registro adequado de instituições de pagamento parceiras</li>
                  <li>Controles de prevenção à lavagem de dinheiro</li>
                  <li>Relatórios regulamentares quando exigidos</li>
                </ul>

                <h4 className="font-semibold">6.2 Conselho de Controle de Atividades Financeiras (COAF)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Identificação e verificação de clientes (KYC)</li>
                  <li>Monitoramento de transações suspeitas</li>
                  <li>Comunicação de operações suspeitas quando necessário</li>
                  <li>Manutenção de registros por período legal</li>
                </ul>

                <h4 className="font-semibold">6.3 Proteção de Dados Financeiros</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia de dados de pagamento</li>
                  <li>Conformidade com padrões PCI DSS</li>
                  <li>Segregação de dados financeiros sensíveis</li>
                  <li>Auditoria regular de segurança financeira</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<UserCheck className="text-[#02488C]" size={20} />}
              title="7. Combate à Discriminação e Inclusão"
            >
              <div className="space-y-3">
                <p>Cumprimos a legislação antidiscriminação e promovemos a inclusão:</p>

                <h4 className="font-semibold">7.1 Constituição Federal e Leis Antidiscriminação</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Proibição de discriminação por raça, cor, religião, origem</li>
                  <li>Igualdade de tratamento independente de orientação sexual</li>
                  <li>Não discriminação por deficiência ou condição social</li>
                  <li>Respeito à diversidade em todas as formas</li>
                </ul>

                <h4 className="font-semibold">7.2 Lei Brasileira de Inclusão (Lei 13.146/2015)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Garantia de acessibilidade em eventos</li>
                  <li>Disponibilização de informações sobre acessibilidade</li>
                  <li>Preços especiais para acompanhantes quando necessário</li>
                  <li>Tecnologias assistivas quando aplicável</li>
                </ul>

                <h4 className="font-semibold">7.3 Políticas Internas de Inclusão</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Treinamento de equipe sobre diversidade e inclusão</li>
                  <li>Canais específicos para denúncias de discriminação</li>
                  <li>Parcerias com organizações de direitos humanos</li>
                  <li>Monitoramento de práticas inclusivas</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<AlertTriangle className="text-[#02488C]" size={20} />}
              title="8. Prevenção de Atividades Ilícitas"
            >
              <div className="space-y-3">
                <p>Implementamos medidas rigorosas para prevenir atividades ilícitas:</p>

                <h4 className="font-semibold">8.1 Combate ao Cambismo</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Monitoramento de padrões de compra suspeitos</li>
                  <li>Limitação de quantidade de ingressos por pessoa</li>
                  <li>Verificação de identidade em casos suspeitos</li>
                  <li>Cooperação com autoridades competentes</li>
                </ul>

                <h4 className="font-semibold">8.2 Prevenção de Fraudes</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sistemas automatizados de detecção de fraude</li>
                  <li>Verificação de dados de pagamento</li>
                  <li>Análise comportamental de usuários</li>
                  <li>Bloqueio preventivo de transações suspeitas</li>
                </ul>

                <h4 className="font-semibold">8.3 Combate à Lavagem de Dinheiro</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Identificação e verificação de clientes</li>
                  <li>Monitoramento de transações de alto valor</li>
                  <li>Relatórios de operações suspeitas</li>
                  <li>Treinamento de equipe sobre sinais de alerta</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection
              icon={<Clock className="text-[#02488C]" size={20} />}
              title="9. Prazos e Procedimentos Legais"
            >
              <div className="space-y-3">
                <p>Cumprimos rigorosamente todos os prazos estabelecidos pela legislação:</p>

                <h4 className="font-semibold">9.1 Prazos LGPD</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Resposta a solicitações de titulares: até 15 dias úteis</li>
                  <li>Notificação de incidentes à ANPD: até 72 horas</li>
                  <li>Comunicação de incidentes aos titulares: prazo razoável</li>
                  <li>Implementação de medidas corretivas: conforme determinado</li>
                </ul>

                <h4 className="font-semibold">9.2 Prazos Consumeristas</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Direito de arrependimento: 7 dias corridos</li>
                  <li>Resposta a reclamações: até 5 dias úteis</li>
                  <li>Resolução de problemas: até 30 dias</li>
                  <li>Reembolsos: conforme política específica</li>
                </ul>

                <h4 className="font-semibold">9.3 Prazos Fiscais</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Emissão de notas fiscais: até o momento da prestação</li>
                  <li>Recolhimento de impostos: conforme calendário fiscal</li>
                  <li>Entrega de obrigações acessórias: prazos específicos</li>
                  <li>Guarda de documentos: 5 anos mínimo</li>
                </ul>
              </div>
            </LegalSection>

            <LegalSection icon={<Gavel className="text-[#02488C]" size={20} />} title="10. Compliance e Auditoria">
              <div className="space-y-3">
                <p>Mantemos um programa robusto de compliance e auditoria:</p>

                <h4 className="font-semibold">10.1 Programa de Compliance</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Código de Ética e Conduta interno</li>
                  <li>Treinamentos regulares para toda a equipe</li>
                  <li>Canal de denúncias anônimas</li>
                  <li>Comitê de Ética e Compliance</li>
                  <li>Avaliações periódicas de riscos</li>
                </ul>

                <h4 className="font-semibold">10.2 Auditorias e Monitoramento</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Auditoria interna anual</li>
                  <li>Auditoria externa independente</li>
                  <li>Monitoramento contínuo de conformidade</li>
                  <li>Relatórios regulares para alta administração</li>
                  <li>Planos de ação corretiva quando necessário</li>
                </ul>

                <h4 className="font-semibold">10.3 Atualizações Legislativas</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Monitoramento constante de mudanças na legislação</li>
                  <li>Assessoria jurídica especializada</li>
                  <li>Adaptação rápida a novas exigências</li>
                  <li>Comunicação de mudanças aos usuários</li>
                </ul>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mt-3">
                  <p className="text-sm">
                    <strong>Compromisso:</strong> Revisamos e atualizamos nossos procedimentos regularmente para manter
                    total conformidade legal.
                  </p>
                </div>
              </div>
            </LegalSection>
          </div>

          <Separator className="my-8" />

          {/* Footer da página */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              Nosso compromisso é operar com total transparência e conformidade legal, garantindo segurança e confiança
              para todos os usuários.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
                Voltar
              </Button>
              <Button
                onClick={() => (window.location.href = "/politica-privacidade")}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                Ver Política de Privacidade
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
