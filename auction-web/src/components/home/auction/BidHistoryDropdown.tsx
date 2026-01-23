import { useMemo, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

interface BidHistoryDropdownProps {
  bids: any[];
  onDeleteBid: (bidId: number) => void;
}

const BidHistoryDropdown: React.FC<BidHistoryDropdownProps> = ({
  bids,
  onDeleteBid,
}) => {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  // 🔑 sort once, not every render
  const sortedBids = useMemo(
    () => [...bids].sort((a, b) => b.bid_amount - a.bid_amount),
    [bids]
  );

  async function handleDelete(bidId: number) {
    if (!confirm("Delete this bid? This cannot be undone.")) return;

    try {
      setDeletingId(bidId);
      await onDeleteBid(bidId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="border-t mt-4 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
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
          {sortedBids.map((b) => (
            <div
              key={b.bid_id}
              className="flex items-center justify-between gap-3 text-sm bg-gray-50 rounded px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-gray-500">
                  {formatBidDate(b.created_at)}
                </span>
                <span className="font-medium">
                  CAD ${b.bid_amount}
                </span>
              </div>

              <button
                onClick={() => handleDelete(b.bid_id)}
                disabled={deletingId === b.bid_id}
                className="
                  text-red-600
                  hover:text-red-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                title="Delete bid"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidHistoryDropdown;
