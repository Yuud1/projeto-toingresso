import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const scrollToFilterGrid = (event: React.MouseEvent, category?: string) => {
    event.preventDefault();
    const filterGridElement = document.getElementById('filter-grid');

    if (filterGridElement) {
      if (category) {
        console.log(`Filtrar por: ${category}`);
      }

      filterGridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#414141] text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">
        {/* Logo e descrição */}
        <div>
          <img src="/logo-branca.png" alt="Logo" className="w-28 mx-auto sm:mx-0 mb-8 sm:mb-3" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Descubra, participe e aproveite os melhores eventos da sua cidade.
          </p>
        </div>

        {/* Links úteis */}
        <div>
          <h3 className="text-base font-semibold mb-3">Eventos</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a
                href="#festas-shows"
                className="hover:underline"
                onClick={(e) => scrollToFilterGrid(e, 'Festas & Shows')}
              >
                Festas & Shows
              </a>
            </li>
            <li>
              <a
                href="#stand-up"
                className="hover:underline"
                onClick={(e) => scrollToFilterGrid(e, 'Stand-up Comedy')}
              >
                Stand-up Comedy
              </a>
            </li>
            <li>
              <a
                href="#esportes"
                className="hover:underline"
                onClick={(e) => scrollToFilterGrid(e, 'Esportes')}
              >
                Esportes
              </a>
            </li>
          </ul>
        </div>

        {/* Conta */}
        <div>
          <h3 className="text-base font-semibold mb-3">Minha Conta</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/meus-ingressos" className="hover:underline">Meus ingressos</a></li>
            <li><a href="#" className="hover:underline">Meus eventos</a></li>
            <li><a href="/criar-evento" className="hover:underline">Criar evento</a></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-base font-semibold mb-3">Fale Conosco</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: contato@dasilva.com</li>
            <li>Telefone: (11) 99999-9999</li>
            <li><a href="/question-help" className="hover:underline">Ajuda & Suporte</a></li>
          </ul>
        </div>
      </div>

      {/* Linha inferior com termos e redes sociais */}
{/* Linha inferior com termos e redes sociais */}
<div className="mt-10 border-t border-gray-600 pt-6 px-4 sm:px-6 md:px-12 lg:px-20 text-sm text-gray-400">
  <div className="flex flex-col items-center md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
    
    {/* Termos e links */}
    <ul className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-gray-300">
      <li><a href="#" className="hover:underline">Termos de uso</a></li>
      <li><a href="#" className="hover:underline">Diretrizes de Comunidade</a></li>
      <li><a href="#" className="hover:underline">Política de Privacidade</a></li>
      <li><a href="#" className="hover:underline">Obrigatoriedades Legais</a></li>
      <li><a href="#" className="hover:underline">Regras de meia-entrada</a></li>
    </ul>

    {/* Redes sociais */}
    <div className="flex justify-center md:justify-end gap-4">
      <a
        href="https://www.instagram.com/seuperfil"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram size={18} />
      </a>
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={18} />
      </a>
    </div>
  </div>

  <p className="mt-6 mb-4 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} TOingresso. Todos os direitos reservados.
  </p>
</div>

    </footer>
  );
};

export default Footer;
