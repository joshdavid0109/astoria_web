// src/components/home/PremiumProductCard.tsx
import React from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const PremiumProductCard: React.FC<{ product: any; timeLeftText?: (t?: string) => string }> = ({ product, timeLeftText }) => {
  const navigate = useNavigate();
  const { addToCart, placeBid, isLoggedIn, toggleWatchlist, isInWatchlist, currentMode } = useAppContext();
  const isAuction = currentMode === "auction";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group border border-gray-100">
      <div className="relative aspect-[4/3] bg-gray-100">
        <img src={product.image_url || product.image || "/placeholder.png"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {isAuction && product.auction?.end_time && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-xs rounded font-medium">{timeLeftText ? timeLeftText(product.auction.end_time) : "Ends soon"}</div>
        )}

        <button onClick={() => toggleWatchlist(product)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow">
          <Heart className={`w-4 h-4 ${isInWatchlist(product) ? "text-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{product.title}</h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400" />)}
          </div>
          <div>({product.bidCount || product.views || 0})</div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">${product.auction?.current_price ?? product.price}</div>
            {product.originalPrice && <div className="text-sm text-gray-400 line-through">${product.originalPrice}</div>}
          </div>

          <div className="flex flex-col items-end gap-2">
            {isAuction ? (
              <button onClick={() => { if (!isLoggedIn) return navigate("/login"); const amount = (product.auction?.current_price || product.price || 0) + (product.minBidIncrement || 10); if (placeBid(product.auction?.auction_id ?? product.id, amount)) alert(`Bid placed: $${amount}`); }} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">Bid</button>
            ) : (
              <button onClick={() => { if (!isLoggedIn) return navigate("/login"); addToCart(product); alert(`${product.title} added to cart`); }} className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm">Add</button>
            )}
            <button onClick={() => navigate(`/product/${product.product_id || product.id}`)} className="text-xs text-gray-500 underline">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumProductCard;
