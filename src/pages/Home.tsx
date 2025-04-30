import Header from "@/components/header"
import CarrosselMain  from '../components/carrosselMain'
import Category  from '../components/category'
import Footer from "../components/footer"

export default function Home() {
    return (
      <>
        <Header />
        <main className="pt-[230px] ">
        <CarrosselMain />
          <div className="max-w-full">
          <section className="h-[1200px] bg-[#FEC800]">
            <div className="max-w-7xl mx-auto px-14">
              <Category />
              <h1 className="text-[#414141] text-2xl font-bold mb-8 pt-8">Página Inicial</h1>
              <p className="text-muted-foreground">
                Role a página para ver o comportamento do header com sticky e transições.
              </p>
            </div>
          </section>
          </div>
          <Footer />
        </main>
      </>
    )
  }
  