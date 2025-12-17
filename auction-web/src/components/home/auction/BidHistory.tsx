const BidHistory = ({ bids }: { bids: any[] }) => {
  if (!bids.length) {
    return <div className="text-sm text-gray-500">No bids yet</div>;
  }

  return (
    <table className="w-full text-sm border mt-2">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Bid</th>
          <th className="p-2 text-left">Time</th>
        </tr>
      </thead>
      <tbody>
        {bids.map((b, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">CAD ${b.bid_amount}</td>
            <td className="p-2">
              {new Date(b.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BidHistory;
