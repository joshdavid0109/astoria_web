import React, { useEffect, useState } from "react";
import type { Banner } from "../../services/homeService"
import { useNavigate } from "react-router-dom";

interface AmazonHeroProps {
  banners: Banner[];
}

const SUPABASE_BUCKET_URL =
  "https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/collage_images";


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
        className="w-full h-[180px] bg-center bg-cover cursor-pointer"
        style={{
          backgroundImage: `url(${active?.image_url || "/placeholder-banner.jpg"})`,
        }}
        onClick={() => {
          if (active?.link_url) navigate(active.link_url);
        }}
      />

      {/* FLOATING CARD GRID */}
      <div className="relative max-w-[1500px] mx-auto px-4 -mt-[140px] z-10">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="grid grid-cols-4 gap-5">
          <AmazonInfoCard
            title="Shop by category"
            image={`${SUPABASE_BUCKET_URL}/category.png`}
          />

          <AmazonInfoCard
            title="Flash Deals"
            subtitle="Limited time offers"
            image={`${SUPABASE_BUCKET_URL}/flash.png`}
          />

          <AmazonInfoCard
            title="Best Sellers"
            subtitle="Most popular today"
            image={`${SUPABASE_BUCKET_URL}/bestseller.png`}
          />

          <AmazonInfoCard
            title="Auctions"
            subtitle="Bid before time runs out"
            image={`${SUPABASE_BUCKET_URL}/auction.png`}
          />
        </div>

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
  image,
}: {
  title: string;
  subtitle?: string;
  image: string;
}) => {
  return (
    <div className="bg-white border border-gray-300 p-4 h-[360px] flex flex-col">
      {/* TITLE */}
      <h2 className="text-lg font-bold leading-tight">
        {title}
        {subtitle && (
          <span className="block font-normal text-sm mt-1 text-gray-600">
            {subtitle}
          </span>
        )}
      </h2>

      {/* IMAGE */}
      <div className="flex-1 mt-3 flex items-center justify-center bg-gray-50 rounded">
        <img
          src={image}
          alt={title}
          className="max-h-[200px] object-contain"
        />
      </div>

      {/* CTA */}
      <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
        See more
      </button>
    </div>
  );
};

