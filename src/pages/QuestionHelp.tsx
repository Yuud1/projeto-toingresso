import { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Home,
  ThumbsUp,
  ThumbsDown,
  Ticket,
  Globe,
  RefreshCw,
  User,
} from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import { FeedbackForm } from "../components/feedback-form";
import { FAQStats } from "../components/faq-stats";
import { PopularCategories } from "../components/popular-categories";
import {
  getStats,
  recordQuestionView,
  recordFeedback,
  getPopularCategories,
} from "../lib/faq-stats";

const faqs = [
  {
    category: "Ingressos e Compras",
    questions: [
      {
        question: "Posso comprar meia-entrada?",
        answer:
          "Sim, desde que você atenda aos critérios legais de meia-entrada e apresente documentação válida no evento. Os documentos aceitos incluem carteira de estudante, carteira de idoso, carteira de pessoa com deficiência, entre outros definidos por lei.",
      },
      {
        question:
          "Por que minha compra paga com cartão de crédito não foi aprovada?",
        answer:
          "Isso pode acontecer por diversos motivos, como falta de saldo, dados incorretos ou bloqueio pela operadora. Verifique com seu banco ou tente os seguintes passos: 1) Confirme se os dados do cartão estão corretos; 2) Verifique se há limite disponível; 3) Tente outro cartão se possível.",
      },
      {
        question: "Como faço para cancelar meu ingresso?",
        answer:
          "Você pode solicitar o cancelamento até 7 dias após a compra, desde que o evento ainda não tenha ocorrido. Para isso, acesse 'Meus Ingressos', selecione o ingresso que deseja cancelar e clique em 'Solicitar Cancelamento'. O reembolso será processado em até 30 dias.",
      },
      {
        question: "Quanto tempo leva para receber o reembolso?",
        answer:
          "O prazo de reembolso varia de acordo com a forma de pagamento: Cartão de crédito: até 2 faturas; PIX: até 3 dias úteis; Boleto: até 7 dias úteis após a compensação bancária.",
      },
    ],
  },
  {
    category: "Eventos Online",
    questions: [
      {
        question: "Como posso acessar um evento online?",
        answer:
          "O link de acesso estará disponível em seu e-mail e também na sua conta na plataforma, na seção 'Meus ingressos'. Recomendamos acessar com 30 minutos de antecedência para testar sua conexão.",
      },
      {
        question:
          "O que fazer se tiver problemas técnicos durante o evento online?",
        answer:
          "Em caso de problemas técnicos: 1) Verifique sua conexão com a internet; 2) Atualize a página; 3) Tente usar outro navegador; 4) Entre em contato com nosso suporte técnico através do chat disponível durante o evento.",
      },
    ],
  },
  {
    category: "Reembolsos e Problemas",
    questions: [
      {
        question: "Por que não consegui solicitar meu reembolso?",
        answer:
          "O prazo para solicitação de reembolso pode ter expirado ou o ingresso pode não ser reembolsável, conforme política do evento. Verifique os termos e condições específicos do evento em sua página de detalhes.",
      },
      {
        question: "O que acontece se o evento for cancelado?",
        answer:
          "Em caso de cancelamento do evento, todos os compradores serão notificados por email e o reembolso será processado automaticamente. Não é necessário solicitar o cancelamento neste caso.",
      },
    ],
  },
  {
    category: "Conta e Perfil",
    questions: [
      {
        question: "Como altero meus dados cadastrais?",
        answer:
          "Acesse seu perfil clicando no ícone de usuário no topo da página, selecione 'Minha Conta' e clique em 'Editar Perfil'. Lá você poderá atualizar seus dados pessoais.",
      },
      {
        question: "Esqueci minha senha, como recupero?",
        answer:
          "Na tela de login, clique em 'Esqueci minha senha'. Digite seu e-mail cadastrado e siga as instruções enviadas para sua caixa de entrada para criar uma nova senha.",
      },
    ],
  },
];

