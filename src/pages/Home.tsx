import Header from "@/components/header"
import CarrosselMain  from '../components/carrosselMain'
import Category  from '../components/category'
import EventGrid from "../components/event-grid";
import AdBanner from "../components/adBanner";
import Footer from "../components/footer"

export default function Home() {
    return (
      <>
        <Header />
        <main className="pt-[60px] sm:pt-[230px]">
        <CarrosselMain />
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
    )
  }
  