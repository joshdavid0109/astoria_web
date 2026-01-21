import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import Filters from "../components/home/amazon/Filters";
import Pagination from "../components/home/amazon/Pagination";

import { fetchAuctions } from "../services/auctionService";


const LIMIT = 24;

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

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
  }, [category, search, page, sort, minRating, price]);

  
  return (
    <main className="bg-[#EAEDED] min-h-screen mt-25">
      <div className="max-w-[1600px] mx-auto px-4 py-4">

        <Breadcrumbs category={category} />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            {total} auctions
            {category && <> for <b>"{category}"</b></>}
          </div>

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 text-sm"
          >
            <option value="">Featured</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="price_asc">Bid: Low to High</option>
            <option value="price_desc">Bid: High to Low</option>
          </select>
        </div>

        <div className="flex gap-4">
          {/* FILTERS */}
          <Filters
            setMinRating={setMinRating}
            setPrice={(min, max) => setPrice({ min, max })}
          />

          {/* GRID */}
          <section className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((auction) => (
              <div
                key={auction.id}
                className="bg-white border p-3 hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div
                  onClick={() => navigate(`/auction/${auction.auction_id}`)}
                  className="h-[220px] bg-gray-100 flex items-center justify-center mb-2 cursor-pointer overflow-hidden"
                >
                  <img
                    src={auction.product?.images?.[0]?.url || "/placeholder.png"}
                    className="object-contain max-h-[200px] hover:scale-105 transition-transform"
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

                {/* COUNTDOWN */}
                <div className="text-xs text-gray-500 mt-1">
                  Ends {auction.ends_at}
                </div>

                {/* ACTION */}
                <button
                  onClick={() => navigate(`/auction/${auction.auction_id}`)}
                  className="mt-2 bg-[#C7511F] hover:bg-[#B14117] text-white px-3 py-1 rounded-full text-sm w-full"
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
    </main>
  );
};

export default AuctionPage;
