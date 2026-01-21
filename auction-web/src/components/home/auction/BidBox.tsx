import { useState } from "react";
import AuctionCountdown from "./AuctionCountdown";
import { placeBid } from "../../../services/auctionService";

const BidBox = ({
  auction,
  onBidPlaced,
}: {
  auction: any;
  onBidPlaced?: () => void;
}) => {

  const startingPrice = auction.current_price ?? auction.start_price;
  const currentPrice = auction.current_price ?? auction.start_price;
  const minBid = currentPrice + 1;


  const [amount, setAmount] = useState<number>(startingPrice);

  const ended = new Date(auction.end_time).getTime() <= Date.now();

  const [authError, setAuthError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);



  const submitBid = async () => {
    if (amount <= currentPrice) {
      setValidationError(
        `Bid must be higher than CAD $${currentPrice}`
      );
      return;
    }

    try {
      setSubmitting(true);
      setAuthError(false);
      setValidationError(null);

      await placeBid(auction.auction_id, amount);

      onBidPlaced?.();
    } catch (err: any) {
      console.error(err);

      if (
        err?.message?.toLowerCase().includes("log") ||
        err?.message?.toLowerCase().includes("auth")
      ) {
        setAuthError(true);
      }
    } finally {
      setSubmitting(false);
    }
  };





  return (
    <div className="border border-gray-300 rounded p-4 text-sm">
      {/* CURRENT PRICE */}
      <div className="text-xl font-semibold mb-1">
        CAD ${auction.current_price ?? auction.start_price}
      </div>

      {/* COUNTDOWN */}
      <div className="mb-2">
        <AuctionCountdown endTime={auction.end_time} />
      </div>

      {/* BID INPUT */}
      <input
        type="number"
        value={amount}
        min={minBid}
        onChange={(e) => {
          const val = Number(e.target.value);
          setAmount(val);

          if (val <= currentPrice) {
            setValidationError(
              `Bid must be higher than CAD $${currentPrice}`
            );
          } else {
            setValidationError(null);
          }
        }}
        className="
          w-full border px-2 py-1 mb-2
          focus:outline-none focus:ring-2 focus:ring-orange-400
        "
        disabled={ended}
      />
      {validationError && (
      <div className="text-xs text-red-600 mb-2">
        {validationError}
      </div>
    )}



      {/* SUBMIT */}
      <button
        disabled={ended || submitting}
        onClick={submitBid}
        className="
          w-full
          bg-[#FFA41C] hover:bg-[#FA8900]
          py-2 rounded-full
          font-medium
          disabled:opacity-50
          transition
        "
      >
        {submitting ? "Placing bid…" : "Place Bid"}
      </button>


      {authError && (
        <div className="mt-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm">
          <div className="font-medium text-gray-900 mb-1">
            Log in to continue bidding
          </div>
          <p className="text-gray-600 text-xs mb-2">
            You must be signed in to place a bid on this auction.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Sign in
          </button>
        </div>
      )}


      <div className="mt-3 text-xs text-gray-600">
        Seller: Verified Seller
      </div>
    </div>
  );
};

export default BidBox;
