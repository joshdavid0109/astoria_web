import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, MapPin, Star, Package, Truck, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { AuctionItem } from '../types/types';

// Sample product data (in real app, this would come from API/props)
const sampleProducts: AuctionItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - Storage Unit Find',
    description: 'Excellent condition iPhone 14 Pro Max found in storage unit. Includes original box and accessories. This device has been tested and is fully functional. Battery health is at 95%. No scratches or dents on the screen or body. Comes with original charging cable and adapter.',
    currentBid: 850,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    category: 'Electronics',
    condition: 'Like New',
    bidCount: 23,
    seller: 'TechDeals',
    location: 'New York, NY',
    shipping: '15',
    minBidIncrement: 25,
    featured: true,
    watchCount: 45
  }
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, placeBid, isLoggedIn, toggleWatchlist, isInWatchlist, currentMode } = useAppContext();
  
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // In real app, fetch product by ID
  const product = sampleProducts.find(p => p.id === id) || sampleProducts[0];
  
  const isAuction = currentMode === 'auction';
  const timeLeft = product.endTime ? Math.max(0, product.endTime.getTime() - Date.now()) : 0;
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handlePlaceBid = () => {
    // Validation 1: Check if user is logged in
    if (!isLoggedIn) {
      alert('Please login to place a bid');
      navigate('/login');
      return;
    }
    
    // Validation 2: Check if bid amount is entered
    if (!bidAmount || bidAmount === 0) {
      alert('Please enter a bid amount');
      return;
    }
    
    // Validation 3: Check if bid is a valid number
    if (isNaN(bidAmount) || bidAmount < 0) {
      alert('Please enter a valid bid amount');
      return;
    }
    
    // Validation 4: Check if bid is higher than current bid
    if (bidAmount <= product.currentBid) {
      alert(`Your bid must be higher than the current bid of $${product.currentBid}`);
      return;
    }
    
    // Validation 5: Check minimum bid increment
    const minimumBid = product.currentBid + product.minBidIncrement;
    if (bidAmount < minimumBid) {
      alert(`Minimum bid must be at least $${minimumBid} (current bid + $${product.minBidIncrement} increment)`);
      return;
    }
    
    // Validation 6: Check if auction has ended
    if (product.endTime && product.endTime < new Date()) {
      alert('This auction has ended');
      return;
    }
    
    // Place the bid
    if (placeBid(product.id, bidAmount)) {
      alert(`Bid of $${bidAmount} placed successfully!`);
      setBidAmount(0);
    } else {
      alert('Failed to place bid. Please try again.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  // Sample images (in real app, product would have multiple images)
  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img 
                  src={images[selectedImage]} 
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
                {isAuction && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    AUCTION
                  </div>
                )}
                <button
                  onClick={() => toggleWatchlist(product.id)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
                    isInWatchlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWatchlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600">({product.bidCount} reviews)</span>
              </div>

              {isAuction ? (
                <div className="bg-orange-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                      <p className="text-4xl font-bold text-red-600">${product.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Time Left</p>
                      <div className="flex items-center text-orange-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-2xl font-bold">
                          {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Total Bids:</span> {product.bidCount}
                    </div>
                    <div>
                      <span className="font-medium">Min Increment:</span> ${product.minBidIncrement}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          value={bidAmount || ''}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          placeholder={`Min: ${product.currentBid + product.minBidIncrement}`}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceBid}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="text-4xl font-bold text-orange-600">${product.currentBid}</p>
                    </div>
                    {product.originalPrice && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Original Price</p>
                        <p className="text-2xl text-gray-400 line-through">${product.originalPrice}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Condition</p>
                    <p className="text-gray-600">{product.condition}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600">{product.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Shipping</p>
                    <p className="text-gray-600">${product.shipping} - Standard Delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Seller</p>
                    <p className="text-gray-600">{product.seller}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
