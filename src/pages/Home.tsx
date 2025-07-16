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
        <div className="w-full flex justify-center mt-12 mb-8 sm:mt-0">
          <CarrosselMain />
        </div>
        <div className="max-w-full">
          <section className="h-full w-full">
            <div className=" max-w-full mx-auto w-full flex flex-col items-center justify-center gap-25">
              <div className="w-full bg-[#FEC800] ">
                <EventGrid />
              </div>
              <div className=" w-3/4">
                <AdBanner />
              </div>
              <div className="w-full bg-[#014A8E] mb-30">
                <Category />
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
