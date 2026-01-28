import React, { useState } from "react";

const Footer: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  return (
    <footer className="bg-[#232F3E] text-gray-200 mt-5">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-sm py-3"
      >
        Back to top
      </button>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-4 py-6 space-y-3">
        {[
          {
            key: "about",
            title: "Get to Know Us",
            items: [
              "About Astoria",
              "Careers",
              "Press Releases",
              "Investor Relations",
            ],
          },
          {
            key: "sell",
            title: "Make Money with Us",
            items: [
              "Sell on Astoria",
              "Sell Your Services",
              "Become an Affiliate",
              "Advertise Your Products",
            ],
          },
          {
            key: "payment",
            title: "Astoria Payment Products",
            items: [
              "Astoria Wallet",
              "Gift Cards",
              "Currency Converter",
              "Shipping Rates",
            ],
          },
          {
            key: "help",
            title: "Let Us Help You",
            items: [
              "Your Account",
              "Your Orders",
              "Shipping & Delivery",
              "Returns & Replacements",
              "Help",
            ],
          },
        ].map((section) => (
          <div key={section.key} className="bg-[#1B2533] rounded-md">
            <button
              onClick={() => toggle(section.key)}
              className="w-full px-4 py-3 flex justify-between items-center text-sm font-semibold"
            >
              {section.title}
              <span className="text-lg">
                {open === section.key ? "−" : "+"}
              </span>
            </button>

            {open === section.key && (
              <ul className="px-4 pb-4 space-y-3 text-sm text-gray-300">
                {section.items.map((item) => (
                  <li key={item} className="hover:underline">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <div className="max-w-[1500px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* LEFT STACK */}
            <div className="space-y-8">
              <div>
                <h4 className="font-bold mb-3 text-white">
                  Get to Know Us
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>About Astoria</li>
                  <li>Careers</li>
                  <li>Press Releases</li>
                  <li>Investor Relations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-white">
                  Astoria Payment Products
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Astoria Wallet</li>
                  <li>Gift Cards</li>
                  <li>Currency Converter</li>
                  <li>Shipping Rates</li>
                </ul>
              </div>
            </div>

            {/* RIGHT STACK */}
            <div className="space-y-8">
              <div>
                <h4 className="font-bold mb-3 text-white">
                  Make Money with Us
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Sell on Astoria</li>
                  <li>Sell Your Services</li>
                  <li>Become an Affiliate</li>
                  <li>Advertise Your Products</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-white">
                  Let Us Help You
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Your Account</li>
                  <li>Your Orders</li>
                  <li>Shipping & Delivery</li>
                  <li>Returns & Replacements</li>
                  <li>Help</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600" />

      {/* Bottom branding / locale */}
      <div className="bg-[#131A22]">
        <div className="max-w-[1500px] mx-auto px-6 py-6 flex flex-col items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img
              src="https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/icons/astoria_white-nobg.png"
              alt="Astoria"
              className="h-8"
            />
            <span className="text-white font-semibold">
              Astoria
            </span>
          </div>

          <div className="flex gap-4">
            <span>🇨🇦 Canada</span>
            <span>English</span>
            <span>CAD</span>
          </div>

          <div className="text-center leading-relaxed">
            <div className="flex gap-4 justify-center flex-wrap">
              <span className="hover:underline cursor-pointer">
                Conditions of Use
              </span>
              <span className="hover:underline cursor-pointer">
                Privacy Notice
              </span>
              <span className="hover:underline cursor-pointer">
                Interest-Based Ads
              </span>
            </div>
            <div className="mt-2">
              © {new Date().getFullYear()} Astoria, Inc. or its affiliates
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
