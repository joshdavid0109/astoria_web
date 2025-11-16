import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Clock, MapPin, Grid, List } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { AuctionItem } from "../types/types";
import {
  getAuctionProducts,
  getMarketplaceProducts,
} from "../services/productService.ts";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 1, name: "Electronics", icon: "📱" },
  { id: 2, name: "Fashion", icon: "👕" },
  { id: 3, name: "Home & Garden", icon: "🏠" },
  { id: 4, name: "Sports", icon: "⚽" },
  { id: 5, name: "Books", icon: "📚" },
  { id: 6, name: "Toys", icon: "🧸" },
  { id: 7, name: "Beauty", icon: "💄" },
  { id: 8, name: "Auto", icon: "🚗" },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentMode,
    addToCart,
    placeBid,
    isLoggedIn,
    toggleWatchlist,
    isInWatchlist,
    searchQuery,
  } = useAppContext();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load products from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);

      const items =
        currentMode === "auction"
          ? await getAuctionProducts()
          : await getMarketplaceProducts();

      setProducts(items || []);
      setLoading(false);
    }
    load();
  }, [currentMode]);

  // Product Card Component
  const ProductCard: React.FC<{ product: AuctionItem }> = ({ product }) => {
    const isAuction = currentMode === "auction";

    const endDate = product.endTime ? new Date(product.endTime) : null;
    const timeLeft = endDate ? Math.max(0, endDate.getTime() - Date.now()) : 0;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="w-[220px] md:w-[240px] lg:w-[260px] bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group mx-auto">
        <div className="relative overflow-hidden">
          <div className="aspect-square w-full bg-gray-200 overflow-hidden">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Watchlist Button */}
          <button
            onClick={() => toggleWatchlist(product.id)}
            className={`absolute top-3 right-3 rounded-full p-2 shadow-md transition-opacity ${
              isInWatchlist(product.id)
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isInWatchlist(product.id) ? "fill-current" : ""
              }`}
            />
          </button>

          {isAuction && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              AUCTION
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
            {product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.bidCount || 0})</span>
          </div>

          {/* Pricing Area */}
          <div className="mb-3">
            {isAuction ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-red-600">
                    ${product.currentBid}
                  </span>

                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {product.bidCount || 0} bids
                </div>

                <div className="text-xs text-gray-500">
                  Min bid: +${product.minBidIncrement || 10}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">
                  ${product.currentBid}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            {product.location || "Unknown"}
          </div>

          {/* Seller */}
          <div className="text-xs text-gray-600 mb-3">
            by {product.seller || "Seller"}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            {isAuction ? (
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  const amount =
                    (product.currentBid || 0) +
                    (product.minBidIncrement || 10);

                  if (endDate && endDate < new Date()) {
                    alert("Auction already ended");
                    return;
                  }

                  if (placeBid(product.id, amount)) {
                    alert(`Bid placed: $${amount}`);
                  }
                }}
                className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-red-500 hover:bg-red-600 text-white"
              >
                Place Bid
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  addToCart(product);
                  alert(`${product.title} added to cart`);
                }}
                className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-orange-500 hover:bg-orange-600 text-white"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full py-2 px-4 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {currentMode === "auction"
                ? "Bid & Win Amazing Items"
                : "Shop & Save More"}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {currentMode === "auction"
                ? "Discover unique items from real auctions"
                : "Find great deals across categories"}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentMode === "auction"
              ? "🔥 Hot Auctions"
              : "⭐ Featured Products"}
          </h2>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] justify-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
