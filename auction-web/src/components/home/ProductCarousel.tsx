// src/components/home/ProductCarousel.tsx
import React from "react";
import PremiumProductCard from "./PremiumProductCard";

const ProductCarousel: React.FC<{ items: any[]; title?: string }> = ({ items = [], title }) => {
  if (!items.length) return null;
  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>}
      <div className="overflow-x-auto">
        <div className="flex gap-4 py-2">
          {items.map((p) => (
            <div key={p.product_id || p.auction_id || p.id} className="min-w-[220px]">
              <PremiumProductCard product={p.product ?? p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
