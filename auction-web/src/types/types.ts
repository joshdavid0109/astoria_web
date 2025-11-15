// types.ts — Clean version that matches real Supabase response

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  originalPrice?: number;

  // Supabase fields
  endTime?: Date | null;
  image: string | null;
  category: string | null;
  seller: string | null;

  // Optional fields (because DB does NOT have them)
  condition?: string;
  location?: string;
  bidCount?: number;
  shipping?: string;
  featured?: boolean;
  watchCount?: number;

  minBidIncrement?: number;
}

export interface ProductDetailProps {
  item: AuctionItem;
  onBack: () => void;
  isInWatchList: boolean;
  onToggleWatchList: (id: string) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BidHistory {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  timestamp: Date;
  bidderName: string;
}

export interface WatchListItem {
  userId: string;
  itemId: string;
  addedAt: Date;
}

export type PaymentMethod = "card" | "cash" | "mobile";

export type AuctionStatus = "active" | "ended" | "upcoming";

export type ItemCondition = "New" | "Like New" | "Good" | "Fair" | "Poor";
