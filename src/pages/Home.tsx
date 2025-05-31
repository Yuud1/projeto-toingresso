import Header from "@/components/header";
import CarrosselMain from "../components/carrosselMain";
import Category from "../components/category";
import EventGrid from "../components/event-grid";
import AdBanner from "../components/adBanner";
import Footer from "../components/footer";
import { useUser } from "@/contexts/useContext";

export default function Home() {
  const {isLoading} = useUser()

  if (isLoading) {
    return null;
  }
  
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
              <Category />
              <AdBanner />
              <EventGrid />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
