import { Search, SlidersHorizontal, MapPin, ChevronDown } from "lucide-react";

interface PremiumFilterBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  categories: string[]; // or your actual category type
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;

  minPrice: number | string;
  maxPrice: number | string;
  setMinPrice: React.Dispatch<React.SetStateAction<number | string>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | string>>;

  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

const PremiumFilterBar: React.FC<PremiumFilterBarProps> = ({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  sort,
  setSort,
}) => {
  return (
    <div
      className="
        sticky top-20 z-[200]
        bg-white/70 backdrop-blur-xl
        rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        border border-white/40
        px-6 py-4
        flex items-center gap-4
        w-full
      "
    >
      {/* Search Bar */}
      <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl px-4 py-2 shadow-sm transition">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full bg-transparent outline-none text-gray-700"
        />
      </div>

      {/* Filter Icon */}
      <button className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition">
        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
      </button>

      {/* Category Select */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition text-gray-700 font-medium">
        <span>{selectedCategory || "All Categories"}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* City Placeholder */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition text-gray-700 font-medium">
        <MapPin className="w-5 h-5 text-gray-500" />
        <span>All Cities</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Min Price */}
      <input
        type="number"
        placeholder="Min ₱"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="w-24 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm outline-none text-gray-700"
      />

      {/* Max Price */}
      <input
        type="number"
        placeholder="Max ₱"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="w-24 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm outline-none text-gray-700"
      />

      {/* Sort */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition text-gray-700 font-medium">
        <span>{sort || "Recommended"}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PremiumFilterBar;
