import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SimilarAuctionsDropdown = ({
}: {
  productId?: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t pt-3">
      {/* TOGGLE */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          text-sm font-medium text-blue-600
          hover:underline
        "
      >
        Similar auctions
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* CONTENT */}
      {open && (
        <div className="mt-3 space-y-3">
          {/* PLACEHOLDER ITEMS */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
                flex items-center gap-3
                bg-gray-50 rounded-lg
                p-3
                hover:bg-gray-100
                transition
              "
            >
              <div className="w-14 h-14 bg-white rounded border flex items-center justify-center">
                <img
                  src="/placeholder.png"
                  className="object-contain h-10"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium">
                  Similar Auction Item
                </div>
                <div className="text-xs text-gray-500">
                  Current bid: CAD $120
                </div>
              </div>

              <button className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-full">
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarAuctionsDropdown;
