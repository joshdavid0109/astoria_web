// src/components/home/CategoryBlockPremium.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryTilePremium from "../home/CategoryTile";

type BlockItem = { name: string; image?: string | null; subtitle?: string };
type Block = { title: string; items: BlockItem[]; seeMoreLinkText?: string };

const CategoryBlock: React.FC<{ block: Block }> = ({ block }) => {
  const navigate = useNavigate();
  const goToCategory = (name: string) => navigate(`/category/${encodeURIComponent(name)}`);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* header with gold accent */}
      <div className="px-6 py-5 bg-white/90 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{block.title}</h3>
            <div className="mt-2">
              <div className="h-0.5 w-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded" />
            </div>
          </div>

          <div>
            <button
              onClick={() => goToCategory(block.items[0].name)}
              className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
            >
              {block.seeMoreLinkText || "See more"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* tiles grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {block.items.map((it) => (
            <CategoryTilePremium
              key={it.name}
              title={it.name}
              image={it.image}
              subtitle={it.subtitle}
              onClick={() => goToCategory(it.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlock;
