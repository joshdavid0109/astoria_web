import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { fetchAuctionsByCategory } from "../services/auctionService";
import { fetchProductsByCategory } from "../services/marketplaceService";

const CategoryPage: React.FC = () => {
  const { name } = useParams();
  const { currentMode } = useAppContext();

  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [sortValue, setSortValue] = useState("best_match");

  // Filters
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [condition, setCondition] = useState("all");

  const [filterOpen, setFilterOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);


    useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
        const currentY = window.scrollY;

        // collapse when scrolling down
        if (currentY > lastY + 10) {
        setCollapsed(true);
        }

        // expand when scrolling up
        if (currentY < lastY - 10) {
        setCollapsed(false);
        }

        lastY = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    }, []);


  useEffect(() => {
    async function load() {
      const data =
        currentMode === "auction"
          ? await fetchAuctionsByCategory(name || "")
          : await fetchProductsByCategory(name || "");

      setItems(data);
      setFiltered(data);
    }
    load();
  }, [name, currentMode]);

  // Apply filters & sorting
  useEffect(() => {
    let temp = [...items];

    const getPrice = (it: any) => it.current_price || it.price || 0;

    temp = temp.filter((it) => {
      const p = getPrice(it);
      if (priceMin && p < +priceMin) return false;
      if (priceMax && p > +priceMax) return false;
      return true;
    });

    if (currentMode !== "auction" && condition !== "all") {
      temp = temp.filter((it) => it.condition === condition);
    }

    switch (sortValue) {
      case "price_low":
        temp.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price_high":
        temp.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "newest":
        temp.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "ending_soon":
        if (currentMode === "auction") {
          temp.sort(
            (a, b) =>
              new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
          );
        }
        break;
    }

    setFiltered(temp);
  }, [items, priceMin, priceMax, condition, sortValue]);


  // ---------------------------------------------------------
  // 🔥 SUPER PREMIUM PRODUCT CARD
  // ---------------------------------------------------------
  const ItemCard = ({ item }: { item: any }) => {
    const product = item.product || item;
    const img =
      product.images?.[0]?.url || product.image_url || "/placeholder.png";

    return (
      <div
        className="
        bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
        hover:-translate-y-1 transition-all duration-300 border border-gray-100
        group cursor-pointer relative
      "
      >
        {/* Image Section */}
        <div className="relative h-60 w-full overflow-hidden bg-gray-50">
          <img
            src={img}
            className="
              w-full h-full object-cover transition duration-500 
              group-hover:scale-110 group-hover:rotate-1
            "
          />

          {/* Luxury top gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>

          {/* Premium Tag Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {currentMode === "auction" && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-red-500 text-white shadow">
                Ending Soon
              </span>
            )}

            {product.condition && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/80 backdrop-blur text-gray-700 shadow">
                {product.condition}
              </span>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-3 text-2xl font-bold text-orange-600">
            ₱{item.current_price || item.price}
          </div>

          {/* Auction Timer */}
          {currentMode === "auction" && (
            <div className="text-xs text-red-500 mt-1">
              Ends: {new Date(item.end_time).toLocaleString()}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-5 flex gap-3">
            <button className="flex-1 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
              {currentMode === "auction" ? "Bid Now" : "Add to Cart"}
            </button>
            <button className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100">
              View
            </button>
          </div>
        </div>
      </div>
    );
  };


  // ---------------------------------------------------------
  // 🔥 PREMIUM FILTER SIDEBAR (GLASS + ANIMATION)
  // ---------------------------------------------------------
  const FilterSidebar = () => (
  <aside
    className={`
        col-span-12 md:col-span-3
        bg-white/70 backdrop-blur-xl 
        border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        rounded-3xl p-6 sticky top-24
        transition-all duration-300
        relative z-20   // <-- FIX HERE!!!
        ${collapsed ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100 translate-y-0"}
    `}
    >


    {/* HEADER */}
    <div 
      className="flex items-center justify-between cursor-pointer"
      onClick={() => setFilterOpen(!filterOpen)}
    >
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <span className="text-orange-500">⚙️</span> Filters
      </h2>
      <span className="text-sm text-orange-600">
        {filterOpen ? "Hide" : "Show"}
      </span>
    </div>

    {/* BODY */}
    <div
      className={`transition-all duration-300 space-y-10 ${
        filterOpen
          ? "max-h-[1000px] opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >

      {/* PRICE FILTER */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          💰 Price Range
        </h3>

        <div className="mt-3 flex gap-3">
          <input
            type="number"
            placeholder="Min"
            className="
              w-full rounded-xl p-2 text-sm bg-white border border-gray-200 
              focus:ring-2 focus:ring-orange-400 transition
            "
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="
              w-full rounded-xl p-2 text-sm bg-white border border-gray-200
              focus:ring-2 focus:ring-orange-400 transition
            "
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
      </section>


      {/* CONDITION FILTER (Marketplace Only) */}
      {currentMode === "marketplace" && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            🏷 Condition
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {["all", "new", "used"].map((opt) => (
              <button
                key={opt}
                onClick={() => setCondition(opt)}
                className={`
                  px-4 py-2 rounded-full border text-sm transition
                  ${
                    condition === opt
                      ? "bg-orange-500 text-white border-orange-500 shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }
                `}
              >
                {opt === "all" ? "All Items" : opt === "new" ? "Brand New" : "Used"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* SORT BY (PREMIUM DROPDOWN) */}
        <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            🧭 Sort By
        </h3>

        <div className="relative mt-3">
            {/* DROPDOWN BUTTON */}
            <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="
                w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-md 
                border border-gray-200 shadow-sm flex items-center justify-between
                hover:border-orange-400 hover:shadow-md transition-all
            "
            >
            <div className="flex items-center gap-2 text-slate-700">
                <span className="text-orange-500">
                {
                    {
                    best_match: "✨",
                    price_low: "⬇️",
                    price_high: "⬆️",
                    newest: "🆕",
                    ending_soon: "⏳",
                    }[sortValue]
                }
                </span>
                <span className="font-medium">
                {
                    {
                    best_match: "Best Match",
                    price_low: "Price: Low → High",
                    price_high: "Price: High → Low",
                    newest: "Newest Items",
                    ending_soon: "Ending Soon",
                    }[sortValue]
                }
                </span>
            </div>
            <span className="text-slate-500 text-lg">▾</span>
            </button>

            {/* DROPDOWN MENU */}
            {sortDropdownOpen && (
            <div
                className="
                absolute left-0 right-0 mt-2 z-[9999]
                bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl
                p-2 animate-fadeIn
                "
            >
                {[
                { key: "best_match", label: "Best Match", icon: "✨" },
                { key: "price_low", label: "Price: Low → High", icon: "⬇️" },
                { key: "price_high", label: "Price: High → Low", icon: "⬆️" },
                { key: "newest", label: "Newest Items", icon: "🆕" },
                ...(currentMode === "auction"
                    ? [{ key: "ending_soon", label: "Ending Soon", icon: "⏳" }]
                    : []),
                ].map((opt) => (
                <button
                    key={opt.key}
                    onClick={() => {
                    setSortValue(opt.key);
                    setSortDropdownOpen(false);
                    }}
                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all text-sm

                    ${
                        sortValue === opt.key
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-slate-700 hover:bg-orange-100"
                    }
                    `}
                >
                    <span>{opt.icon}</span>
                    {opt.label}
                </button>
                ))}
            </div>
            )}
        </div>
        </section>

    </div>
  </aside>
);


  return (
    <div className="container mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
        {name}
      </h1>

      <div className="grid grid-cols-12 gap-8 overflow-visible">

        <FilterSidebar />

        {/* Item Grid */}
        <div className="col-span-12 md:col-span-9 z-0">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No items found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filtered.map((item, i) => (
                <ItemCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
