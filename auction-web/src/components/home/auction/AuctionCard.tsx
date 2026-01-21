import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }: { auction: any }) => {
  const navigate = useNavigate();

  const timeLeft = Math.max(
    0,
    Math.floor(
      (new Date(auction.end_time).getTime() - Date.now()) / 1000 / 60
    )
  );

  return (
    <div
      onClick={() => navigate(`/auction/${auction.auction_id}`)}
      className="
        min-w-[220px] bg-white border rounded
        cursor-pointer hover:shadow-md transition
        p-3
      "
    >
      <div className="h-[180px] flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={auction.product?.image_url}
          alt={auction.product?.title}
          className="object-contain max-h-[160px] hover:scale-105 transition-transform"
        />
      </div>

      <div className="mt-2 text-sm line-clamp-2 hover:text-[#C7511F]">
        {auction.product?.title}
      </div>

      <div className="mt-1 text-sm">
        <span className="font-semibold">
          CAD ${auction.current_price || auction.start_price}
        </span>
      </div>

      <div className="text-xs text-gray-600 mt-1">
        ⏳ {timeLeft} min left
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/auction/${auction.auction_id}`);
        }}
        className="
          mt-2 w-full bg-[#FFA41C] hover:bg-[#FA8900]
          py-1 rounded-full text-sm
        "
      >
        Bid Now
      </button>
    </div>
  );
};

export default AuctionCard;
