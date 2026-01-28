import React from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../services/homeService";
import { useAppContext } from "../../../context/AppContext";

interface Props {
  title: string;
  categories: Category[];
}

const CategoryGrid: React.FC<Props> = ({ title, categories }) => {
  const navigate = useNavigate();
  const { currentMode } = useAppContext();

  if (!categories || categories.length === 0) return null;

  // group into cards of 4 categories
  const cards: Category[][] = [];
  for (let i = 0; i < categories.length; i += 4) {
    cards.push(categories.slice(i, i + 4));
  }

  const handleCategoryClick = (cat: Category) => {
    if (currentMode === "auction") {
      navigate(`/auctions?category=${encodeURIComponent(cat.name)}`);
    } else {
      navigate(`/products?category=${encodeURIComponent(cat.name)}`);
    }
  };

  return (
    <section className="max-w-[1500px] mx-auto px-4 mt-6">
      {/* MOBILE: horizontal scroll | DESKTOP: grid */}
      <div
    className="
      flex gap-4 overflow-x-auto pb-4
      md:grid md:grid-cols-2 md:gap-5 md:overflow-visible
      lg:grid-cols-4
    "
  >
        {cards.slice(0, 4).map((group, idx) => (
          <div
            key={idx}
            className="
              bg-white border border-gray-300 p-4
              min-w-[260px] flex flex-col
            "
          >
            {/* Card title */}
            <h2 className="text-base md:text-lg font-bold mb-3">
              {currentMode === "auction" ? "Browse Auctions" : title}
            </h2>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {group.map((cat) => (
                <button
                  key={cat.categories_id}
                  onClick={() => handleCategoryClick(cat)}
                  className="text-left group"
                >
                  <div className="bg-gray-100 h-[90px] sm:h-[110px] flex items-center justify-center">
                    <img
                      src={cat.icon || "/placeholder.png"}
                      alt={cat.name}
                      className="max-h-[70px] max-w-[70px] object-contain"
                    />
                  </div>
                  <div className="text-xs mt-1 leading-tight line-clamp-2">
                    {cat.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer link */}
            <button
              onClick={() =>
                navigate(currentMode === "auction" ? "/auctions" : "/products")
              }
              className="text-sm text-blue-600 hover:underline mt-3 text-left"
            >
              See more
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
