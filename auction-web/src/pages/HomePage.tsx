// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import HeroPremium from "../components/home/Hero";
import CategoryBlockPremium from "../components/home/CategoryBlock";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../context/AppContext";
import {
  fetchCategories,
  fetchActiveBanners,
  fetchFlashDeals,
  fetchBestSellers,
} from "../services/homeService";

import {
  fetchEndingSoonAuctions,
  fetchHotAuctions,
  fetchNewAuctions,
} from "../services/auctionService";

type CatRow = { categories_id: number; name: string; icon?: string | null };

const HomePage: React.FC = () => {

  const navigate = useNavigate();
  const { currentMode } = useAppContext();

  // Shared
  const [categories, setCategories] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Marketplace
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  // Auction
  const [endingSoon, setEndingSoon] = useState<any[]>([]);
  const [hotAuctions, setHotAuctions] = useState<any[]>([]);
  const [newAuctions, setNewAuctions] = useState<any[]>([]);

  // Utility
  const findIcon = (name: string) =>
    categories.find((c) =>
      c.name?.toLowerCase().includes(name.toLowerCase())
    )?.icon || null;

  useEffect(() => {
    async function load() {
      setLoading(true);

      const cats = await fetchCategories();
      setCategories(cats || []);

      if (currentMode === "marketplace") {
        const [b, f, bs] = await Promise.all([
          fetchActiveBanners(),
          fetchFlashDeals(12),
          fetchBestSellers(12),
        ]);
        setBanners(b || []);
        setFlashDeals(f || []);
        setBestSellers(bs || []);
      }

      if (currentMode === "auction") {
        const [end, hot, newer] = await Promise.all([
          fetchEndingSoonAuctions(),
          fetchHotAuctions(),
          fetchNewAuctions(),
        ]);
        setEndingSoon(end || []);
        setHotAuctions(hot || []);
        setNewAuctions(newer || []);
      }

      setLoading(false);
    }

    load();
  }, [currentMode]);

  // ------------------------------------------
  // Marketplace Blocks
  // ------------------------------------------
  const marketplaceBlocks = [
    {
      title: "Have more fun with family",
      items: [
        { name: "Toys & Games", image: findIcon("Toys & Games") },
        { name: "Baby Products", image: findIcon("Baby Products") },
        { name: "Pet Supplies", image: findIcon("Pet Supplies") },
        { name: "Books", image: findIcon("Books") },
      ],
    },
    {
      title: "Deals on top categories",
      items: [
        { name: "Books", image: findIcon("Books") },
        { name: "Clothing, Shoes & Jewelry", image: findIcon("Clothing") },
        { name: "Computers & Accessories", image: findIcon("Computers") },
        { name: "Beauty and Personal Care", image: findIcon("Beauty") },
      ],
    },
    {
      title: "Find gifts at any price",
      items: [
        { name: "Under $10", image: null },
        { name: "Under $25", image: null },
        { name: "Under $50", image: null },
        { name: "Under $75", image: null },
      ],
    },
    {
      title: "Deals on fashion",
      items: [
        { name: "Women's", image: findIcon("Women") },
        { name: "Men's", image: findIcon("Men") },
        { name: "Shoes", image: findIcon("Shoes") },
        { name: "Gifts", image: findIcon("Gifts") },
      ],
    },
  ];

  // ------------------------------------------
  // Auction Blocks
  // ------------------------------------------
  const auctionBlocks = [
    {
      title: "Ending Soon",
      items: endingSoon.map((a: any) => ({
        name: a.product?.title,
        image: a.product?.image_url,
      })),
    },
    {
      title: "Hot Auctions",
      items: hotAuctions.map((a: any) => ({
        name: a.product?.title,
        image: a.product?.image_url,
      })),
    },
    {
      title: "New Auctions",
      items: newAuctions.map((a: any) => ({
        name: a.product?.title,
        image: a.product?.image_url,
      })),
    },
    {
      title: "Popular Categories",
      items: [
        { name: "Tech", image: findIcon("Electronics") },
        { name: "Home", image: findIcon("Home") },
        { name: "Fashion", image: findIcon("Fashion") },
        { name: "Toys", image: findIcon("Toys") },
      ],
    },
  ];

  // ------------------------------------------
  // Marketplace Home Layout
  // ------------------------------------------
  const MarketplaceHome = () => (
    <div className="container mx-auto px-6 py-12">
      {/* Premium curated blocks */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        <div className="col-span-12">
          <CategoryBlockPremium block={marketplaceBlocks[1]} />
        </div>

        <div className="col-span-12 md:col-span-4">
          <CategoryBlockPremium block={marketplaceBlocks[3]} />
        </div>

        <div className="col-span-12 md:col-span-4">
          <CategoryBlockPremium block={marketplaceBlocks[0]} />
        </div>

        <div className="col-span-12 md:col-span-4">
          <CategoryBlockPremium block={marketplaceBlocks[2]} />
        </div>

        {/* Trending Scroll */}
        <div className="col-span-12 mt-16 relative">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Trending Now</h2>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            {([...marketplaceBlocks[0].items, ...marketplaceBlocks[1].items]).map(
              (item, i) => (
                <button
                  onClick={() => navigate(`/category/${item.name}`)}
                  key={i}
                  className="
                    snap-start min-w-[170px] w-[170px]
                    bg-white rounded-2xl shadow-sm hover:shadow-lg 
                    border border-gray-100 hover:border-orange-300
                    transition-all duration-300 p-4
                    flex flex-col items-center
                  "
                >
                  <div className="h-28 w-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-3 text-sm font-semibold text-center">{item.name}</div>

                  <div className="text-xs text-orange-600 flex items-center gap-1">
                    See more <span className="text-[10px]">›</span>
                  </div>
                </button>
              )
            )}
          </div>

        </div>

        {/* Editor Picks */}
        <div className="col-span-12 mt-16">
          <div className="bg-white rounded-3xl shadow-lg border p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Editor's Premium Picks
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded mt-3"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {marketplaceBlocks[2].items.map((item, i) => (
                <CategoryBlockPremium
                  key={i}
                  block={{ title: item.name, items: [item] }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Deals */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Flash Deals</h2>
        <div className="flex overflow-x-auto gap-4 mt-4 pb-4">
          {flashDeals.map((fd: any) => (
            <div key={fd.flash_id} className="min-w-[220px]">
              <div className="bg-white rounded-xl p-3 shadow-sm border">
                <div className="h-36 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={fd.product?.image_url}
                    alt={fd.product?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 font-medium">{fd.product?.title}</div>
                <div className="text-xs text-slate-500">
                  {fd.discount_percent}% off
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Best Sellers</h2>
        <div className="flex overflow-x-auto gap-4 mt-4 pb-4">
          {bestSellers.map((bs: any) => (
            <div key={bs.bestseller_id} className="min-w-[220px]">
              <div className="bg-white rounded-xl p-3 shadow-sm border">
                <div className="h-36 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={bs.product?.image_url}
                    alt={bs.product?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 font-medium">{bs.product?.title}</div>
                <div className="text-xs text-slate-500">Top seller</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // ------------------------------------------
  // Auction Home Layout
  // ------------------------------------------
  const AuctionHome = () => (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-12 gap-8">
        {/* Auction blocks */}
        {auctionBlocks.map((block, i) => (
          <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3">
            <CategoryBlockPremium block={block} />
          </div>
        ))}
      </div>
    </div>
  );

  // -----------------------------
  // Final Render
  // -----------------------------
  return (
    <main className="bg-slate-50">
      <HeroPremium />
      {currentMode === "marketplace" ? <MarketplaceHome /> : <AuctionHome />}
    </main>
  );
};

export default HomePage;

