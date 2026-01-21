import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

interface Props {
  title: string;
  items: any[];
}

const TopPicksRow: React.FC<Props> = ({ title, items }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1500px] mx-auto px-4 mt-8">
      <div className="bg-white border border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((row: any) => {
            const product = row.product || row;

            return (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.product_id}`)}
                className="min-w-[180px] max-w-[180px] text-left"
              >
                <div className="product-image-wrapper bg-gray-100 h-[160px] flex items-center justify-center mb-2">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.title}
                    className="product-image object-contain max-h-[140px]"
                  />
                </div>

                <div className="text-sm line-clamp-2 mb-1">
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

export default TopPicksRow;
