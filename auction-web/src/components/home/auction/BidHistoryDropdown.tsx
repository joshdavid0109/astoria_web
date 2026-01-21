import { useState } from "react";
import { ChevronDown } from "lucide-react";

const BidHistoryDropdown = ({ bids }: { bids: any[] }) => {
  const [open, setOpen] = useState(false);

  function formatBidDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
    }


  return (
    <div className="border-t mt-4 pt-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        My bid history ({bids.length})
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {bids
            .sort((a, b) => b.bid_amount - a.bid_amount)
            .map((b) => (
                <div
                key={b.bid_id}
                className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2"
                >
                <span className="text-gray-500">
                    {formatBidDate(b.created_at)}
                </span>

                <span className="font-medium">
                    CAD ${b.bid_amount}
                </span>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BidHistoryDropdown;
