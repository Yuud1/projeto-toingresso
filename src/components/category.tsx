import React from 'react';
import {
  Music2,
  Drama,
  Mic2,
  Presentation,
  Church,
  Trophy,
} from 'lucide-react';

const categories = [
  { icon: <Music2 className="w-6 h-6" />, label: 'Festas e Shows' },
  { icon: <Drama className="w-6 h-6" />, label: 'Teatros e Espetáculos' },
  { icon: <Mic2 className="w-6 h-6" />, label: 'Stand Up Comedy' },
  { icon: <Presentation className="w-6 h-6" />, label: 'Congressos e Palestras' },
  { icon: <Church className="w-6 h-6" />, label: 'Gospel' },
  { icon: <Trophy className="w-6 h-6" />, label: 'Esportes' },
];

const Category: React.FC = () => {
    return (
      <div>
        <h2 className="text-[#414141] text-2xl font-bold mb-8 pt-8">Explore nossas coleções</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-40 h-28 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              {cat.icon}
              <span className="mt-2 text-center text-sm text-gray-700">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default Category;
