import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuctionRow from "../components/home/auction/AuctionRow";
import { fetchAuctionsByCategory } from "../services/auctionService";

const AuctionCategoryPage = () => {
  const { id } = useParams();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAuctionsByCategory(Number(id));
      setAuctions(data || []);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <main className="container mx-auto px-6 py-10">
      <AuctionRow
        title="Auctions in this category"
        auctions={auctions}
        loading={loading}
      />
    </main>
  );
};

export default AuctionCategoryPage;
