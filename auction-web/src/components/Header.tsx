import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import CartModal from "./CartModal";
import { useEffect, useRef } from "react";
import { Search, ShoppingCart, User } from "lucide-react";



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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header near top
      if (currentScrollY < 80) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // scrolling down → hide
      if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } 
      // scrolling up → show
      else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


    const handleSearch = () => {
      if (!searchQuery.trim()) return;

      const q = encodeURIComponent(searchQuery.trim());

      if (currentMode === "auction") {
        navigate(`/auctions?search=${q}`);
      } else {
        navigate(`/products?search=${q}`);
      }
    };

    

  return (
    <>
    <div
      className={`
        fixed top-0 left-0 w-full z-50
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* ===================== TOP BAR ===================== */}
      <header className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[60px] gap-6">
            {/* LOGO */}
            <button
              onClick={() => navigate("/")}
              className="hover:outline hover:outline-1 hover:outline-white px-2 py-1"
            >
              <img
                src="https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/icons/full_astoria-whitenobg.png"
                alt="Astoria"
                className="h-20"
              />
            </button>


            {/* SEARCH */}
            <div className="flex flex-1 justify-center">
              <div className="flex w-full max-w-[720px] bg-[#bababa] rounded">              
                 <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search Astoria"
                    className="flex-1 h-[40px] px-3 text-black text-sm focus:outline-none"
                  />
                <button
                  onClick={handleSearch}
                  className="w-[45px] bg-[#febd69] hover:bg-[#f3a847] rounded flex items-center justify-center"
                >
                  <Search className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* ACCOUNT */}
            <div className="flex items-center gap-8 text-sm ml-4">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="
                    flex items-center gap-2
                    hover:outline hover:outline-1 hover:outline-white
                    px-2 py-1
                  "
                >
                  <User className="w-5 h-5 text-white" />
                  <div className="text-left leading-tight">
                    <div className="text-xs">Hello</div>
                    <div className="font-semibold">Logout</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="
                    flex items-center gap-2
                    hover:outline hover:outline-1 hover:outline-white
                    px-2 py-1
                  "
                >
                  <User className="w-5 h-5 text-white" />
                  <div className="text-left leading-tight">
                    <div className="text-xs">Hello, sign in</div>
                    <div className="font-semibold">Account</div>
                  </div>
                </button>
              )}

              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="
                  relative flex items-center gap-1
                  hover:outline hover:outline-1 hover:outline-white
                  px-2 py-1
                "
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-4 bg-orange-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="font-semibold">Cart</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ===================== SUB NAV ===================== */}
      <div className="bg-[#232f3e] text-white text-sm">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[40px] gap-6">
            <button 
              onClick={() => navigate("/")}
              className="font-semibold hover:underline">All</button>
            <button
                onClick={() => navigate("/todays-deals")}
                className="hover:underline">Today's Deals</button>
            <button 
                onClick={() => navigate("/categories")}
                className="hover:underline">Categories</button>
            <button 
              onClick={() => navigate("/best-sellers")}
              className="hover:underline">Best Sellers</button>
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
      </div>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
