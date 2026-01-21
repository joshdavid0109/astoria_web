import { useNavigate } from "react-router-dom";
import AuctionCountdown from "../../home/auction/AuctionCountdown";

const AuctionRow = ({
  title,
  auctions,
  loading,
}: {
  title: string;
  auctions: any[];
  loading?: boolean;
}) => {

  const navigate = useNavigate();

  if (!auctions?.length) {
    return (
      <section className="bg-white rounded-lg p-5 m-10 text-sm text-gray-500">
        No auctions available.
      </section>
    );
  }

  if (loading) {
  return (
    <section className="bg-white rounded-lg p-5 m-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-w-[220px] h-[260px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}


  return (
    <section className="bg-white max-w-[1470px] mx-auto p-5 px- mt-">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>

          {/* Urgency tag for Ending Soon */}
          {title.toLowerCase().includes("ending") && (
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
              LIVE
            </span>
          )}
        </div>

        <button className="text-sm text-blue-600 hover:underline">
          See more
        </button>
      </div>

      {/* ROW */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {auctions.map((a) => (
          <div
            key={a.auction_id}
            onClick={() => navigate(`/auction/${a.auction_id}`)}
            className="
              min-w-[220px]
              cursor-pointer
              rounded-lg
              p-3
              bg-white
              hover:shadow-md transition
            "
          >
            {/* IMAGE */}
            <div className="relative h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden rounded-md">
              <img
                src={
                  a.product?.images?.[0]?.url ||
                  "/placeholder.png"
                }
                alt={a.product?.title}
                className="object-contain max-h-[160px] transition-transform duration-200 hover:scale-105"
              />

              {/* COUNTDOWN BADGE */}
              <div className="absolute bottom-2 left-2 bg-white/90 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                <AuctionCountdown endTime={a.end_time} />
              </div>
            </div>

            {/* TITLE */}
            <div className="text-sm mt-2 line-clamp-2 hover:text-orange-600">
              {a.product?.title}
            </div>

            {/* CURRENT BID */}
            <div className="mt-1 text-sm font-semibold">
              CAD ${a.current_price || a.start_price}
            </div>

            {/* META */}
            {a.bid_count !== undefined && (
              <div className="text-xs text-gray-500 mt-0.5">
                {a.bid_count} bids
              </div>
            )}

            {/* CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/auction/${a.auction_id}`);
              }}
              className="
                mt-2 w-full
                bg-[#FFA41C] hover:bg-[#FA8900]
                py-1.5 rounded-full text-sm font-medium
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
