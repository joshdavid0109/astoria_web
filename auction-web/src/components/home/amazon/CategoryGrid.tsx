import React from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../services/homeService";

interface Props {
  title: string;
  categories: Category[];
}

const CategoryGrid: React.FC<Props> = ({ title, categories }) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) return null;

  // group into cards of 4 categories (Amazon style)
  const cards: Category[][] = [];
  for (let i = 0; i < categories.length; i += 4) {
    cards.push(categories.slice(i, i + 4));
  }

  return (
    <section className="max-w-[1500px] mx-auto px-4 mt-6">
      <div className="grid grid-cols-4 gap-5">
        {cards.slice(0, 4).map((group, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 p-4 h-[390px] flex flex-col"
          >
            {/* Card title */}
            <h2 className="text-lg font-bold mb-3">{title}</h2>

            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {group.map((cat) => (
                <button
                  key={cat.categories_id}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="text-left group"
                >
                  <div className="product-image-wrapper bg-gray-100 h-[120px] flex items-center justify-center">
                    <img
                        src={cat.icon || "/placeholder.png"}
                        alt={cat.name}
                        className="product-image max-h-[80px] max-w-[80px] object-contain"
                    />
                    </div>
                  <div className="text-xs mt-1 leading-tight">
                    {cat.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer link */}
            <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
              See more
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
