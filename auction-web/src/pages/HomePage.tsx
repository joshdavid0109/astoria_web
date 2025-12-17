import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/amazon/CategoryGrid";
import ProductRow from "../components/home/amazon/ProductRow";
import CuratedCategoryGrid from "../components/home/amazon/CuratedGrid";
import SignInCTA from "../components/home/amazon/SIgnInCTA";
import TopPicksRow from "../components/home/amazon/TopPicksRow";

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
import AuctionRow from "../components/home/auction/AuctionRow";

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
  const navigate = useNavigate();
  const { currentMode, isLoggedIn} = useAppContext();

  /* ---------- Shared ---------- */
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    async function load() {
      setLoading(true);

      // Categories (always)
      const cats = await fetchCategories();
      setCategories(cats || []);

      // Banners (always)
      const b = await fetchActiveBanners();
      setBanners(b || []);

      // Marketplace-specific
      if (currentMode === "marketplace") {
        const [f, bs] = await Promise.all([
          fetchFlashDeals(12),
          fetchBestSellers(12),
        ]);
        setFlashDeals(f || []);
        setBestSellers(bs || []);
      }

      // Auction-specific
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

  /* ------------------------------------------
    Auction Home (kept simple for now)
  ------------------------------------------ */
  const AuctionHome = () => (
  <div className="container mx-auto px-6 py-12 space-y-10">

    <CategoryGrid
      title="Browse Auctions"
      categories={categories}
    />

    <AuctionRow
      title="Ending Soon"
      auctions={endingSoon}
    />

    <AuctionRow
      title="Hot Auctions"
      auctions={hotAuctions}
    />

    <AuctionRow
      title="New Auctions"
      auctions={newAuctions}
    />

  </div>
);



  /* ------------------------------------------
    Render
  ------------------------------------------ */
  return (
    <main className="bg-[#EAEDED] min-h-screen">
      {/* Amazon-style Hero */}
      <Hero banners={banners} />
      {currentMode === "marketplace" && (
        <>
          <CategoryGrid
            title="Shop by Category"
            categories={categories}
          />

          <ProductRow
            title="Flash Deals"
            items={flashDeals}
            type="flash"
          />

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


      {/* Auction */}
      {currentMode === "auction" && <AuctionHome />}

      <SignInCTA isLoggedIn={isLoggedIn} />
    </main>
  );
};

export default HomePage;
