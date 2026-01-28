import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import Filters from "../components/home/amazon/Filters";
import Pagination from "../components/home/amazon/Pagination";

import { fetchAuctions } from "../services/auctionService";
import { useAppContext } from "../context/AppContext";

const LIMIT = 48;

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { currentMode } = useAppContext();


  const category = params.get("category") || undefined;
  const search = params.get("search") || undefined;

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>();
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});

  // mobile UI
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
  async function load() {
    if (currentMode !== "auction") return;

    const res = await fetchAuctions({
      category,
      search,
      minPrice: price.min,
      maxPrice: price.max,
      sort,
      page,
      limit: LIMIT,
    });

    setItems(res.data || []);
    setTotal(res.count || 0);
  }

  load();
}, [currentMode, category, search, page, sort, price]);


  return (
    <main className="bg-[#EAEDED] min-h-screen pt-[120px] lg:pt-25">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <Breadcrumbs category={category} />

        {/* ================= HEADER ROW (COPIED FROM ProductsPage) ================= */}
        <div className="bg-white rounded-md p-3 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm md:text-base font-medium">
            <span className="text-gray-600">
              {total} auctions
            </span>
            {category && (
              <>
                {" "}in <span className="font-semibold">"{category}"</span>
              </>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">Featured</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="price_asc">Bid: Low to High</option>
              <option value="price_desc">Bid: High to Low</option>
            </select>

            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden border rounded-md px-4 py-2 text-sm bg-white"
            >
              Filters
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex gap-4">
          {/* DESKTOP FILTERS */}
          <div className="hidden md:block w-[260px] shrink-0">
            <div className="sticky top-[100px]">
              <Filters
                setMinRating={() => {}}
                setPrice={(min, max) => setPrice({ min, max })}
              />
            </div>
          </div>

          {/* GRID */}
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
            {items.map((auction) => (
              <div
                key={auction.auction_id}
                className="bg-white border rounded-md p-3 flex flex-col hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div
                  onClick={() => navigate(`/auction/${auction.auction_id}`)}
                  className="h-[180px] sm:h-[220px] bg-gray-100 flex items-center justify-center mb-2 cursor-pointer overflow-hidden rounded"
                >
                  <img
                    src={
                      auction.product?.images?.[0]?.url ||
                      "/placeholder.png"
                    }
                    className="object-contain max-h-full transition-transform duration-200 hover:scale-105"
                  />
                </div>

                {/* TITLE */}
                <div
                  onClick={() => navigate(`/auction/${auction.auction_id}`)}
                  className="text-sm line-clamp-2 cursor-pointer hover:text-[#C7511F]"
                >
                  {auction.product?.title}
                </div>

                {/* BID */}
                <div className="mt-1 text-sm">
                  <b>Current bid:</b> CAD ${auction.current_price}
                </div>

                {/* END TIME */}
                <div className="text-xs text-gray-500 mt-1">
                  Ends {auction.ends_at}
                </div>

                {/* ACTION */}
                <button
                  onClick={() => navigate(`/auction/${auction.auction_id}`)}
                  className="mt-auto bg-[#C7511F] hover:bg-[#B14117] text-white px-3 py-2 rounded-full text-sm w-full"
                >
                  Place Bid
                </button>
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

      {/* ================= MOBILE FILTER DRAWER (COPIED) ================= */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-3 mb-3 flex justify-between items-center border-b">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-blue-600"
              >
                Done
              </button>
            </div>

            <Filters
              setMinRating={() => {}}
              setPrice={(min, max) => setPrice({ min, max })}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default AuctionPage;
