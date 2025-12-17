import React from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../services/homeService";

interface CuratedBlock {
  title: string;
  categoryNames: string[];
  footerText?: string;
}

interface Props {
  categories: Category[];
  blocks: CuratedBlock[];
}

const CuratedCategoryGrid: React.FC<Props> = ({ categories, blocks }) => {
  const navigate = useNavigate();

  const findCategory = (name: string) =>
    categories.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );

  return (
    <section className="max-w-[1500px] mx-auto px-4 mt-8">
      <div className="grid grid-cols-4 gap-5">
        {blocks.map((block, idx) => {
          const cats = block.categoryNames
            .map(findCategory)
            .filter(Boolean)
            .slice(0, 4) as Category[];

          if (cats.length === 0) return null;

          return (
            <div
              key={idx}
              className="bg-white border border-gray-300 p-4 h-[390px] flex flex-col"
            >
              <h2 className="text-lg font-bold mb-3">{block.title}</h2>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {cats.map((cat) => (
                  <button
                    key={cat.categories_id}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                    className="text-left group"
                  >
                    <div className="bg-gray-100 h-[120px] flex items-center justify-center overflow-hidden">
                      <img
                        src={cat.icon || "/placeholder.png"}
                        alt={cat.name}
                        className="max-h-[80px] max-w-[80px] object-contain group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="text-xs mt-1">{cat.name}</div>
                  </button>
                ))}
              </div>

              <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
                {block.footerText || "See more"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedCategoryGrid;
