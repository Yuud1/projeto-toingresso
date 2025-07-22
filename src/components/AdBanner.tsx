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
        console.log('BANNERS:', res.data.banners);
        if (res.data.banners && res.data.banners.length > 0) {
          setBanner(res.data.banners);
        }
      })
      .catch((err) => console.error("Erro ao buscar banner:", err));
  }, []);

  if (!banner) return null;

  // Se banners for array, renderize os dois primeiros
  const bannersToShow = banner.slice(0, 2);

  return (
    <div className="w-full max-w-full md:max-w-[85%] mx-0 md:mx-auto">
      <div className="w-full mb-8 px-4 md:px-0">
        <h1 className="text-black text-2xl font-bold text-center md:text-left">
          Recomendações Semanais
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {bannersToShow.map((b, idx) => (
          <a
            key={b._id || idx}
            href={b.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-1/2 border-0 md:border md:border-gray-200 rounded-none md:rounded-md bg-white overflow-hidden shadow-none md:shadow-sm flex flex-col group relative hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <img
                src={b.urlImage || "/placeholder.svg"}
                alt={b.title || "Banner promocional"}
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{b.title}</h3>
                  <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-medium">Clique para acessar</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Patrocinado
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdBanner;
