import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  fetchCartForPage,
  fetchBidsForPage,
} from "../services/cartService";
import BidHistoryDropdown from "../components/home/auction/BidHistoryDropdown";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMode } = useAppContext();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [bidItems, setBidItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isMarketplace = currentMode === "marketplace";

  const groupedAuctions = useMemo(() => {
  const map: Record<number, any> = {};

  bidItems.forEach((bid) => {
    const auctionId = bid.auction?.auction_id;
    if (!auctionId) return;

    if (!map[auctionId]) {
      map[auctionId] = {
        auction: bid.auction,
        bids: [],
      };
    }

    map[auctionId].bids.push(bid);
  });

  return Object.values(map);
}, [bidItems]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMode]);

  async function loadData() {
    try {
      setLoading(true);

      if (isMarketplace) {
        setBidItems([]); // 🔑 prevent stale auction data
        const data = await fetchCartForPage();
        setCartItems(data);
      } else {
        setCartItems([]); // 🔑 prevent stale cart data
        const data = await fetchBidsForPage();
        setBidItems(data);
      }
    } catch (err: any) {
      alert(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= CALCULATIONS ================= */

  const cartSubtotal = cartItems.reduce(
    (sum, i) => sum + i.quantity * (i.product?.price || 0),
    0
  );

  /* ================= RENDER ================= */

  return (
    <main className="bg-[#EAEDED] min-h-screen mt-25">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-semibold mb-6">
          {isMarketplace ? "Shopping Cart" : "My Bids"}
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="bg-white p-6 rounded">
            Loading…
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          (isMarketplace ? cartItems.length === 0 : bidItems.length === 0) && (
            <div className="bg-white p-8 rounded text-center">
              <h2 className="text-lg font-semibold mb-2">
                {isMarketplace
                  ? "Your cart is empty"
                  : "You have no active bids"}
              </h2>

              <p className="text-gray-600 mb-4">
                {isMarketplace
                  ? "Items you add will appear here."
                  : "Auctions you bid on will appear here."}
              </p>

              <button
                onClick={() =>
                  navigate(isMarketplace ? "/" : "/auctions")
                }
                className="bg-[#FFD814] hover:bg-[#F7CA00] px-6 py-2 rounded-full"
              >
                {isMarketplace
                  ? "Continue Shopping"
                  : "Browse Auctions"}
              </button>
            </div>
          )}

        {/* CONTENT */}
        {!loading &&
          (isMarketplace ? cartItems.length > 0 : bidItems.length > 0) && (
             <div className="lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 mb-10">

                {/* MARKETPLACE — CART ITEMS */}
                {isMarketplace &&
                  cartItems.map((item) => (
                    <div
                      key={item.cart_id}
                      className="flex gap-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        className="w-24 h-24 object-contain"
                        alt={item.product?.title}
                      />

                      <div className="flex-1">
                        <div className="font-medium">
                          {item.product?.title}
                        </div>

                        <div className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </div>
                      </div>

                      <div className="font-semibold">
                        CAD ${item.product?.price * item.quantity}
                      </div>
                    </div>
                  ))}

                {/* AUCTION — BIDS */}
                {!isMarketplace &&
                    groupedAuctions.map(({ auction, bids }) => {
                        const highestBid = Math.max(...bids.map((b: any) => b.bid_amount));

                        return (
                        <div
                            key={auction.auction_id}
                            className="bg-white rounded-xl shadow-sm p-5"
                        >
                            {/* HEADER */}
                            <div className="flex gap-4 items-start">
                            <img
                                src={auction.product?.images?.[0]?.url || "/placeholder.png"}
                                className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold">
                                {auction.product?.title}
                                </h3>

                                <div className="text-sm text-gray-600 mt-1">
                                Highest bid:{" "}
                                <span className="font-semibold text-black">
                                    CAD ${highestBid}
                                </span>
                                </div>
                            </div>

                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                Active
                            </span>
                            </div>

                            {/* DROPDOWN: BID HISTORY */}
                            <BidHistoryDropdown bids={bids} />
                        </div>
                        );
                    })}


              </div>

              {/* RIGHT COLUMN — SUMMARY (MARKETPLACE ONLY) */}
              {isMarketplace && (
                <div className="lg:col-span-4">
                <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                    {/* TITLE */}
                    <h3 className="text-lg font-semibold mb-4">
                    Order Summary
                    </h3>

                    {/* PRICE BREAKDOWN */}
                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>CAD ${cartSubtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600 font-medium">
                        FREE
                        </span>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>CAD ${cartSubtotal}</span>
                    </div>
                    </div>

                    {/* CHECKOUT CTA */}
                    <button
                    className="
                        mt-5 w-full
                        bg-gradient-to-r from-[#FFA41C] to-[#FF8F00]
                        hover:from-[#F7CA00] hover:to-[#F7CA00]
                        text-white
                        py-3
                        rounded-full
                        font-semibold
                        tracking-wide
                        shadow-md
                        hover:shadow-lg
                        transition
                        active:scale-[0.98]
                    "
                    >
                    Proceed to Checkout
                    </button>

                    {/* TRUST / INFO */}
                    <div className="mt-4 text-xs text-gray-500 text-center">
                    🔒 Secure checkout • No hidden fees
                    </div>
                </div>
                </div>

              )}
            </div>
          )}
      </div>
    </main>
  );
};

export default CartPage;
