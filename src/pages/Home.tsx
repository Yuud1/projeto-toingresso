import { useEffect } from "react";
import Header from "@/components/Header";
import CarrosselMain from "../components/CarrosselMain";
import Category from "../components/Category";
import EventGrid from "../components/Event-grid";
import AdBanner from "../components/AdBanner";
import Footer from "../components/Footer";
import CreateEventCTA from "../components/CreateEventCTA";
import ToastContainer from "@/components/ui/toast-container";
import { ArrowDown } from "lucide-react";
import { useUser } from "@/contexts/useContext";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isLoading } = useUser();
  const { toasts, showSuccess } = useToast();

  useEffect(() => {
    // Verifica se o usuário está logado, não está carregando e se é a primeira vez na sessão
    if (user && !isLoading && !sessionStorage.getItem("welcomeShown")) {
      // Pequeno delay para garantir que a página carregou completamente
      const timer = setTimeout(() => {
        const currentHour = new Date().getHours();
        let greeting = "Bem-vindo";
        
        if (currentHour < 12) {
          greeting = "Bom dia";
        } else if (currentHour < 18) {
          greeting = "Boa tarde";
        } else {
          greeting = "Boa noite";
        }

        // Personaliza a mensagem baseada no perfil do usuário
        let message = "Que tal descobrir alguns eventos incríveis hoje?";
        
        if (user.likedEvents && user.likedEvents.length > 0) {
          message = `Você tem ${user.likedEvents.length} evento${user.likedEvents.length > 1 ? 's' : ''} favorito${user.likedEvents.length > 1 ? 's' : ''}! Que tal dar uma olhada?`;
        } else if (user.tickets && user.tickets.length > 0) {
          message = `Você tem ${user.tickets.length} ingresso${user.tickets.length > 1 ? 's' : ''}! Que tal verificar seus eventos?`;
        }

        showSuccess(
          `${greeting}, ${user.name}! 👋`,
          message,
          5000
        );

        // Marca que o toast de boas-vindas já foi mostrado nesta sessão
        sessionStorage.setItem("welcomeShown", "true");
      }, 1000); // 1 segundo de delay

      return () => {
        clearTimeout(timer);
      };
    }
  }, [user, isLoading, showSuccess]);

  return (
    <>
      <div>
        <Header />
        <main className="pt-[60px] sm:pt-[10em]">
          {/* Hero Carousel Section */}
          <div className="w-full flex justify-center mt-12 sm:mt-0">
            <CarrosselMain />
          </div>
          <div className="max-w-full mx-auto w-full flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Descubra mais Eventos
              </h2>
              <div className="w-24 h-1 bg-[#FDC901] rounded-full mx-auto"></div>
            </div>
            <div className="animate-bounce mt-10">
              <ArrowDown className="w-8 h-8 text-black mb-5" />
            </div>
          </div>
          {/* Main Content */}
          <div className="max-w-full">
            <section className="h-full w-full">
              <div className="max-w-full mx-auto w-full flex flex-col items-center justify-center">
                {/* Featured Event Grid */}
                <div className="w-full fade-in-40 transition-all">
                  <EventGrid />
                </div>

                {/* Ad Banner Section */}
                <div className="w-full bg-red-500 bg-gradient-to-b from-gray-50 to-white">
                  <AdBanner />
                </div>

                {/* Categories Section */}
                <div className="w-full">
                  <Category />
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <CreateEventCTA />

          {/* Footer */}
          <Footer />
        </main>
        
        {/* Toast Container */}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}
