import React, { useEffect, useState } from "react";

import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/amazon/CategoryGrid";
import ProductRow from "../components/home/amazon/ProductRow";
import CuratedCategoryGrid from "../components/home/amazon/CuratedGrid";
import SignInCTA from "../components/home/amazon/SIgnInCTA";
import TopPicksRow from "../components/home/amazon/TopPicksRow";
import AuctionRow from "../components/home/auction/AuctionRow";

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

/* ------------------------------------------
 Types
------------------------------------------ */
type CategoryRow = {
  categories_id: number;
  name: string;
  icon?: string | null;
};

/* ------------------------------------------
 Component
------------------------------------------ */
const HomePage: React.FC = () => {
  const { currentMode, isLoggedIn } = useAppContext();

  /* ---------- Shared ---------- */
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  /* ---------- Marketplace ---------- */
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);

  /* ---------- Auction ---------- */
  const [endingSoon, setEndingSoon] = useState<any[]>([]);
  const [hotAuctions, setHotAuctions] = useState<any[]>([]);
  const [newAuctions, setNewAuctions] = useState<any[]>([]);

  /* ------------------------------------------
    Data Load
  ------------------------------------------ */
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Categories (always)
        const cats = await fetchCategories();
        if (isMounted) setCategories(cats || []);

        // Banners (always)
        const b = await fetchActiveBanners();
        if (isMounted) setBanners(b || []);

        if (currentMode === "marketplace") {
          const [f, bs] = await Promise.all([
            fetchFlashDeals(12),
            fetchBestSellers(12),
          ]);

          if (isMounted) {
            setFlashDeals(f || []);
            setBestSellers(bs || []);
          }
        }

        if (currentMode === "auction") {
          const [end, hot, newer] = await Promise.all([
            fetchEndingSoonAuctions(),
            fetchHotAuctions(),
            fetchNewAuctions(),
          ]);

          if (isMounted) {
            setEndingSoon(end || []);
            setHotAuctions(hot || []);
            setNewAuctions(newer || []);
          }
        }
      } catch (err) {
        console.error("❌ HomePage load error:", err);
      } finally {
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [currentMode]);


  /* ------------------------------------------
    Render
  ------------------------------------------ */
  return (
  <main className="bg-[#EAEDED] min-h-screen">
    <Hero banners={banners} />

    {/* ================== MARKETPLACE MODE ================== */}
    {currentMode === "marketplace" && (
      <>
        <CategoryGrid title="Shop by Category" categories={categories} />

        <ProductRow title="Flash Deals" items={flashDeals} type="flash" />

        <ProductRow
          title="Best Sellers"
          items={bestSellers}
          type="bestseller"
        />

        <CuratedCategoryGrid
          categories={categories}
          blocks={[
            {
              title: "Deals on fashion",
              categoryNames: ["Clothing", "Shoes", "Jewelry"],
              footerText: "Shop all fashion deals",
            },
            {
              title: "Level up your gaming",
              categoryNames: ["Computers", "Electronics", "Games"],
              footerText: "Shop the latest in gaming",
            },
            {
              title: "Toys for all ages",
              categoryNames: ["Toys", "Baby Products"],
              footerText: "See all",
            },
            {
              title: "Deals on top categories",
              categoryNames: ["Books", "Beauty", "Computers"],
              footerText: "Discover more",
            },
          ]}
        />

        <TopPicksRow
          title="Top picks for Canada"
          items={bestSellers.slice(0, 12)}
        />
      </>
    )}

    {/* ================== AUCTION MODE ================== */}
   {currentMode === "auction" && (
  <div className="space-y-12">
    <CategoryGrid
      title="Browse Live Auctions"
      categories={categories}
    />

    <AuctionRow
      title="⏳ Ending Soon"
      auctions={endingSoon}
    />

    <AuctionRow
      title="🔥 Hot Auctions"
      auctions={hotAuctions}
    />

    <AuctionRow
      title="🆕 Newly Listed"
      auctions={newAuctions}
    />
  </div>
)}



    <SignInCTA isLoggedIn={isLoggedIn} />
  </main>
);

};

export default HomePage;
