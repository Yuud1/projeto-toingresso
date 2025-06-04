import type React from "react"
import { ExternalLink } from "lucide-react"

const AdBanner: React.FC = () => {
  const banner = {
    image: "https://picsum.photos/1200/300",
    link: "https://seusite.com/promo",
    title: "Promoção Especial",
    description: "Não perca esta oportunidade única!",
  }

  return (
    <div className="w-full">
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="relative">
          <img
            src={banner.image || "/placeholder.svg"}
            alt="Banner promocional"
            className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
              <p className="text-lg mb-4">{banner.description}</p>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-medium">Clique para acessar</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Corner Badge */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Patrocinado
        </div>
      </a>
    </div>
  )
}

export default AdBanner
