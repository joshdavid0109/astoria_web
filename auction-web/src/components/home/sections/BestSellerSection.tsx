// src/components/home/BestSellerSection.tsx
import React from "react";
import PremiumProductCard from "../PremiumProductCard";

const BestSellerSection: React.FC<{ items: any[] }> = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Best Sellers</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((b: any) => <PremiumProductCard key={b.product?.product_id || b.product_id} product={b.product} />)}
      </div>
    </div>
  );
};

export default BestSellerSection;
