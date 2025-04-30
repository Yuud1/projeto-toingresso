import Header from "@/components/header"
import CarrosselMain  from '../components/carrosselMain'
import Category  from '../components/category'
import EventGrid from "../components/event-grid";
import Footer from "../components/footer"

export default function Home() {
    return (
      <>
        <Header />
        <main className="pt-[60px] sm:pt-[230px]">
        <CarrosselMain />
          <div className="max-w-full">
          <section className="h-full bg-[#FEC800]">
            <div className="max-w-7xl mx-auto px-14">
              <Category />
              <EventGrid />
            </div>
          </section>
          </div>
          <Footer />
        </main>
      </>
    )
  }
  