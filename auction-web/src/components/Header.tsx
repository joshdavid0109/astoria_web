import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Bell, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CartModal from './CartModal';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, isLoggedIn, logout, currentMode, setCurrentMode, searchQuery, setSearchQuery } = useAppContext();
  const [showCart, setShowCart] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button onClick={handleLogoClick} className="flex items-center hover:opacity-90 transition-opacity">
              <div className="text-2xl font-bold flex items-center">
                <Package className="w-8 h-8 mr-2" />
                StorageMax
              </div>
            </button>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pr-12 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600 p-2 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative hover:text-orange-200 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
              </button>

              <button 
                onClick={() => setShowCart(true)}
                className="relative hover:text-orange-200 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 hover:text-orange-200 transition-colors">
                    <User className="w-6 h-6" />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={logout}
                    className="hover:text-orange-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-orange-200 transition-colors"
              >
                Home
              </button>
              <button className="hover:text-orange-200 transition-colors">
                Categories
              </button>
              <button className="hover:text-orange-200 transition-colors">Flash Sale</button>
              <button className="hover:text-orange-200 transition-colors">Deals</button>
            </div>

            <div className="flex bg-white/20 rounded-full p-1">
              <button
                onClick={() => setCurrentMode('auction')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentMode === 'auction' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'
                }`}
              >
                🔨 Auction Mode
              </button>
              <button
                onClick={() => setCurrentMode('marketplace')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentMode === 'marketplace' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'
                }`}
              >
                🛒 Buy & Sell
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
