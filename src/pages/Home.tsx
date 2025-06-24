import Header from "@/components/Header";
import CarrosselMain from "../components/CarrosselMain";
import Category from "../components/Category";
import EventGrid from "../components/Event-grid";
import AdBanner from "../components/AdBanner";
import Footer from "../components/Footer";

export default function Home() {
  
  return (
    <>
      <Header />
      <main className="pt-[60px] sm:pt-[230px]">
        <div className="mt-12 mb-8 sm:mt-0">
          <CarrosselMain />
        </div>
        <div className="max-w-full">
          <section className="h-full bg-[#FEC800]">
            <div className="max-w-7xl mx-auto px-8">
              <EventGrid />
              <AdBanner />
              <Category />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
