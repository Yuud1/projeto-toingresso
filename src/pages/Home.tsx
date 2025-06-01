import Header from "@/components/Header";
import CarrosselMain from "../components/CarrosselMain";
import Category from "../components/Category";
import EventGrid from "../components/Event-grid";
import AdBanner from "../components/AdBanner";
import Footer from "../components/Footer";
import { useUser } from "@/contexts/useContext";
import LoadingPage from "./loadingPage";

export default function Home() {
  const {isLoading} = useUser()

  if (isLoading) {
    return <LoadingPage/>;
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
