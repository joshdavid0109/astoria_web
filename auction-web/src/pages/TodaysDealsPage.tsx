import { useEffect, useState } from "react";
import ProductRow from "../components/home/amazon/ProductRow";
import { fetchFlashDeals } from "../services/homeService";

const TodaysDealsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchFlashDeals(48);
      setItems(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="max-w-[1500px] mx-auto px-4 py-10 mt-25">
      <h1 className="text-2xl font-semibold mb-6">Today’s Deals</h1>

      <ProductRow
        title="Limited-time deals"
        items={items}
        type="flash"
      />
    </main>
  );
};

export default TodaysDealsPage;
