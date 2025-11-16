import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuctionItem, User, BidHistory, WatchListItem } from '../types/types';
import { supabase } from '../lib/supabaseClient';


interface AppContextType {
  // User state
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
   register: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;

  // Cart state
  cart: AuctionItem[];
  cartCount: number;
  addToCart: (item: AuctionItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  getCartTotal: () => number;
  getCartShipping: () => number;
  getCartTax: () => number;
  getCartGrandTotal: () => number;
  clearCart: () => void;

  // Bidding state
  userBids: BidHistory[];
  placeBid: (itemId: string, amount: number) => boolean;

  // Watchlist
  watchlist: WatchListItem[];
  toggleWatchlist: (itemId: string) => void;
  isInWatchlist: (itemId: string) => boolean;

  // Orders
  orders: any[];
  addOrder: (order: any) => void;

  // Current mode
  currentMode: 'auction' | 'marketplace';
  setCurrentMode: (mode: 'auction' | 'marketplace') => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cart state
  const [cart, setCart] = useState<AuctionItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Bidding state
  const [userBids, setUserBids] = useState<BidHistory[]>([]);

  // Watchlist
  const [watchlist, setWatchlist] = useState<WatchListItem[]>([]);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);

  // Mode
  const [currentMode, setCurrentMode] = useState<'auction' | 'marketplace'>('auction');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    const savedBids = localStorage.getItem('userBids');
    const savedWatchlist = localStorage.getItem('watchlist');
    const savedOrders = localStorage.getItem('orders');
    const savedMode = localStorage.getItem('currentMode');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedBids) setUserBids(JSON.parse(savedBids));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedMode) setCurrentMode(savedMode as 'auction' | 'marketplace');
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('userBids', JSON.stringify(userBids));
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('currentMode', currentMode);
  }, [user, cart, userBids, watchlist, orders, currentMode]);

  // Update cart count
  useEffect(() => {
    setCartCount(cart.reduce((total) => total + 1, 0)); // Assuming quantity is 1 for simplicity
  }, [cart]);

  // User functions

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return false;

    const { user } = data;

    setUser({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || '',
    });

    setIsLoggedIn(true);
    return true;
  };

  const register = async ({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        console.error("Auth error:", error.message);
        return false;
      }

      const user = data.user;
      if (!user) return false;

      const { error: dbError } = await supabase.from("user").insert({
        id: user.id,        // ← REQUIRED
        email: email,
        username: name,
        role: "buyer",
      });

      if (dbError) {
        console.error("DB error:", dbError.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Unexpected registration error:", err);
      return false;
    }
  };


  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCart([]);
    setCartCount(0);
    setUserBids([]);
    setWatchlist([]);
    setOrders([]);
    localStorage.clear();
  };

  // Cart functions
  const addToCart = (item: AuctionItem) => {
    if (item.originalPrice) { // Only marketplace items
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      // For simplicity, assuming quantity is 1
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.originalPrice || 0), 0);
  const getCartShipping = () => cart.length * 10; // Mock shipping
  const getCartTax = () => getCartTotal() * 0.08;
  const getCartGrandTotal = () => getCartTotal() + getCartShipping() + getCartTax();
  const clearCart = () => setCart([]);

  // Bidding functions
  const placeBid = (itemId: string, amount: number): boolean => {
    if (!isLoggedIn) return false;
    const newBid: BidHistory = {
      id: Date.now().toString(),
      itemId,
      userId: user!.id,
      amount,
      timestamp: new Date(),
      bidderName: user!.name
    };
    setUserBids([...userBids, newBid]);
    return true;
  };

  // Watchlist functions
  const toggleWatchlist = (itemId: string) => {
    const existing = watchlist.find(w => w.itemId === itemId);
    if (existing) {
      setWatchlist(watchlist.filter(w => w.itemId !== itemId));
    } else {
      setWatchlist([...watchlist, { userId: user?.id || '', itemId, addedAt: new Date() }]);
    }
  };

  const isInWatchlist = (itemId: string) => watchlist.some(w => w.itemId === itemId);

  // Orders
  const addOrder = (order: any) => {
    setOrders([...orders, order]);
  };

  const value: AppContextType = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartShipping,
    getCartTax,
    getCartGrandTotal,
    clearCart,
    userBids,
    placeBid,
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    orders,
    addOrder,
    currentMode,
    setCurrentMode,
    searchQuery,
    setSearchQuery
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
