import React, { useEffect, useState } from "react";
import type { Banner } from "../../services/homeService";
import { useNavigate } from "react-router-dom";

interface AmazonHeroProps {
  banners: Banner[];
}

const SUPABASE_BUCKET_URL =
  "https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/collage_images";

const AmazonHero: React.FC<AmazonHeroProps> = ({ banners }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [banners]);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(t);
  }, [banners]);

  if (!banners || banners.length === 0) {
    return (
      <div className="bg-[#EAEDED]">
        <div className="w-full h-[200px] sm:h-[280px] bg-gray-300 animate-pulse" />
      </div>
    );
  }

  const active = banners[index];

  return (
    <section className="relative bg-[#EAEDED]">
      {/* ================= HERO IMAGE ================= */}
      <div
        className="
          w-full
          h-[180px]
          sm:h-[260px]
          lg:h-[250px]
          bg-center
          bg-cover
          cursor-pointer
        "
        style={{
          backgroundImage: `url(${active.image_url || "/placeholder-banner.jpg"})`,
        }}
        onClick={() => active.link_url && navigate(active.link_url)}
      />

      {/* ================= FLOATING CARDS ================= */}
      <div className="relative max-w-[1500px] mx-auto px-4 -mt-16 sm:-mt-24 lg:-mt-32 z-10">
        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
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
    </section>
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
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-lg
        p-4
        flex
        flex-col
        shadow-sm
        hover:shadow-md
        transition

        min-h-[260px]
        sm:min-h-[300px]
        lg:h-[360px]
      "
    >
      <h2 className="text-base sm:text-lg font-bold leading-tight">
        {title}
        {subtitle && (
          <span className="block font-normal text-sm mt-1 text-gray-600">
            {subtitle}
          </span>
        )}
      </h2>

      <div
        className="
          flex-1
          mt-3
          flex
          items-center
          justify-center
          bg-gray-50
          rounded
        "
      >
        <img
          src={image}
          alt={title}
          className="
            max-h-[120px]
            sm:max-h-[160px]
            object-contain
          "
        />
      </div>

      <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
        See more
      </button>
    </div>
  );
};
