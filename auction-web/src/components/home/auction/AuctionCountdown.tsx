import { useEffect, useState } from "react";

const AuctionCountdown = ({ endTime }: { endTime: string }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTime("Auction ended");
        clearInterval(t);
        return;
      }

      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTime(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(t);
  }, [endTime]);

  return <span className="text-red-600 font-semibold">{time}</span>;
};

export default AuctionCountdown;
