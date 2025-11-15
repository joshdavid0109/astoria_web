import React from "react";
import { Package, Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-300 py-12">
      <div className="container mx-auto px-4">
        
        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* COLUMN 1 — Brand */}
          <div>
            <div className="flex items-center mb-3">
              <img 
                  src="../src/assets/astoria_white-nobg.png" // Path relative to the public root
                  alt="Astoria Logo"
                  className="h-10 w-10 mr-2" // Add appropriate Tailwind classes for sizing
              />
            <span className="text-2xl font-bold text-white">Astoria</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted platform for storage auctions and great marketplace deals.
            </p>

            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-full bg-gray-700 hover:bg-orange-500 transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2 — Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "How It Works", "Seller Center", "Customer Service"].map(
                (item) => (
                  <li key={item} className="hover:text-orange-400 cursor-pointer">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* COLUMN 4 — Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-3">
              Join our newsletter for upcoming auctions & deals.
            </p>

            <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent flex-1 px-3 py-2 text-sm text-gray-200 focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Astoria — All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
