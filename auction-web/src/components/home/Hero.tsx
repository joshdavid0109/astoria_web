import React, { useEffect, useState } from "react";
import type { Banner } from "../../services/homeService"
import { useNavigate } from "react-router-dom";

interface AmazonHeroProps {
  banners: Banner[];
}

const AmazonHero: React.FC<AmazonHeroProps> = ({ banners }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // reset index when banners change
  useEffect(() => {
    setIndex(0);
  }, [banners]);

  // auto-rotate
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [banners]);

  // 🛡️ GUARD: no banners yet
  if (!banners || banners.length === 0) {
    return (
      <div className="bg-[#EAEDED]">
        <div className="w-full h-[300px] bg-gray-300 animate-pulse" />
      </div>
    );
  }

  const active = banners[index];


  return (
    <div className="relative bg-[#EAEDED]">
      {/* HERO IMAGE */}
      <div
        className="w-full h-[300px] bg-center bg-cover cursor-pointer"
        style={{
          backgroundImage: `url(${active?.image_url || "/placeholder-banner.jpg"})`,
        }}
        onClick={() => {
          if (active?.link_url) navigate(active.link_url);
        }}
      />

      {/* FLOATING CARD GRID */}
      <div className="relative max-w-[1500px] mx-auto px-4 -mt-[140px] z-10">
        <div className="grid grid-cols-4 gap-5">
          <AmazonInfoCard title="Shop by category" />
          <AmazonInfoCard title="Flash Deals" subtitle="Limited time offers" />
          <AmazonInfoCard title="Best Sellers" subtitle="Most popular today" />
          <AmazonInfoCard title="Auctions" subtitle="Bid before time runs out" />
        </div>
      </div>
    </div>
  );
};

export default AmazonHero;

/* ---------------------------------- */

const AmazonInfoCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="bg-white border border-gray-300 p-4 h-[360px] flex flex-col">
      <h2 className="text-lg font-bold leading-tight">
        {title}
        {subtitle && (
          <span className="block font-normal text-sm mt-1">{subtitle}</span>
        )}
      </h2>

      <div className="flex-1 bg-gray-100 mt-3" />

      <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
        See more
      </button>
    </div>
  );
};
