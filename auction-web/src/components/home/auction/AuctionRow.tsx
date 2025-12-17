import { useNavigate } from "react-router-dom";
import AuctionCountdown from "../../home/auction/AuctionCountdown";

const AuctionRow = ({
  title,
  auctions,
}: {
  title: string;
  auctions: any[];
}) => {
  const navigate = useNavigate();

  if (!auctions?.length) return null;

  return (
    <section className="bg-white border rounded-md p-5">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>

        <button className="text-sm text-blue-600 hover:underline">
          See more
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {auctions.map((a) => (
          <div
            key={a.auction_id}
            onClick={() => navigate(`/auction/${a.auction_id}`)}
            className="
              min-w-[200px]
              cursor-pointer
              border rounded
              p-3
              hover:shadow-md transition
            "
          >
            {/* IMAGE */}
            <div className="h-[180px] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
              <img
                src={a.product?.image_url}
                alt={a.product?.title}
                className="object-contain max-h-[160px] hover:scale-105 transition-transform"
              />
            </div>

            {/* TITLE */}
            <div className="text-sm mt-2 line-clamp-2 hover:text-orange-600">
              {a.product?.title}
            </div>

            {/* CURRENT BID */}
            <div className="mt-1 text-sm font-semibold">
              CAD ${a.current_bid || a.start_price}
            </div>

            {/* COUNTDOWN */}
            <div className="mt-1 text-xs text-red-600 font-medium">
              <AuctionCountdown endTime={a.end_time} />
            </div>

            {/* CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/auction/${a.auction_id}`);
              }}
              className="
                mt-2 w-full
                bg-[#FFA41C] hover:bg-[#FA8900]
                py-1 rounded-full text-sm
              "
            >
              Bid Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuctionRow;
