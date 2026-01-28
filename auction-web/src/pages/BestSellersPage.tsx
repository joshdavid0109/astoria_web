import { useEffect, useState } from "react";
import { fetchBestSellers } from "../services/homeService";

const BestSellersPage = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchBestSellers(48);
      setItems(data || []);
    }
    load();
  }, []);

  return (
    <main className="max-w-[1500px] mx-auto px-4 py-10 mt-25">
      <h1 className="text-2xl font-semibold mb-6">Best Sellers</h1>

      {/* ================= RESPONSIVE GRID ================= */}
      <div
        className="
          grid
          grid-cols-2
          gap-4

          sm:grid-cols-3
          md:grid-cols-4
          xl:grid-cols-6
        "
      >
        {items.map((row) => {
          const product = row.product;
          if (!product) return null;

          return (
            <button
              key={row.bestseller_id}
              className="bg-white rounded border p-3 hover:shadow-md transition text-left"
              onClick={() =>
                (window.location.href = `/product/${product.product_id}`)
              }
            >
              <div className="bg-gray-100 h-[160px] flex items-center justify-center mb-2 rounded">
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.title}
                  className="max-h-[140px] object-contain"
                />
              </div>

              <div className="text-sm font-medium line-clamp-2">
                {product.title}
              </div>

              <div className="text-sm font-semibold mt-1">
                ₱{product.price}
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default BestSellersPage;
