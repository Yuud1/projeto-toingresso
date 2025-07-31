import Header from "@/components/Header";
import CarrosselMain from "../components/CarrosselMain";
import Category from "../components/Category";
import EventGrid from "../components/Event-grid";
import AdBanner from "../components/AdBanner";
import Footer from "../components/Footer";
import CreateEventCTA from "../components/CreateEventCTA";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <>
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
    </>
  );
}
