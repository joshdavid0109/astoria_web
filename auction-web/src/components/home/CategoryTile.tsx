// src/components/home/CategoryTilePremium.tsx
import React from "react";

type Props = {
  title: string;
  image?: string | null;
  onClick?: () => void;
  subtitle?: string;
};

const CategoryTile: React.FC<Props> = ({ title, image, onClick, subtitle }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-100 hover:shadow-2xl transition-shadow transform hover:-translate-y-1 duration-200 p-0 overflow-hidden"
    >
      <div className="relative h-32 md:h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400 text-sm">{title}</div>
        )}
        {/* Gold top accent (subtle) */}
        <div className="absolute top-3 left-3 w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded" />
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      </div>
    </button>
  );
};

export default CategoryTile;
