import { ReactNode } from "react";

interface Category {
  icon: ReactNode;
  label: string;
  count: number;
}

interface PopularCategoriesProps {
  categories: Category[];
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-[#414141] mb-4">
        Categorias Populares
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <a
            key={index}
            href={`#${category.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className="p-3 bg-[#e2f0ff] rounded-lg mb-3">
              {category.icon}
            </div>
            <span className="font-medium text-[#414141]">{category.label}</span>
            <span className="text-sm text-gray-500 mt-1">
              {category.count} perguntas
            </span>
          </a>
        ))}
      </div>
    </div>
  );
} 