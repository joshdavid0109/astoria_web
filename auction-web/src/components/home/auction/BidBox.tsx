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

  const [amount, setAmount] = useState<number>(startingPrice);

  const ended = new Date(auction.end_time).getTime() <= Date.now();

  const submitBid = async () => {
    if (amount <= auction.current_price) {
      alert("Bid must be higher than current price");
      return;
    }

    try {
      await placeBid(auction.auction_id, amount);
      onBidPlaced?.();
      alert("Bid placed!");
      // optional: refresh page or re-fetch auction
    } catch (err) {
      console.error(err);
      alert("Bid failed");
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
        min={(auction.current_price ?? auction.start_price) + 1}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border px-2 py-1 mb-3"
        disabled={ended}
      />

      {/* SUBMIT */}
      <button
        disabled={ended}
        onClick={submitBid}
        className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full disabled:opacity-50"
      >
        Place Bid
      </button>

      <div className="mt-3 text-xs text-gray-600">
        Seller: Verified Seller
      </div>
    </div>
  );
};

export default BidBox;
