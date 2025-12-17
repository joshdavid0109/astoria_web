import { useState } from "react";
import AuctionCountdown from "./AuctionCountdown";
import { placeBid } from "../../../services/auctionService";

const BidBox = ({ auction }: { auction: any }) => {
  const [amount, setAmount] = useState<number>(
    auction.current_bid || auction.start_price
  );

  const ended = new Date(auction.end_time).getTime() <= Date.now();

  const submitBid = async () => {
    try {
      await placeBid(auction.auction_id, amount);
      alert("Bid placed!");
    } catch {
      alert("Bid failed");
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 text-sm">
      <div className="text-xl font-semibold mb-1">
        CAD ${auction.current_bid || auction.start_price}
      </div>

      <div className="mb-2">
        <AuctionCountdown endTime={auction.end_time} />
      </div>

      <input
        type="number"
        value={amount}
        min={auction.current_bid || auction.start_price}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border px-2 py-1 mb-3"
        disabled={ended}
      />

      <button
        disabled={ended}
        onClick={submitBid}
        className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full disabled:opacity-50"
      >
        Place Bid
      </button>

      <div className="mt-3 text-xs text-gray-600">
        Seller: {auction.seller?.email || "Verified Seller"}
      </div>
    </div>
  );
};

export default BidBox;
