import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import BidBox from "../components/home/auction/BidBox";
import BidHistory from "../components/home/auction/BidHistory";
import ProductInfo from "../components/product/ProductInfo";
import {
  fetchAuctionById,
  fetchAuctionBids,
} from "../services/auctionService";
import { supabase } from "../lib/supabaseClient";

const AuctionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);

  // mobile UI state
  const [showSpecs, setShowSpecs] = useState(false);
  const [showBids, setShowBids] = useState(false);

  // sticky bid visibility
  const [showStickyBid, setShowStickyBid] = useState(true);
  const lastScrollY = useRef(0);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (!id) return;
    fetchAuctionById(id).then(setAuction);
    fetchAuctionBids(id).then(setBids);
  }, [id]);

  /* ---------------- REALTIME ---------------- */
  useEffect(() => {
    if (!id) return;

    const auctionChannel = supabase
      .channel(`auction-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auction",
          filter: `auction_id=eq.${id}`,
        },
        (payload) => {
          setAuction((prev: any) =>
            prev ? { ...prev, ...payload.new } : prev
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auctionChannel);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const bidChannel = supabase
      .channel(`bids-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bid",
          filter: `auction_id=eq.${id}`,
        },
        (payload) => {
          setBids((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bidChannel);
    };
  }, [id]);

  /* ---------------- SMART STICKY BEHAVIOR ---------------- */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 120) {
        setShowStickyBid(true);
      } else if (currentY > lastScrollY.current) {
        setShowStickyBid(false);
      } else {
        setShowStickyBid(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!auction) {
    return <div className="py-20 text-center">Loading auction…</div>;
  }

  const mainImage =
    auction.product?.images?.[0]?.url || "/placeholder.png";

  return (
    <main
      className={`
        bg-[#EAEDED]
        pt-[120px]
        ${showBids ? "pb-[50px]" : "pb-[30px]"}
        lg:pt-0
        lg:pb-0
        transition-[padding] duration-300 ease-out
      `}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* ================= DESKTOP BREADCRUMBS ================= */}
        <div className="hidden lg:block">
          <Breadcrumbs category={auction.product?.category} />
        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden space-y-3">
          {/* IMAGE + STATUS */}
          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={mainImage}
              className="object-contain w-full h-72"
            />

            <div className="border-t px-4 py-3 flex justify-between text-sm">
              <div>
                <div className="text-xs text-gray-500">Current Bid</div>
                <div className="font-semibold">
                  ₱{auction.current_price}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Bids</div>
                <div className="font-semibold">{bids.length}</div>
              </div>
            </div>
          </div>

          {/* TITLE + DESCRIPTION */}
          <div className="bg-white rounded-md px-4 py-3 space-y-2">
            <h1 className="text-base font-semibold leading-snug">
              {auction.product?.title}
            </h1>

            {auction.product?.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {auction.product.description}
              </p>
            )}
          </div>

          {/* COLLAPSIBLE SPECS */}
          <div className="bg-white rounded-md">
            <button
              onClick={() => setShowSpecs((v) => !v)}
              className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium"
            >
              Product Details
              <span>{showSpecs ? "−" : "+"}</span>
            </button>

            {showSpecs && (
              <div className="px-4 pb-4">
                <ProductInfo product={auction.product} />
              </div>
            )}
          </div>

          {/* COLLAPSIBLE BID HISTORY */}
          <div className="bg-white rounded-md">
            <button
              onClick={() => setShowBids((v) => !v)}
              className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium"
            >
              Bid History
              <span>{showBids ? "−" : "+"}</span>
            </button>

            {showBids && (
              <div className="px-4 pb-4">
                <BidHistory bids={bids} />
              </div>
            )}
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:grid bg-white border rounded-md p-6 grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <img
              src={mainImage}
              className="object-contain h-[420px] w-full"
            />
          </div>

          <div className="lg:col-span-5">
            <h1 className="text-xl font-semibold">
              {auction.product?.title}
            </h1>
            <ProductInfo product={auction.product} />
          </div>

          <div className="lg:col-span-3">
            <BidBox
              auction={auction}
              onBidPlaced={() => {
                fetchAuctionById(id!).then(setAuction);
                fetchAuctionBids(id!).then(setBids);
              }}
            />
          </div>
        </div>

        {/* DESKTOP BID HISTORY */}
        <div className="hidden lg:block bg-white border rounded-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">
            Bid History
          </h2>
          <BidHistory bids={bids} />
        </div>
      </div>

      {/* ================= MOBILE SMART STICKY BID BOX ================= */}
      <div
        className={`
          lg:hidden fixed bottom-0 left-0 right-0 z-50
          transition-transform duration-300 ease-out
          ${showStickyBid ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="h-6 bg-gradient-to-t from-white to-transparent" />

        <div className="bg-white border-t shadow-lg px-4 py-2">
          <BidBox
            auction={auction}
            onBidPlaced={() => {
              fetchAuctionById(id!).then(setAuction);
              fetchAuctionBids(id!).then(setBids);
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default AuctionDetailsPage;
