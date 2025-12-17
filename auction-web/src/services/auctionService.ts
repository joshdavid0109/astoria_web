// src/services/auctionService.ts
import { supabase } from "../lib/supabaseClient";

/**
 * Helper: SELECT fields for product + images
 */
const productJoin = `
  product:product_id (
    product_id,
    title,
    description,
    price,
    category,
    created_at,
    images:product_images ( url )
  )
`;

/**
 * Fetch auctions ending soon (closing soonest)
 */
export async function fetchEndingSoonAuctions(limit: number = 12) {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      ${productJoin}
    `)
    .order("end_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("❌ fetchEndingSoonAuctions error:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch hot auctions (highest bids = most active)
 * If "bid count" isn't stored, we order by current_price instead.
 */
export async function fetchHotAuctions(limit: number = 12) {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      ${productJoin}
    `)
    .order("current_price", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ fetchHotAuctions error:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch newly posted auctions (sort by start_time)
 */
export async function fetchNewAuctions(limit: number = 12) {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      ${productJoin}
    `)
    .order("start_time", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ fetchNewAuctions error:", error);
    return [];
  }

  return data || [];
}

/**
 * Optional: fetch single auction
 */


export async function fetchAuctionsByCategory(category: string) {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      product_id,
      current_price,
      start_price,
      end_time,
      product:product_id (
        product_id,
        title,
        description,
        price,
        category,
        images:product_images ( url )
      )
    `)
    .ilike("product.category", `%${category}%`);

  if (error) {
    console.error("❌ fetchAuctionsByCategory error:", error);
    return [];
  }

  return data;
}

export async function fetchAuctionById(auctionId: string) {
  const { data, error } = await supabase
    .from("auction")
    .select(`*,
      product:product_id(*)`)
    .eq("auction_id", auctionId)
    .single();

  if (error) {
    console.error("fetchAuctionById", error);
    return null;
  }

  return data;
}

export async function fetchAuctionBids(auctionId: string) {
  const { data, error } = await supabase
    .from("auction")
    .select("*")
    .eq("auction_id", auctionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAuctionBids", error);
    return [];
  }

  return data;
}

export async function placeBid(auctionId: number, amount: number) {
  const { error } = await supabase.from("auction_bid").insert({
    auction_id: auctionId,
    bid_amount: amount,
  });

  if (error) {
    throw error;
  }
}
