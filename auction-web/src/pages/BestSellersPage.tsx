import { useEffect, useState } from "react";
import ProductRow from "../components/home/amazon/ProductRow";
import { fetchBestSellers } from "../services/homeService";

const BestSellersPage = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchBestSellers(48);
      setItems(data || []);
    }
    load();
  }, []);

  return (
    <main className="max-w-[1500px] mx-auto px-4 py-10 mt-25">
      <h1 className="text-2xl font-semibold mb-6">Best Sellers</h1>

      <ProductRow
        title="Most popular products"
        items={items}
        type="bestseller"
      />
    </main>
  );
};

export default BestSellersPage;
