import React from 'react';
import { Package } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">StorageMax</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your premier destination for storage unit auctions and quality marketplace deals.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-300">
              <div>About Us</div>
              <div>How It Works</div>
              <div>Seller Center</div>
              <div>Customer Service</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Categories</h4>
            <div className="space-y-2 text-gray-300">
              <div>Electronics</div>
              <div>Fashion</div>
              <div>Home & Garden</div>
              <div>More Categories</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <div className="space-y-2 text-gray-300">
              <div>Help Center</div>
              <div>Payment Methods</div>
              <div>Shipping Info</div>
              <div>Returns</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 StorageMax. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
