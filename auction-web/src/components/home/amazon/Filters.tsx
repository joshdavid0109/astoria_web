import StarRating from "./StarRating";

interface Props {
  setMinRating: (n?: number) => void;
  setPrice: (min?: number, max?: number) => void;
}

const Filters: React.FC<Props> = ({ setMinRating, setPrice }) => {
  return (
    <aside className="w-[260px] bg-white border border-gray-300 p-4 text-sm">
      <h3 className="font-bold mb-3">Customer Reviews</h3>
      {[4, 3, 2].map((r) => (
        <button
          key={r}
          onClick={() => setMinRating(r)}
          className="flex items-center gap-1 hover:text-orange-600 mb-2"
        >
          <StarRating rating={r} /> & Up
        </button>
      ))}

      <h3 className="font-bold mt-4 mb-2">Price</h3>
      <ul className="space-y-1">
        <li onClick={() => setPrice(undefined, 25)} className="cursor-pointer hover:underline">Under $25</li>
        <li onClick={() => setPrice(25, 50)} className="cursor-pointer hover:underline">$25 to $50</li>
        <li onClick={() => setPrice(50, 100)} className="cursor-pointer hover:underline">$50 to $100</li>
        <li onClick={() => setPrice(100)} className="cursor-pointer hover:underline">$100 & Above</li>
      </ul>
    </aside>
  );
};

export default Filters;
