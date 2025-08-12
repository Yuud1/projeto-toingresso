"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import axios from "axios";

interface Banner {
  _id?: string;
  urlImage?: string;
  title?: string;
  redirectUrl?: string;
}

const AdBanner: React.FC = () => {
  const [banner, setBanner] = React.useState<Banner[]>([]);

  React.useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_BANNER_GET}`
      )
      .then((res) => {        
        if (res.data.banners && res.data.banners.length > 0) {
          setBanner(res.data.banners);
        }
      })
      .catch((err) => console.error("Erro ao buscar banner:", err));
  }, []);

  if (!banner || banner.length === 0) return null;

  const bannersToShow = banner.slice(0, 2);
  const hasOnlyOneBanner = bannersToShow.length === 1;

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="max-w-7xl mx-auto pt-10 px-0 sm:px-4 lg:px-8 w-full h-fit relative z-10">
        <div className="mb-20">
          <div className="w-full flex flex-row justify-between items-center mb-10">
          </div>

          <div className={`${hasOnlyOneBanner ? 'sm:m-6 lg:m-10' : 'grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8'}`}>
            {bannersToShow.map((b, idx) => (
              <a
                key={b._id || idx}
                href={b.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-none md:rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 w-full"
              >
                <div className="relative overflow-hidden rounded-t-none md:rounded-t-lg">
                  <img
                    src={b.urlImage || "/placeholder.svg"}
                    alt={b.title || "Banner promocional"}
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-none md:rounded-t-lg"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        {b.title}
                      </h3>
                      <div className="flex items-center group/button justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-colors duration-300">
                        <span className="font-semibold">Clique para acessar</span>
                        <ExternalLink className="w-5 h-5 group-hover/button:rotate-12 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsored badge */}
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  Patrocinado
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h4 className="text-white font-bold text-lg mb-1">{b.title}</h4>
                  <p className="text-white/80 text-sm">
                    Oferta especial por tempo limitado
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
