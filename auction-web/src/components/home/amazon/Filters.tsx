import StarRating from "./StarRating";

interface Props {
  setMinRating: (n?: number) => void;
  setPrice: (min?: number, max?: number) => void;
}

const Filters: React.FC<Props> = ({ setMinRating, setPrice }) => {
  return (
    <aside
      className="
        bg-white
        border border-gray-300
        rounded-md
        p-4
        text-sm
        w-full
        md:w-[260px]
      "
    >
      {/* ================= RATING ================= */}
      <div>
        <h3 className="font-semibold mb-3 text-base md:text-sm">
          Customer Reviews
        </h3>

        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className="
                flex items-center gap-2
                w-full
                px-2 py-2
                rounded
                hover:bg-gray-100
                transition
              "
            >
              <StarRating rating={r} />
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= PRICE ================= */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-base md:text-sm">
          Price
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => setPrice(undefined, 25)}
            className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            Under $25
          </button>

          <button
            onClick={() => setPrice(25, 50)}
            className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            $25 to $50
          </button>

          <button
            onClick={() => setPrice(50, 100)}
            className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            $50 to $100
          </button>

          <button
            onClick={() => setPrice(100)}
            className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition"
          >
            $100 & Above
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
