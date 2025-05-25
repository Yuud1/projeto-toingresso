const Footer = () => {
  const scrollToFilterGrid = (event: React.MouseEvent, category?: string) => {
    event.preventDefault();
    const filterGridElement = document.getElementById('filter-grid');
    
    if (filterGridElement) {
      //logica
      if (category) {
        //set filter
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

      {/* Linha inferior */}
      <div className="mt-10 border-t border-gray-600 pt-4 text-center text-sm text-gray-400 px-6">
        © {new Date().getFullYear()} TOingresso. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;