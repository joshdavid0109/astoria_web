import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

interface ProductRowProps {
  title: string;
  items: any[];
  type: "flash" | "bestseller";
}

const ProductRow: React.FC<ProductRowProps> = ({ title, items, type }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1500px] mx-auto px-4 mt-6">
      <div className="bg-white border border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((row: any) => {
            const product = row.product || row;

            return (
              <button
                key={product.id || row.flash_id || row.bestseller_id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="min-w-[180px] max-w-[180px] text-left"
              >
                <div className="product-image-wrapper bg-gray-100 h-[160px] flex items-center justify-center mb-2">
                    <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.title}
                        className="product-image object-contain max-h-[140px]"
                    />
                </div>

                {type === "flash" && (
                  <div className="text-xs font-bold text-red-600 mb-1">
                    {row.discount_percent}% off
                  </div>
                )}

                <div className="text-sm line-clamp-2">
                  {product.title}
                </div>
                <StarRating
                  rating={product.avg_rating}
                  count={product.review_count}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductRow;
