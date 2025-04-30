const Footer = () => {
  return (
    <footer className="bg-[#414141] text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">
        {/* Logo e descrição */}
        <div>
          <img src="/logo-branca.png" alt="Logo" className="w-32 mx-auto sm:mx-0" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Descubra, participe e aproveite os melhores eventos da sua cidade.
          </p>
        </div>

        {/* Links úteis */}
        <div>
          <h3 className="text-base font-semibold mb-3">Eventos</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Festas & Shows</a></li>
            <li><a href="#" className="hover:underline">Stand-up Comedy</a></li>
            <li><a href="#" className="hover:underline">Esportes</a></li>
          </ul>
        </div>

        {/* Conta */}
        <div>
          <h3 className="text-base font-semibold mb-3">Minha Conta</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Meus ingressos</a></li>
            <li><a href="#" className="hover:underline">Meus eventos</a></li>
            <li><a href="#" className="hover:underline">Criar evento</a></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-base font-semibold mb-3">Fale Conosco</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: contato@suafesta.com</li>
            <li>Telefone: (11) 99999-9999</li>
            <li><a href="#" className="hover:underline">Ajuda & Suporte</a></li>
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
