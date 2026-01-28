import React, { useState, useEffect } from "react";
import {
  Heart,
  Clock,
  Minus,
  Plus,
  Users,
  X,
  Check,
  Shield,
  Star,
} from "lucide-react";
import type { AuctionItem } from "../types/types";

interface ProductDetailProps {
  item: AuctionItem;
  onBack: () => void;
  isInWatchList: boolean;
  onToggleWatchList: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  item,
  onBack,
  isInWatchList,
  onToggleWatchList,
}) => {
  const minIncrement = item.minBidIncrement ?? 1;
  const [bidAmount, setBidAmount] = useState(item.currentBid + minIncrement);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const getTimeRemaining = (end: Date) => {
    const diff = end.getTime() - currentTime.getTime();
    if (diff <= 0) return "Ended";
    const m = Math.floor((diff / 1000) % 60);
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* ================= MOBILE ================= */}
      <div className="lg:hidden">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={item.image ?? ""}
            alt={item.title}
            className="w-full h-72 object-cover"
          />

          {/* PRICE + TIMER */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-white px-4 py-2 rounded-xl shadow text-green-600 font-bold text-lg">
              PHP {item.currentBid}
            </div>
            <div className="bg-black/80 text-white px-3 py-2 rounded-xl flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {item.endTime ? getTimeRemaining(item.endTime) : "Ended"}
            </div>
          </div>
        </div>

        {/* TITLE + ACTIONS */}
        <div className="p-4 bg-white">
          <div className="flex justify-between items-start">
            <h1 className="text-lg font-semibold">{item.title}</h1>
            <button
              onClick={() => onToggleWatchList(item.id)}
              className={`p-2 rounded-full ${
                isInWatchList ? "bg-red-500 text-white" : "bg-gray-100"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isInWatchList ? "fill-current" : ""}`}
              />
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            {item.bidCount} bids · Next bid: PHP{" "}
            {item.currentBid + minIncrement}
          </p>
        </div>

        {/* BID INPUT */}
        <div className="p-4 bg-white mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setBidAmount(
                  Math.max(item.currentBid + minIncrement, bidAmount - minIncrement)
                )
              }
              className="p-3 bg-gray-100 rounded-xl"
            >
              <Minus />
            </button>

            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="flex-1 text-center border rounded-xl py-3 font-bold text-lg"
            />

            <button
              onClick={() => setBidAmount(bidAmount + minIncrement)}
              className="p-3 bg-gray-100 rounded-xl"
            >
              <Plus />
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE SECTIONS */}
        {[
          { key: "details", label: "Item Details" },
          { key: "seller", label: "Seller Info" },
          { key: "shipping", label: "Shipping" },
        ].map((sec) => (
          <div key={sec.key} className="mt-2 bg-white">
            <button
              onClick={() =>
                setExpanded(expanded === sec.key ? null : sec.key)
              }
              className="w-full px-4 py-4 flex justify-between font-semibold"
            >
              {sec.label}
              <span>{expanded === sec.key ? "−" : "+"}</span>
            </button>

            {expanded === sec.key && (
              <div className="px-4 pb-4 text-sm text-gray-600">
                {sec.key === "details" && item.description}
                {sec.key === "seller" && (
                  <div className="flex items-center gap-3">
                    <Star className="text-yellow-400 fill-current" />
                    <span>4.8 Seller Rating · Verified</span>
                  </div>
                )}
                {sec.key === "shipping" && item.shipping}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden lg:block">
        {/* keep your existing desktop layout here */}
      </div>

      {/* ================= STICKY BID CTA ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500">Your bid</div>
          <div className="font-bold text-lg text-green-600">
            PHP {bidAmount}
          </div>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
        >
          Place Bid
        </button>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">Confirm Bid</h2>
              <button onClick={() => setShowPaymentModal(false)}>
                <X />
              </button>
            </div>

            <div className="mb-4 font-bold text-xl text-green-600">
              PHP {bidAmount}
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <Check /> Confirm Bid
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
