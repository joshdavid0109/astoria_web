import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";
import CartModal from "./CartModal";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const {
    cartCount,
    isLoggedIn,
    logout,
    currentMode,
    setCurrentMode,
    searchQuery,
    setSearchQuery,
  } = useAppContext();

  /* ================= STATE ================= */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  const [isDesktop, setIsDesktop] = useState(
  typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );


  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

    /* ================= HELPERS ================= */
    const isActive = (path: string) => {
      if (path === "/") return pathname === "/";
      return pathname.startsWith(path);
  };

  /* ================= MOBILE SCROLL HIDE ONLY ================= */
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (window.innerWidth >= 768) return; // 🚫 desktop unaffected

      const y = window.scrollY;

      if (y < 80) {
        setMobileVisible(true);
      } else if (y > lastScrollY.current) {
        setMobileVisible(false);
      } else {
        setMobileVisible(true);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const hideHeaderNow = () => {
      // mobile
      setMobileVisible(false);
    };

    window.addEventListener("hide-header", hideHeaderNow);
    return () => window.removeEventListener("hide-header", hideHeaderNow);
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const q = encodeURIComponent(searchQuery.trim());
    navigate(
      currentMode === "auction"
        ? `/auctions?search=${q}`
        : `/products?search=${q}`
    );
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  return (
    <>
      {/* =====================================================
          SINGLE FIXED HEADER CONTAINER (IMPORTANT)
      ====================================================== */}
      <div
        className={`
          fixed top-0 left-0 w-full z-[99999]
          transition-transform duration-300
          ${mobileVisible ? "translate-y-0" : "-translate-y-full"}
          md:translate-y-0
        `}
      >
        {/* ================= MOBILE HEADER ================= */}
        <header className="bg-[#131921] text-white md:hidden">
          {/* top row */}
          <div className="flex items-center justify-between px-4 h-[56px]">
            <button onClick={() => {
                  navigate("/")
                  closeMobileMenu();
                }
              }
            >
              <img
                src="https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/icons/full_astoria-whitenobg.png"
                alt="Astoria"
                className="h-9"
              />
            </button>

            <button onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* search */}
          <div className="px-4 pb-3">
            <div className="flex bg-[#bababa] rounded">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search Astoria"
                className="flex-1 h-[40px] px-3 text-black text-sm outline-none"
              />
              <button
                onClick={handleSearch}
                className="w-[45px] bg-[#febd69] flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* mobile menu */}
          {mobileMenuOpen && (
            <div className="bg-[#232f3e] px-4 py-4 space-y-4">
              {[
                { label: "All", path: "/" },
                { label: "Today's Deals", path: "/todays-deals" },
                { label: "Categories", path: "/categories" },
                { label: "Best Sellers", path: "/best-sellers" },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    closeMobileMenu();
                  }}
                  className={`block w-full text-left font-semibold ${
                    isActive(item.path) ? "text-yellow-400" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setCurrentMode("marketplace")
                    closeMobileMenu();
                  }}
                  className={`flex-1 py-2 border ${
                    currentMode === "marketplace"
                      ? "bg-white text-black"
                      : "border-white/30"
                  }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => { 
                    setCurrentMode("auction")
                    closeMobileMenu();
                  }}
                  className={`flex-1 py-2 border ${
                    currentMode === "auction"
                      ? "bg-white text-black"
                      : "border-white/30"
                  }`}
                >
                  Auction
                </button>
              </div>

              <div className="pt-3 border-t border-white/20 space-y-3">
                <button
                  onClick={isLoggedIn ? logout : () => {
                      navigate("/login")
                      closeMobileMenu();
                    }
                  }
                  className="flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {isLoggedIn ? "Logout" : "Account"}
                </button>

                <button
                  onClick={() => {
                      navigate("/cart")
                      closeMobileMenu();
                    }
                  }
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({cartCount})
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ================= DESKTOP HEADER ================= */}
        {isDesktop && (
        <header className="bg-[#131921] text-white  md:block z-[9999]">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="flex items-center h-[60px] gap-6">
              <button onClick={() => navigate("/")}>
                <img
                  src="https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/icons/full_astoria-whitenobg.png"
                  className="h-20"
                />
              </button>

              <div className="flex flex-1 justify-center">
                <div className="flex w-full max-w-[720px] bg-[#bababa] rounded">
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    className="flex-1 h-[40px] px-3 text-black text-sm outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="w-[45px] bg-[#febd69] flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm ml-4">
                <button
                  onClick={isLoggedIn ? logout : () => navigate("/login")}
                  className="flex items-center gap-2 px-2 py-1 hover:outline hover:outline-1"
                >
                  <User className="w-5 h-5" />
                  <div>
                    <div className="text-xs">
                      {isLoggedIn ? "Hello" : "Hello, sign in"}
                    </div>
                    <div className="font-semibold">
                      {isLoggedIn ? "Logout" : "Account"}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="relative flex items-center gap-1 px-2 py-1 hover:outline hover:outline-1"
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
        )}

        {/* ================= DESKTOP SUB NAV ================= */}
        {isDesktop && (
        <div className="bg-[#232f3e] text-white text-sm  md:block">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="flex items-center h-[40px] gap-6">
              {[
                { label: "All", path: "/" },
                { label: "Today's Deals", path: "/todays-deals" },
                { label: "Categories", path: "/categories" },
                { label: "Best Sellers", path: "/best-sellers" },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`font-semibold px-2 py-1 border-b-2 ${
                    isActive(item.path)
                      ? "border-white"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

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
        )}
      </div>
      

      <CartModal isOpen={false} onClose={() => {}} />
    </>
  );
};

export default Header;
