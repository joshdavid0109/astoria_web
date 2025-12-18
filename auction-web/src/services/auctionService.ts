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

const productJoin1 = `
  product:product!auction_product_id_fkey!inner (
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

interface FetchAuctionsParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Optional: fetch single auction
 */
export async function fetchAuctions({
  category,
  search,
  minPrice,
  maxPrice,
  sort,
  page = 1,
  limit = 48,
}: FetchAuctionsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("auction")
    .select(
      `
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      ${productJoin1}
      `,
      { count: "exact" }
    );

  if (category) query = query.eq("product.category", category);
  if (search) query = query.ilike("product.title", `%${search}%`);
  if (minPrice) query = query.gte("current_price", minPrice);
  if (maxPrice) query = query.lte("current_price", maxPrice);

  if (sort === "price_asc")
    query = query.order("current_price", { ascending: true });

  if (sort === "price_desc")
    query = query.order("current_price", { ascending: false });

  if (sort === "ending_soon")
    query = query.order("end_time", { ascending: true });

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("❌ fetchAuctions error:", error);
    return { data: [], count: 0 };
  }
  
  console.log(data)

  // ✅ NORMALIZE HERE (THIS IS THE FIX)
  const normalized = (data || []).map((a: any) => ({

    id: a.auction_id,                         // 👈 used by ProductsPage
    title: a.product?.title,                 // 👈 FIX
    image_url: a.product?.images?.[0]?.url   // 👈 FIX
      || "/placeholder.png",
    category: a.product?.category,
    price: a.start_price,                    // optional (for UI reuse)
    current_price: a.current_price,
    start_time: a.start_time,
    end_time: a.end_time,
  }));

  console.log(normalized)
  return {
    data: normalized,
    count: count ?? 0,
  };
}






// export async function fetchAuctions({
//   category,
//   search,
//   minPrice,
//   maxPrice,
//   sort,
//   page = 1,
//   limit = 48,
// }: {
//   category?: string;
//   search?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   sort?: string;
//   page?: number;
//   limit?: number;
// }) {
//   let query = supabase
//     .from("auction_with_product")
//     .select("*", { count: "exact" })
//     .lte("start_time", new Date().toISOString())
//     .gt("end_time", new Date().toISOString());

//   if (category) query = query.eq("category", category);
//   if (search) query = query.ilike("title", `%${search}%`);
//   if (minPrice) query = query.gte("current_price", minPrice);
//   if (maxPrice) query = query.lte("current_price", maxPrice);

//   if (sort === "price_asc")
//     query = query.order("current_price", { ascending: true });

//   if (sort === "price_desc")
//     query = query.order("current_price", { ascending: false });

//   if (sort === "ending_soon")
//     query = query.order("end_time", { ascending: true });

//   const from = (page - 1) * limit;
//   const to = from + limit - 1;

//   const { data, count, error } = await query.range(from, to);

//   console.log(data)

//   if (error) {
//     console.error("❌ fetchAuctions error:", error);
//     return { data: [], count: 0 };
//   }

//   return { data, count };
// }


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

