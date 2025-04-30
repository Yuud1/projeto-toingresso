import Header from "@/components/header"

export default function Home() {
    return (
      <>
        <Header />
        <main className="pt-[230px] px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <section className="h-[1200px] bg-gray-100 rounded-xl p-6">
              <h1 className="text-3xl font-bold mb-4">Página Inicial</h1>
              <p className="text-muted-foreground">
                Role a página para ver o comportamento do header com sticky e transições.
              </p>
            </section>
          </div>
        </main>
      </>
    )
  }
  