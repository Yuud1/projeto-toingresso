import React from 'react';

const AdBanner: React.FC = () => {
  const banner = {
    image: 'https://picsum.photos/1200/350',
    link: 'https://seusite.com/promo',
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 mb-5 px-4">
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <img
          src={banner.image}
          alt="Propaganda"
          className="w-full h-[160px] sm:h-[200px] md:h-[240px] object-cover"
        />
      </a>
    </div>
  );
};

export default AdBanner;
