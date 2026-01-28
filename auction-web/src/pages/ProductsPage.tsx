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
  const { currentMode } = useAppContext();

  const category = params.get("category") || undefined;
  const search = params.get("search") || undefined;

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>();
  const [minRating, setMinRating] = useState<number>();
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});

  // mobile UI
  const [showFilters, setShowFilters] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    async function load() {
      if (currentMode === "auction") {
        const res = await fetchAuctions({
          category,
          search,
          minPrice: price.min,
          maxPrice: price.max,
          sort,
          page,
          limit: LIMIT,
        });

        console.log(res.data);
        setItems(res.data || []);
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
          console.log(res.data);

        setItems(res.data || []);
        setTotal(res.count ?? 0);
      }
    }

    load();
  }, [currentMode, category, search, page, sort, minRating, price]);

  return (
    <main className="bg-[#EAEDED] min-h-screen pt-[130px] lg:pt-25">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <Breadcrumbs category={category} />

        {/* ================= HEADER ROW ================= */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4">
          <div className="text-sm">
            {total} results{" "}
            {category && (
              <>
                for <b>"{category}"</b>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-2 text-sm rounded"
            >
              <option value="">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              {currentMode === "auction" && (
                <option value="ending_soon">Ending Soon</option>
              )}
            </select>

            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden border px-4 py-2 rounded text-sm bg-white"
            >
              Filters
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex gap-4">
          {/* DESKTOP FILTERS */}
          <div className="hidden md:block w-[260px] shrink-0">
            <Filters
              setMinRating={setMinRating}
              setPrice={(min, max) => setPrice({ min, max })}
            />
          </div>

          {/* PRODUCT GRID */}
          <section
            className="
              flex-1
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-4
            "
          >
            {items.map((item) => {
              const isAuction = currentMode === "auction";

              const imageUrl = isAuction
                ? item.product?.images?.[0]?.url
                : item.image_url;

              const title = isAuction
                ? item.product?.title
                : item.title;

              const itemId = isAuction
                ? item.auction_id
                : item.product_id;

              return (
                <div
                  key={itemId}
                  className="bg-white border p-3 hover:shadow-md transition rounded"
                >
                  {/* IMAGE */}
                  <div
                    onClick={() =>
                      navigate(
                        isAuction
                          ? `/auction/${itemId}`
                          : `/product/${itemId}`
                      )
                    }
                    className="h-[180px] sm:h-[220px] bg-gray-100 flex items-center justify-center mb-2 cursor-pointer overflow-hidden rounded"
                  >
                    <img
                      loading="lazy"
                      src={imageUrl || "/placeholder.png"}
                      alt={title}
                      className="object-contain max-h-full transition-transform duration-200 hover:scale-105"
                    />
                  </div>

                  {/* TITLE */}
                  <div
                    onClick={() =>
                      navigate(
                        isAuction
                          ? `/auction/${itemId}`
                          : `/product/${itemId}`
                      )
                    }
                    className="text-sm line-clamp-2 cursor-pointer hover:text-[#C7511F]"
                  >
                    {title}
                  </div>

                  {/* RATING */}
                  {!isAuction && (
                    <StarRating
                      rating={item.avg_rating}
                      count={item.review_count}
                    />
                  )}

                  {/* PRICE */}
                  {isAuction ? (
                    <div className="mt-1 text-sm">
                      <b>Current bid:</b> CAD ${item.current_price}
                    </div>
                  ) : (
                    <div className="font-semibold mt-1">
                      CAD ${item.price}
                    </div>
                  )}

                  {/* ACTION */}
                  {!isAuction ? (
                    <button className="mt-2 bg-[#FFD814] hover:bg-[#F7CA00] px-3 py-1 rounded-full text-sm w-full">
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/auction/${itemId}`)}
                      className="mt-2 bg-[#C7511F] hover:bg-[#B14117] text-white px-3 py-1 rounded-full text-sm w-full"
                    >
                      Place Bid
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        <Pagination
          page={page}
          total={total}
          limit={LIMIT}
          onChange={setPage}
        />
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-blue-600"
              >
                Close
              </button>
            </div>

            <Filters
              setMinRating={setMinRating}
              setPrice={(min, max) => setPrice({ min, max })}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;
