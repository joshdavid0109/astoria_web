import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import CartModal from "./CartModal";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartCount,
    isLoggedIn,
    logout,
    currentMode,
    setCurrentMode,
    searchQuery,
    setSearchQuery,
  } = useAppContext();

  const [showCart, setShowCart] = useState(false);

  return (
    <>
      {/* ===================== TOP BAR ===================== */}
      <header className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[60px] gap-4">
            {/* LOGO */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:outline hover:outline-1 hover:outline-white px-2 py-1"
            >
              <img
                src="/src/assets/astoria_white-nobg.png"
                alt="Astoria"
                className="h-8"
              />
            </button>

            {/* SEARCH */}
            <div className="flex flex-1 max-w-4xl">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Astoria"
                className="flex-1 h-[40px] px-3 text-white text-sm focus:outline-none"
              />
              <button className="w-[45px] bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center">
                <Search className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* ACCOUNT */}
            <div className="flex items-center gap-6 text-sm">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 text-left"
                >
                  <div className="text-xs">Hello</div>
                  <div className="font-semibold">Logout</div>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 text-left"
                >
                  <div className="text-xs">Hello, sign in</div>
                  <div className="font-semibold">Account</div>
                </button>
              )}

              {/* CART */}
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center hover:outline hover:outline-1 hover:outline-white px-2 py-1"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-4 bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="ml-1 font-semibold">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== SUB NAV ===================== */}
      <div className="bg-[#232f3e] text-white text-sm">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[40px] gap-6">
            <button className="font-semibold hover:underline">All</button>
            <button className="hover:underline">Today's Deals</button>
            <button className="hover:underline">Categories</button>
            <button className="hover:underline">Best Sellers</button>
            <button className="hover:underline">New Arrivals</button>

            {/* MODE SWITCH */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setCurrentMode("marketplace")}
                className={`px-3 py-1 border ${
                  currentMode === "marketplace"
                    ? "bg-white text-black"
                    : "border-white/30"
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setCurrentMode("auction")}
                className={`px-3 py-1 border ${
                  currentMode === "auction"
                    ? "bg-white text-black"
                    : "border-white/30"
                }`}
              >
                Auction
              </button>
            </div>
          </div>
        </div>
      </div>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
