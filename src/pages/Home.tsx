import Header from "@/components/Header";
import CarrosselMain from "../components/CarrosselMain";
import Category from "../components/Category";
import EventGrid from "../components/Event-grid";
import AdBanner from "../components/AdBanner";
import Footer from "../components/Footer";
import CreateEventCTA from "../components/CreateEventCTA";

export default function Home() {

  return (
    <>
      <Header />
      <main className="pt-[60px] sm:pt-[230px]">
        <div className="w-full flex justify-center mt-12 mb-8 sm:mt-0">
          <CarrosselMain />
        </div>
        <div className="max-w-full">
          <section className="h-full w-full">
            <div className="max-w-full mx-auto w-full flex flex-col items-center justify-center gap-25">
              <div className="w-full">
                <EventGrid />
              </div>
              <div className="w-full">
                <AdBanner />
              </div>
              <div className="w-full bg-[#02488C]">
                <Category />
              </div>
            </div>
          </section>
        </div>
        <CreateEventCTA />
        <Footer />
      </main>
    </>
  );
}
