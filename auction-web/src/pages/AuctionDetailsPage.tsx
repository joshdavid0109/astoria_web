import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import BidBox from "../components/home/auction/BidBox";
import BidHistory from "../components/home/auction/BidHistory";
import {
  fetchAuctionById,
  fetchAuctionBids,
} from "../services/auctionService";

const AuctionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchAuctionById(id).then(setAuction);
    fetchAuctionBids(id).then(setBids);

  }, [id]);

  console.log(auction)

  if (!auction) {
    return <div className="py-20 text-center">Loading auction…</div>;
  }

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-4">

        <Breadcrumbs category={auction.product?.category} />

        {/* MAIN CARD */}
        <div className="bg-white border border-gray-200 rounded-md p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT — IMAGE */}
          <div className="lg:col-span-4">
            <div className="bg-gray-100 rounded-md flex items-center justify-center h-[420px] overflow-hidden">
              <img
                src={auction.product?.image_url}
                alt={auction.product?.title}
                className="object-contain max-h-[380px] hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* CENTER — INFO */}
          <div className="lg:col-span-5">
            <h1 className="text-xl font-semibold leading-snug">
              {auction.product?.title}
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              Condition: <span className="font-medium">{auction.product?.status}</span>
            </p>

            <div className="mt-4 text-sm text-gray-700 leading-relaxed">
              {auction.product?.description}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">About this item</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Authentic item</li>
                <li>Ships from Canada</li>
                <li>Trusted seller</li>
              </ul>
            </div>
          </div>

          {/* RIGHT — BID BOX */}
          <div className="lg:col-span-3">
            <BidBox auction={auction} />
          </div>
        </div>

        {/* BID HISTORY */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">Bid History</h2>
          <BidHistory bids={bids} />
        </div>

      </div>
    </main>
  );
};

export default AuctionDetailsPage;
