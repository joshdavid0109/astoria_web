// src/components/home/HeroPremium.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * H2: White + Gold Minimal hero
 * Clean, premium, centered headline with subtle gold underline and CTA
 */
const Hero: React.FC<{ subtitle?: string; ctaLabel?: string; ctaLink?: string }> = ({
  subtitle = "Curated items, real auctions, and daily deals.",
  ctaLabel = "Shop curated collections",
  ctaLink = "/",
}) => {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white to-white/90 border border-gray-100 shadow-md p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Astoria — elevated auctions & premium deals
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <div className="h-0.5 w-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => navigate(ctaLink)}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold shadow-lg"
              >
                {ctaLabel}
              </button>

              <button
                onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
                className="text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Explore categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