export default function QuestionHelp() {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [stats, setStats] = useState(getStats());
  const [popularCategories, setPopularCategories] = useState<
    Array<{
      category: string;
      views: number;
      helpfulResponses: number;
    }>
  >([]);

  // Atualizar estatísticas quando o componente montar
  useEffect(() => {
    const categories = faqs.map((cat) => cat.category);
    setPopularCategories(getPopularCategories(categories));
  }, []);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    if (openQuestion !== key) {
      // Registra visualização quando uma pergunta é aberta
      recordQuestionView(faqs[categoryIndex].category);
      setStats(getStats());
    }
    setOpenQuestion(openQuestion === key ? null : key);
  };

  const handleFeedback = (category: string, isHelpful: boolean) => {
    recordFeedback(category, isHelpful);
    setStats(getStats());
    setShowFeedback(false);
  };

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  // Atualizar meta tags quando o componente montar
  useEffect(() => {
    //   Atualizar título
    document.title = "Central de Ajuda - TOingresso";

    //   Atualizar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "Tire suas dúvidas sobre ingressos, eventos online, reembolsos e mais no TOingresso. Encontre respostas rápidas e precisas para suas perguntas."
    );

    //   Atualizar meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "ajuda, suporte, ingressos, eventos, reembolso, TOingresso"
    );
  }, []);

  return (
    <>
      <Header isScrolled={true} />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center text-sm mb-6">
            <a
              href="/"
              className="flex items-center text-gray-500 hover:text-[#02488C]"
            >
              <Home size={16} className="mr-1" />
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-[#02488C]">Central de Ajuda</span>
          </nav>

          <FAQStats
            totalQuestions={faqs.reduce(
              (acc, cat) => acc + cat.questions.length,
              0
            )}
            totalViews={stats.totalViews}
            helpfulResponses={stats.helpfulResponses}
          />

          <PopularCategories
            categories={popularCategories.map((cat) => ({
              icon: getCategoryIcon(cat.category),
              label: cat.category,
              count: cat.views,
            }))}
          />

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#414141] mb-6">
              Participante, como podemos te ajudar?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Digite aqui o que você procura"
                className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-200 outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setIsSearching(true);
                  setSearchTerm(e.target.value);
                  setTimeout(() => setIsSearching(false), 300);
                }}
                aria-label="Buscar perguntas"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#02488C] border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left bg-[#e2f0ff] hover:bg-[#d5e7fc] transition-colors"
                  onClick={() => toggleCategory(categoryIndex)}
                  aria-expanded={openCategory === categoryIndex}
                  aria-controls={`category-${categoryIndex}`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#02488C]">
                      {category.category}
                    </h2>
                    <ChevronDown
                      className={`transition-transform duration-300 text-[#02488C] ${
                        openCategory === categoryIndex
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {openCategory === categoryIndex && (
                  <div
                    id={`category-${categoryIndex}`}
                    className="divide-y divide-gray-100"
                    role="region"
                    aria-label={`Perguntas sobre ${category.category}`}
                  >
                    {category.questions.map((faq, questionIndex) => (
                      <div key={questionIndex} className="cursor-pointer">
                        <div
                          className="px-6 py-4 hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            toggleQuestion(categoryIndex, questionIndex)
                          }
                          role="button"
                          aria-expanded={
                            openQuestion === `${categoryIndex}-${questionIndex}`
                          }
                          aria-controls={`question-${categoryIndex}-${questionIndex}`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-md font-medium text-[#414141]">
                              {faq.question}
                            </h3>
                            <ChevronDown
                              className={`transition-transform duration-300 text-gray-400 ${
                                openQuestion ===
                                `${categoryIndex}-${questionIndex}`
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            />
                          </div>
                        </div>

                        {openQuestion ===
                          `${categoryIndex}-${questionIndex}` && (
                          <div
                            id={`question-${categoryIndex}-${questionIndex}`}
                            className="px-6 pb-4 text-sm text-gray-600"
                          >
                            <p className="mb-4">{faq.answer}</p>

                            <div className="flex items-center space-x-3">
                              <span className="text-gray-500">
                                Essa resposta foi útil?
                              </span>
                              <button
                                className="text-green-600 hover:text-green-800"
                                onClick={() => {
                                  setSelectedQuestion(faq.question);
                                  setShowFeedback(true);
                                  handleFeedback(category.category, true);
                                }}
                              >
                                <ThumbsUp size={18} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setSelectedQuestion(faq.question);
                                  setShowFeedback(true);
                                  handleFeedback(category.category, false);
                                }}
                              >
                                <ThumbsDown size={18} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {showFeedback && (
            <FeedbackForm
              question={selectedQuestion}
              onClose={() => setShowFeedback(false)}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Ingressos e Compras":
      return <Ticket size={20} />;
    case "Eventos Online":
      return <Globe size={20} />;
    case "Reembolsos e Problemas":
      return <RefreshCw size={20} />;
    case "Conta e Perfil":
      return <User size={20} />;
    default:
      return <Ticket size={20} />;
  }
}
