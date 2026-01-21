import { useEffect, useState } from "react";
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

  // 🔁 Initial load
  useEffect(() => {
    if (!id) return;

    fetchAuctionById(id).then(setAuction);
    fetchAuctionBids(id).then(setBids);
  }, [id]);

  // 🔴 REALTIME: auction price updates
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

  // 🔴 REALTIME: new bids
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

  if (!auction) {
    return <div className="py-20 text-center">Loading auction…</div>;
  }

  const mainImage =
    auction.product?.images?.[0]?.url || "/placeholder.png";

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <Breadcrumbs category={auction.product?.category} />

        <div className="bg-white border rounded-md p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            {/* CENTER — INFO */}
<div className="lg:col-span-5">
  <ProductInfo product={auction.product} />
</div>

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

        <div className="bg-white border rounded-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">Bid History</h2>
          <BidHistory bids={bids} />
        </div>
      </div>
    </main>
  );
};

export default AuctionDetailsPage;
