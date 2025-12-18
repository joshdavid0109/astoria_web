import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import Filters from "../components/home/amazon/Filters";
import Pagination from "../components/home/amazon/Pagination";
import StarRating from "../components/home/amazon/StarRating";

import { fetchProducts } from "../services/homeService";
import { fetchAuctions } from "../services/auctionService";
import { useAppContext } from "../context/AppContext";

const LIMIT = 48;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { currentMode } = useAppContext(); // 👈 key change

  const category = params.get("category") || undefined;
  const search = params.get("search") || undefined;

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>();
  const [minRating, setMinRating] = useState<number>();
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});

  useEffect(() => {
    async function load() {
      if (currentMode === "auction") {
        const res = await fetchAuctions({
          category,
          search,
          minRating,
          minPrice: price.min,
          maxPrice: price.max,
          sort,
          page,
          limit: LIMIT,
        });

        setItems(res.data);
        setTotal(res.count ?? 0);
      } else {
        const res = await fetchProducts({
          category,
          search,
          minRating,
          minPrice: price.min,
          maxPrice: price.max,
          sort,
          page,
          limit: LIMIT,
        });

        setItems(res.data);
        setTotal(res.count ?? 0);
      }
    }

    load();
  }, [
    currentMode,
    category,
    search,
    page,
    sort,
    minRating,
    price,
  ]);

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <Breadcrumbs category={category} />

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            {total} results{" "}
            {category && (
              <>
                for <b>"{category}"</b>
              </>
            )}
          </div>

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 text-sm"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
            {currentMode === "auction" && (
              <option value="ending_soon">Ending Soon</option>
            )}
          </select>
        </div>

        <div className="flex gap-4">
          <Filters
            setMinRating={setMinRating}
            setPrice={(min, max) => setPrice({ min, max })}
          />

          {/* GRID */}
          <section className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border p-3 hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div
                  onClick={() =>
                    navigate(
                      currentMode === "auction"
                        ? `/auction/${item.id}`
                        : `/product/${item.id}`
                    )
                  }
                  className="h-[220px] bg-gray-100 flex items-center justify-center mb-2 cursor-pointer overflow-hidden"
                >
                  <img
                    loading="lazy"
                    src={item.image_url}
                    alt={item.title}
                    className="object-contain max-h-[200px] transition-transform duration-200 hover:scale-105"
                  />
                </div>

                {/* TITLE */}
                <div
                  onClick={() =>
                    navigate(
                      currentMode === "auction"
                        ? `/auction/${item.id}`
                        : `/product/${item.id}`
                    )
                  }
                  className="text-sm line-clamp-2 cursor-pointer hover:text-[#C7511F]"
                >
                  {item.title}
                </div>

                {/* RATING (marketplace only) */}
                {currentMode === "marketplace" && (
                  <StarRating
                    rating={item.avg_rating}
                    count={item.review_count}
                  />
                )}

                {/* PRICE / BID */}
                {currentMode === "auction" ? (
                  <div className="mt-1 text-sm">
                    <b>Current bid:</b> CAD ${item.current_price}
                  </div>
                ) : (
                  <div className="font-semibold mt-1">
                    CAD ${item.price}
                  </div>
                )}

                {/* ACTION */}
                {currentMode === "marketplace" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // addToCart(item)
                    }}
                    className="mt-2 bg-[#FFD814] hover:bg-[#F7CA00] px-3 py-1 rounded-full text-sm"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/auction/${item.id}`)}
                    className="mt-2 bg-[#C7511F] hover:bg-[#B14117] text-white px-3 py-1 rounded-full text-sm"
                  >
                    Place Bid
                  </button>
                )}
              </div>
            ))}
          </section>
        </div>

        <Pagination
          page={page}
          total={total}
          limit={LIMIT}
          onChange={setPage}
        />
      </div>
    </main>
  );
};

export default ProductsPage;
