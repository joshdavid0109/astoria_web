import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#232F3E] text-gray-200 mt-5">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-sm py-3"
      >
        Back to top
      </button>

      {/* Main links */}
      <div className="max-w-[1500px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          
          {/* LEFT STACK */}
          <div className="space-y-8">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-3 text-white">Get to Know Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>About Astoria</li>
                <li>Careers</li>
                <li>Press Releases</li>
                <li>Investor Relations</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold mb-3 text-white">Astoria Payment Products</h4>
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
            {/* Column 2 */}
            <div>
              <h4 className="font-bold mb-3 text-white">Make Money with Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Sell on Astoria</li>
                <li>Sell Your Services</li>
                <li>Become an Affiliate</li>
                <li>Advertise Your Products</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-bold mb-3 text-white">Let Us Help You</h4>
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

      {/* Divider */}
      <div className="border-t border-gray-600" />

      {/* Bottom branding / locale */}
      <div className="bg-[#131A22]">
        <div className="max-w-[1500px] mx-auto px-6 py-6 flex flex-col items-center gap-4 text-xs text-gray-400">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="https://tkilxxlwkhlexitzyqiu.supabase.co/storage/v1/object/public/icons/astoria_white-nobg.png"
              alt="Astoria"
              className="h-8"
            />
            <span className="text-white font-semibold">Astoria</span>
          </div>

          {/* Locale */}
          <div className="flex gap-4">
            <span>🇨🇦 Canada</span>
            <span>English</span>
            <span>CAD</span>
          </div>

          {/* Legal */}
          <div className="text-center leading-relaxed">
            <div className="flex gap-4 justify-center flex-wrap">
              <span className="hover:underline cursor-pointer">Conditions of Use</span>
              <span className="hover:underline cursor-pointer">Privacy Notice</span>
              <span className="hover:underline cursor-pointer">Interest-Based Ads</span>
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
