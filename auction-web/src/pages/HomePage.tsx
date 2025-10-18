import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Clock, MapPin, Grid, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { AuctionItem } from '../types/types';

interface Category {
  id: number;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics', icon: '📱' },
  { id: 2, name: 'Fashion', icon: '👕' },
  { id: 3, name: 'Home & Garden', icon: '🏠' },
  { id: 4, name: 'Sports', icon: '⚽' },
  { id: 5, name: 'Books', icon: '📚' },
  { id: 6, name: 'Toys', icon: '🧸' },
  { id: 7, name: 'Beauty', icon: '💄' },
  { id: 8, name: 'Auto', icon: '🚗' },
];

const auctionProducts: AuctionItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - Storage Unit Find',
    description: 'Excellent condition iPhone 14 Pro Max found in storage unit. Includes original box and accessories.',
    currentBid: 850,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    category: 'Electronics',
    condition: 'Like New',
    bidCount: 23,
    seller: 'TechDeals',
    location: 'New York, NY',
    shipping: '15',
    minBidIncrement: 25,
    featured: true,
    watchCount: 45
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket Collection',
    description: 'Collection of 3 vintage leather jackets in various sizes. Authentic vintage pieces from the 80s.',
    currentBid: 125,
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    category: 'Fashion',
    condition: 'Good',
    bidCount: 15,
    seller: 'VintageFinds',
    location: 'Los Angeles, CA',
    shipping: '25',
    minBidIncrement: 10
  },
  {
    id: '3',
    title: 'Professional Camera Equipment Set',
    description: 'Complete professional camera setup including DSLR, lenses, tripod, and lighting equipment.',
    currentBid: 450,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop',
    category: 'Electronics',
    condition: 'Excellent',
    bidCount: 31,
    seller: 'PhotoPro',
    location: 'Chicago, IL',
    shipping: '35',
    minBidIncrement: 50
  }
];

const marketplaceProducts: AuctionItem[] = [
  {
    id: '4',
    title: 'Wireless Headphones - Like New',
    description: 'Premium wireless headphones with noise cancellation. Only used for 2 weeks.',
    currentBid: 89,
    originalPrice: 129,
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Not used for marketplace
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    category: 'Electronics',
    condition: 'Like New',
    bidCount: 445,
    seller: 'AudioShop',
    location: 'Miami, FL',
    shipping: '8',
    minBidIncrement: 5
  },
  {
    id: '5',
    title: 'Designer Handbag Collection',
    description: 'Authentic designer handbags from top luxury brands. All items authenticated.',
    currentBid: 245,
    originalPrice: 399,
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    category: 'Fashion',
    condition: 'Excellent',
    bidCount: 234,
    seller: 'LuxuryFinds',
    location: 'Beverly Hills, CA',
    shipping: '15',
    minBidIncrement: 10
  },
  {
    id: '6',
    title: 'Gaming Setup Complete',
    description: 'Complete gaming setup including high-end PC, monitor, keyboard, mouse, and gaming chair.',
    currentBid: 1299,
    originalPrice: 1899,
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1593640408182-31174a57b798?w=300&h=300&fit=crop',
    category: 'Electronics',
    condition: 'Like New',
    bidCount: 167,
    seller: 'GameZone',
    location: 'Austin, TX',
    shipping: '50',
    minBidIncrement: 50
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMode, addToCart, placeBid, isLoggedIn, toggleWatchlist, isInWatchlist } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentProducts = currentMode === 'auction' ? auctionProducts : marketplaceProducts;

  // Timer functionality for auctions
  useEffect(() => {
    const timer = setInterval(() => {
      auctionProducts.forEach(product => {
        if (product.endTime && product.endTime > new Date()) {
          // Update time left logic here if needed
        }
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Product Card Component
  const ProductCard: React.FC<{ product: AuctionItem }> = ({ product }) => {
    const isAuction = currentMode === 'auction';
    const timeLeft = product.endTime ? Math.max(0, product.endTime.getTime() - Date.now()) : 0;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            onClick={() => toggleWatchlist(product.id)}
            className={`absolute top-3 right-3 rounded-full p-2 shadow-md transition-opacity ${isInWatchlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-4 h-4 ${isInWatchlist(product.id) ? 'fill-current' : ''}`} />
          </button>
          {isAuction && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              AUCTION
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.bidCount})</span>
          </div>

          <div className="mb-3">
            {isAuction ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-red-600">${product.currentBid}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">{product.bidCount} bids</div>
                <div className="text-xs text-gray-500">Min bid: +${product.minBidIncrement}</div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">${product.currentBid}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            {product.location}
          </div>

          <div className="text-xs text-gray-600 mb-3">by {product.seller}</div>

          <div className="space-y-2">
            {isAuction ? (
              <button 
                onClick={() => {
                  if (!isLoggedIn) {
                    alert('Please login to place bids');
                    navigate('/login');
                    return;
                  }
                  const amount = product.currentBid + (product.minBidIncrement || 25);
                  
                  // Check if auction has ended
                  if (product.endTime && product.endTime < new Date()) {
                    alert('This auction has ended');
                    return;
                  }
                  
                  if (placeBid(product.id, amount)) {
                    alert(`Quick bid of $${amount} placed successfully!`);
                  } else {
                    alert('Failed to place bid. Please try again.');
                  }
                }}
                className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-red-500 hover:bg-red-600 text-white"
              >
                Place Bid
              </button>
            ) : (
              <button 
                onClick={() => {
                  addToCart(product);
                  alert(`${product.title} added to cart!`);
                }}
                className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-orange-500 hover:bg-orange-600 text-white"
              >
                Add to Cart
              </button>
            )}
            
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {currentMode === 'auction' ? 'Bid & Win Amazing Items' : 'Shop & Save More'}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {currentMode === 'auction' 
                ? 'Discover unique items from storage units and bid to win great deals'
                : 'Find everything you need at unbeatable prices'
              }
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                {currentMode === 'auction' ? 'Start Bidding' : 'Shop Now'}
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentMode === 'auction' ? '🔥 Hot Auctions' : '⭐ Featured Products'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
