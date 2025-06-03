import type React from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  GraduationCap,
  FileText,
  Users,
  Ticket,
  BadgePercent,
  AlertCircle,
  HelpCircle,
  Scale,
  Landmark,
  Search,
} from "lucide-react"

const RuleSection = ({
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

export default function HalfPriceRules() {
  const lastUpdated = "15 de junho de 2024"

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Regras de Meia-Entrada</h1>
            <p className="text-gray-600 mb-2">Direitos e regulamentações sobre benefícios tarifários</p>
            <p className="text-sm text-gray-500">Última atualização: {lastUpdated}</p>
          </div>

          {/* Introdução */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Esta página detalha as regras e procedimentos para concessão de meia-entrada em eventos realizados em
                nossa plataforma, em conformidade com a Lei Federal nº 12.933/2013 e o Decreto nº 8.537/2015. Nosso
                compromisso é garantir que todos os beneficiários legais tenham acesso ao direito da meia-entrada, com
                transparência e respeito à legislação vigente.
              </p>
            </CardContent>
          </Card>

          {/* Seções das regras */}
          <div className="space-y-6">
            <RuleSection icon={<Landmark className="text-[#02488C]" size={20} />} title="1. Base Legal">
              <div className="space-y-3">
                <p>
                  A concessão de meia-entrada em eventos culturais e esportivos é regulamentada pelas seguintes
                  legislações:
                </p>

                <h4 className="font-semibold">1.1 Lei Federal nº 12.933/2013</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Dispõe sobre o benefício do pagamento de meia-entrada</li>
                  <li>Estabelece os grupos beneficiários do direito</li>
                  <li>Define a obrigatoriedade da concessão do benefício</li>
                  <li>Estabelece o limite de 40% do total de ingressos disponíveis</li>
                </ul>

                <h4 className="font-semibold">1.2 Decreto nº 8.537/2015</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Regulamenta a Lei Federal nº 12.933/2013</li>
                  <li>Detalha os procedimentos para comprovação do direito</li>
                  <li>Especifica os documentos válidos para cada categoria</li>
                  <li>Estabelece as sanções pelo descumprimento</li>
                </ul>

                <h4 className="font-semibold">1.3 Legislações Estaduais e Municipais</h4>
                <p>
                  Além da legislação federal, alguns estados e municípios possuem leis específicas que podem ampliar os
                  beneficiários ou estabelecer regras adicionais. Estas são aplicadas conforme a localização do evento.
                </p>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-3">
                  <p className="text-sm">
                    <strong>Nota:</strong> Em caso de conflito entre legislações, prevalece a norma mais favorável ao
                    beneficiário, desde que não contrarie a legislação federal.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<Users className="text-[#02488C]" size={20} />} title="2. Beneficiários">
              <div className="space-y-3">
                <p>
                  De acordo com a legislação federal, têm direito ao benefício da meia-entrada as seguintes categorias:
                </p>

                <h4 className="font-semibold">2.1 Estudantes</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Estudantes regularmente matriculados nos níveis e modalidades de educação e ensino previstos no
                    Título V da Lei nº 9.394/1996 (Lei de Diretrizes e Bases da Educação)
                  </li>
                  <li>
                    Inclui educação básica (educação infantil, ensino fundamental e médio) e educação superior
                    (graduação e pós-graduação)
                  </li>
                  <li>Estudantes de cursos técnicos e profissionalizantes com carga horária mínima de 160 horas</li>
                  <li>Estudantes de cursos de ensino à distância reconhecidos pelo MEC</li>
                </ul>

                <h4 className="font-semibold">2.2 Idosos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pessoas com idade igual ou superior a 60 (sessenta) anos</li>
                  <li>Benefício garantido pelo Estatuto do Idoso (Lei nº 10.741/2003)</li>
                  <li>Não está sujeito ao limite de 40% dos ingressos disponíveis</li>
                </ul>

                <h4 className="font-semibold">2.3 Pessoas com Deficiência</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pessoas com impedimento de longo prazo de natureza física, mental, intelectual ou sensorial</li>
                  <li>Inclui acompanhante quando necessário (comprovado por laudo médico)</li>
                  <li>Não está sujeito ao limite de 40% dos ingressos disponíveis</li>
                </ul>

                <h4 className="font-semibold">2.4 Jovens de Baixa Renda</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Jovens de 15 a 29 anos inscritos no Cadastro Único para Programas Sociais (CadÚnico)</li>
                  <li>Renda familiar mensal de até 2 (dois) salários mínimos</li>
                  <li>Inscritos no Cadastro Único do Governo Federal</li>
                </ul>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mt-3">
                  <p className="text-sm">
                    <strong>Importante:</strong> Alguns estados e municípios podem conceder o benefício a categorias
                    adicionais, como professores, doadores de sangue, entre outros. Verifique a legislação local
                    aplicável ao evento.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<FileText className="text-[#02488C]" size={20} />} title="3. Documentação Necessária">
              <div className="space-y-3">
                <p>Para usufruir do benefício da meia-entrada, é necessário apresentar documentação específica:</p>

                <h4 className="font-semibold">3.1 Para Estudantes</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Carteira de Identificação Estudantil (CIE)</strong> emitida pela ANPG, UNE, UBES, entidades
                    estaduais e municipais, Diretórios Centrais dos Estudantes, Centros e Diretórios Acadêmicos
                  </li>
                  <li>
                    A CIE deve conter: nome completo, foto recente, data de nascimento, CPF, instituição de ensino,
                    nível de educação e data de validade
                  </li>
                  <li>
                    <strong>Carteira de Identificação Estudantil digital</strong> disponível em aplicativo com
                    certificação digital
                  </li>
                  <li>
                    Alternativamente: documento de identificação estudantil emitido pela instituição de ensino ou
                    comprovante de matrícula acompanhado de documento oficial com foto
                  </li>
                </ul>

                <h4 className="font-semibold">3.2 Para Idosos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Documento oficial de identidade original com foto que comprove a idade igual ou superior a 60 anos
                  </li>
                  <li>São aceitos: RG, CNH, Passaporte, Carteira de Trabalho ou outro documento oficial com foto</li>
                </ul>

                <h4 className="font-semibold">3.3 Para Pessoas com Deficiência</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cartão de Benefício de Prestação Continuada da Assistência Social (BPC)</li>
                  <li>Carteira de Identificação da Pessoa com Deficiência emitida por órgão competente</li>
                  <li>
                    Laudo médico que indique o CID (Classificação Internacional de Doença) e ateste a deficiência,
                    acompanhado de documento de identidade com foto
                  </li>
                  <li>
                    Para o acompanhante: comprovação da necessidade de acompanhamento por meio de laudo médico ou na
                    própria carteira de identificação da pessoa com deficiência
                  </li>
                </ul>

                <h4 className="font-semibold">3.4 Para Jovens de Baixa Renda</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Carteira de Identidade Jovem (ID Jovem) emitida pela Secretaria Nacional da Juventude, acompanhada
                    de documento de identificação com foto
                  </li>
                  <li>A ID Jovem pode ser apresentada em formato digital através do aplicativo oficial</li>
                </ul>

                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 mt-3">
                  <p className="text-sm">
                    <strong>Atenção:</strong> A documentação deve estar dentro do prazo de validade no momento da compra
                    e também na entrada do evento. Documentos vencidos não serão aceitos.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<BadgePercent className="text-[#02488C]" size={20} />} title="4. Limites e Restrições">
              <div className="space-y-3">
                <h4 className="font-semibold">4.1 Limite de Ingressos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    A lei estabelece que 40% (quarenta por cento) do total de ingressos disponíveis para cada evento
                    devem ser oferecidos com o benefício da meia-entrada
                  </li>
                  <li>
                    Este limite aplica-se ao total de ingressos disponíveis para cada evento, sessão ou espetáculo, em
                    todos os locais e áreas de venda
                  </li>
                  <li>
                    O limite não se aplica aos beneficiários idosos e pessoas com deficiência, que têm direito à
                    meia-entrada independentemente da cota
                  </li>
                </ul>

                <h4 className="font-semibold">4.2 Distribuição dos Ingressos</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Os ingressos de meia-entrada devem ser distribuídos proporcionalmente por todos os setores, áreas e
                    categorias de ingressos disponíveis
                  </li>
                  <li>
                    A disponibilidade deve ser garantida em todos os pontos de venda, incluindo bilheterias físicas e
                    plataformas online
                  </li>
                  <li>
                    Quando esgotada a cota de 40%, não é mais obrigatória a venda de meia-entrada para estudantes e
                    jovens de baixa renda
                  </li>
                </ul>

                <h4 className="font-semibold">4.3 Restrições</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>O benefício é pessoal e intransferível</li>
                  <li>
                    Cada beneficiário tem direito a adquirir apenas 1 (um) ingresso de meia-entrada por evento, exceto
                    em casos específicos previstos em legislação local
                  </li>
                  <li>O benefício não é cumulativo com outras promoções ou descontos (prevalece o maior desconto)</li>
                  <li>
                    Não se aplica a eventos beneficentes cujo total da renda seja revertido para entidades sem fins
                    lucrativos
                  </li>
                </ul>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mt-3">
                  <p className="text-sm">
                    <strong>Esclarecimento:</strong> O limite de 40% é calculado sobre o total de ingressos disponíveis
                    para venda ao público em geral, não incluindo cortesias, camarotes e áreas VIP com acesso restrito.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<Ticket className="text-[#02488C]" size={20} />} title="5. Procedimentos de Venda">
              <div className="space-y-3">
                <h4 className="font-semibold">5.1 Na Compra Online</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Ao selecionar a opção de meia-entrada, o comprador deve indicar a categoria do benefício (estudante,
                    idoso, PcD ou jovem de baixa renda)
                  </li>
                  <li>
                    O sistema informará claramente que a documentação comprobatória será exigida na entrada do evento
                  </li>
                  <li>
                    O comprador receberá informações detalhadas sobre quais documentos são aceitos para comprovar o
                    benefício
                  </li>
                  <li>
                    O ingresso de meia-entrada conterá indicação clara da categoria do benefício e da necessidade de
                    apresentação da documentação
                  </li>
                </ul>

                <h4 className="font-semibold">5.2 Nas Bilheterias Físicas</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>A documentação comprobatória deve ser apresentada no momento da compra do ingresso</li>
                  <li>O atendente verificará a validade do documento e a elegibilidade do beneficiário</li>
                  <li>Será registrado no sistema o tipo de benefício concedido e o documento apresentado</li>
                  <li>O ingresso emitido conterá indicação da categoria do benefício</li>
                </ul>

                <h4 className="font-semibold">5.3 Controle da Cota</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>O sistema de vendas monitora em tempo real a quantidade de ingressos de meia-entrada vendidos</li>
                  <li>
                    Quando atingido o limite de 40%, o sistema automaticamente bloqueia a venda de meia-entrada para
                    estudantes e jovens de baixa renda
                  </li>
                  <li>
                    A venda de meia-entrada para idosos e pessoas com deficiência continua disponível mesmo após o
                    esgotamento da cota
                  </li>
                  <li>
                    Informações sobre a disponibilidade de ingressos de meia-entrada são atualizadas em tempo real em
                    todos os canais de venda
                  </li>
                </ul>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-3">
                  <p className="text-sm">
                    <strong>Dica:</strong> Recomendamos a compra antecipada de ingressos de meia-entrada, pois a cota
                    pode se esgotar rapidamente para eventos de grande procura.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<Search className="text-[#02488C]" size={20} />} title="6. Verificação na Entrada">
              <div className="space-y-3">
                <h4 className="font-semibold">6.1 Procedimento de Verificação</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Na entrada do evento, todos os portadores de ingressos de meia-entrada devem apresentar a
                    documentação comprobatória do benefício
                  </li>
                  <li>
                    A verificação será realizada por equipe treinada, que conferirá a validade e autenticidade dos
                    documentos
                  </li>
                  <li>O documento apresentado deve ser o mesmo indicado no momento da compra (quando aplicável)</li>
                  <li>A foto do documento será comparada com o portador para confirmar a identidade</li>
                </ul>

                <h4 className="font-semibold">6.2 Recusa de Entrada</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>O acesso será negado caso o portador não apresente a documentação adequada ou válida</li>
                  <li>Não será permitida a entrada com ingresso de meia-entrada sem a comprovação do benefício</li>
                  <li>
                    Em caso de recusa, o portador poderá, a critério do organizador:
                    <ul className="list-disc pl-6 mt-1">
                      <li>Pagar a diferença para o valor integral (quando disponível)</li>
                      <li>Não ter acesso ao evento, sem direito a reembolso</li>
                    </ul>
                  </li>
                </ul>

                <h4 className="font-semibold">6.3 Registro e Controle</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Será mantido registro da quantidade de beneficiários por categoria que efetivamente acessaram o
                    evento
                  </li>
                  <li>Estes dados serão utilizados para fins estatísticos e de fiscalização</li>
                  <li>O controle ajuda a prevenir fraudes e garantir o correto cumprimento da legislação</li>
                </ul>

                <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 mt-3">
                  <p className="text-sm">
                    <strong>Atenção:</strong> Apresentar-se com documentação falsa ou utilizar indevidamente o benefício
                    da meia-entrada pode configurar crime de falsidade ideológica, sujeito às penalidades previstas no
                    Código Penal.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<Scale className="text-[#02488C]" size={20} />} title="7. Obrigações dos Organizadores">
              <div className="space-y-3">
                <h4 className="font-semibold">7.1 Divulgação de Informações</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Informar de forma clara e visível, em todos os materiais de divulgação do evento, os valores dos
                    ingressos e o direito à meia-entrada
                  </li>
                  <li>
                    Divulgar em local visível da bilheteria e nos canais de venda a cota de ingressos disponíveis para
                    meia-entrada
                  </li>
                  <li>Informar os documentos necessários para comprovação do benefício</li>
                  <li>Comunicar quando a cota de 40% for esgotada</li>
                </ul>

                <h4 className="font-semibold">7.2 Controle e Relatórios</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Manter controle do número de ingressos de meia-entrada vendidos, por categoria de beneficiário
                  </li>
                  <li>
                    Garantir que a cota de 40% seja distribuída proporcionalmente em todos os setores e categorias de
                    ingressos
                  </li>
                  <li>
                    Disponibilizar, quando solicitado pelos órgãos fiscalizadores, relatórios de venda de ingressos
                  </li>
                  <li>Preservar os registros de venda por pelo menos 30 dias após a realização do evento</li>
                </ul>

                <h4 className="font-semibold">7.3 Treinamento de Equipe</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Treinar adequadamente as equipes de bilheteria e controle de acesso sobre as regras de meia-entrada
                  </li>
                  <li>Capacitar os funcionários para identificar documentos válidos e verificar sua autenticidade</li>
                  <li>Orientar sobre o tratamento respeitoso e não discriminatório aos beneficiários</li>
                  <li>Estabelecer procedimentos claros para resolução de conflitos relacionados à meia-entrada</li>
                </ul>
              </div>
            </RuleSection>

            <RuleSection
              icon={<AlertCircle className="text-[#02488C]" size={20} />}
              title="8. Fiscalização e Penalidades"
            >
              <div className="space-y-3">
                <h4 className="font-semibold">8.1 Órgãos Fiscalizadores</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    A fiscalização do cumprimento da Lei da Meia-Entrada é realizada pelos órgãos de proteção e defesa
                    do consumidor
                  </li>
                  <li>PROCON (Programa de Proteção e Defesa do Consumidor)</li>
                  <li>Ministério Público</li>
                  <li>Secretarias estaduais e municipais de cultura, quando aplicável</li>
                </ul>

                <h4 className="font-semibold">8.2 Infrações e Penalidades</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    O descumprimento das normas sobre meia-entrada sujeita os infratores às sanções previstas no Código
                    de Defesa do Consumidor (Lei nº 8.078/1990)
                  </li>
                  <li>Multas que podem variar de acordo com a gravidade da infração e o porte do evento</li>
                  <li>Suspensão temporária da atividade</li>
                  <li>Cassação de licença de funcionamento</li>
                  <li>Interdição do estabelecimento ou evento</li>
                </ul>

                <h4 className="font-semibold">8.3 Denúncias</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Beneficiários que tiverem seu direito à meia-entrada negado indevidamente podem registrar denúncia
                    nos órgãos de defesa do consumidor
                  </li>
                  <li>As denúncias podem ser feitas através dos canais oficiais do PROCON</li>
                  <li>É recomendável documentar a situação com fotos, vídeos ou testemunhas</li>
                  <li>Nossa plataforma disponibiliza canal específico para denúncias relacionadas à meia-entrada</li>
                </ul>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mt-3">
                  <p className="text-sm">
                    <strong>Compromisso:</strong> Nossa plataforma está comprometida com o cumprimento integral da
                    legislação de meia-entrada e colabora ativamente com os órgãos fiscalizadores.
                  </p>
                </div>
              </div>
            </RuleSection>

            <RuleSection icon={<GraduationCap className="text-[#02488C]" size={20} />} title="9. Casos Especiais">
              <div className="space-y-3">
                <h4 className="font-semibold">9.1 Eventos com Patrocínio Público</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Eventos que recebem recursos públicos ou incentivos fiscais podem ter regras específicas quanto à
                    meia-entrada
                  </li>
                  <li>Em alguns casos, a cota de meia-entrada pode ser superior a 40%</li>
                  <li>
                    Eventos realizados em equipamentos públicos (teatros, centros culturais) podem ter políticas
                    próprias
                  </li>
                </ul>

                <h4 className="font-semibold">9.2 Eventos Beneficentes</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Eventos beneficentes cujo total da renda seja revertido para entidades sem fins lucrativos podem ser
                    isentos da obrigatoriedade da meia-entrada
                  </li>
                  <li>Esta isenção deve ser claramente informada em todo material de divulgação</li>
                  <li>É necessária documentação comprobatória da natureza beneficente do evento</li>
                </ul>

                <h4 className="font-semibold">9.3 Eventos Gratuitos com Áreas VIP</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Em eventos gratuitos que possuam áreas VIP ou setores pagos, a meia-entrada aplica-se a estes
                    setores
                  </li>
                  <li>A cota de 40% é calculada sobre o total de ingressos disponíveis para estas áreas</li>
                </ul>

                <h4 className="font-semibold">9.4 Eventos com Ingressos Promocionais</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Quando o evento oferece ingressos promocionais com valor igual ou inferior à meia-entrada, prevalece
                    o menor valor
                  </li>
                  <li>Nestes casos, o beneficiário não pode exigir desconto adicional sobre o valor promocional</li>
                  <li>A promoção não substitui a obrigatoriedade da cota de meia-entrada</li>
                </ul>
              </div>
            </RuleSection>

            <RuleSection icon={<HelpCircle className="text-[#02488C]" size={20} />} title="10. Perguntas Frequentes">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">
                    10.1 Posso comprar mais de um ingresso de meia-entrada com minha carteira de estudante?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Não. O benefício da meia-entrada é pessoal e intransferível. Cada beneficiário tem direito a apenas
                    um ingresso de meia-entrada por evento, e deverá estar presente na entrada do evento com a
                    documentação comprobatória.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">
                    10.2 O que acontece se eu comprar um ingresso de meia-entrada online e não apresentar a documentação
                    na entrada?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Sem a apresentação da documentação válida, você não terá acesso ao evento. Dependendo da política do
                    organizador, poderá ser oferecida a opção de pagar a diferença para o valor integral (se houver
                    disponibilidade) ou você perderá o direito de acesso, sem reembolso.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">
                    10.3 Minha carteira de estudante está em processo de renovação. Posso usar o comprovante de
                    matrícula?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Sim. Na ausência da Carteira de Identificação Estudantil, você pode apresentar o comprovante de
                    matrícula do semestre vigente acompanhado de documento oficial com foto. Alguns eventos podem ter
                    regras específicas, então recomendamos verificar antecipadamente.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">10.4 Sou professor. Tenho direito à meia-entrada?</h4>
                  <p className="text-sm text-gray-700">
                    A legislação federal não inclui professores entre os beneficiários da meia-entrada. No entanto,
                    alguns estados e municípios possuem leis específicas que concedem este benefício a professores.
                    Verifique a legislação local aplicável ao evento.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">
                    10.5 O evento que quero ir anunciou que esgotou a cota de meia-entrada, mas sou idoso. Ainda tenho
                    direito?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Sim. Idosos (pessoas com 60 anos ou mais) e pessoas com deficiência não estão sujeitos ao limite de
                    40% da cota de meia-entrada. Estes beneficiários têm direito à meia-entrada mesmo após o esgotamento
                    da cota geral.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">
                    10.6 O ingresso promocional está mais barato que a meia-entrada. Qual devo comprar?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Recomendamos comprar o ingresso com menor valor. Quando há promoções com preços inferiores à
                    meia-entrada, não é possível solicitar desconto adicional sobre o valor promocional. O benefício da
                    meia-entrada não é cumulativo com outras promoções.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-4">
                  <p className="text-sm">
                    <strong>Ainda tem dúvidas?</strong> Entre em contato com nosso suporte através do e-mail
                    suporte@empresa.com ou pelo telefone (11) 1234-5678.
                  </p>
                </div>
              </div>
            </RuleSection>
          </div>

          <Separator className="my-8" />

          {/* Footer da página */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 mb-4">
              Estamos comprometidos em garantir o acesso à cultura e ao entretenimento, respeitando os direitos dos
              beneficiários da meia-entrada conforme a legislação vigente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.history.back()} className="cursor-pointer">
                Voltar
              </Button>
              <Button
                onClick={() => (window.location.href = "/obrigatoriedades-legais")}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                Ver Obrigatoriedades Legais
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
