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

  async function getProductIdsByFilter({
    category,
    search,
  }: {
    category?: string;
    search?: string;
  }) {
    let q = supabase.from("product").select("product_id");

    if (category) q = q.ilike("category", `%${category}%`);
    if (search) q = q.ilike("title", `%${search}%`);

    const { data, error } = await q;

    if (error) {
      console.error("getProductIdsByFilter", error);
      return [];
    }

    return data.map(p => p.product_id);
  }


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

  const productIds =
    category || search
      ? await getProductIdsByFilter({ category, search })
      : null;

      console.log("FILTER:", { category, search });
    console.log("PRODUCT IDS:", productIds);


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
      ${productJoin}
      `,
      { count: "exact" }
    )
    .range(from, to);

  if (productIds && productIds.length === 0) {
    return { data: [], count: 0 };
  }

  if (productIds) {
    query = query.in("product_id", productIds);
  }

  if (minPrice !== undefined)
    query = query.gte("current_price", minPrice);
  if (maxPrice !== undefined)
    query = query.lte("current_price", maxPrice);

  if (sort === "price_asc")
    query = query.order("current_price", { ascending: true });
  else if (sort === "price_desc")
    query = query.order("current_price", { ascending: false });
  else if (sort === "ending_soon")
    query = query.order("end_time", { ascending: true });
  else
    query = query.order("start_time", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    console.error("fetchAuctions", error);
    return { data: [], count: 0 };
  }

  console.log("✅ AUCTIONS FETCHED:", data);

  return {
    data: data || [],
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
    .select(`
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      product:product_id (
        product_id,
        title,
        description,
        category,
        price,
        status,
        images:product_images (
          url
        )
      )
    `)
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
    .from("bid")
    .select("*")
    .eq("auction_id", auctionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAuctionBids", error);
    return [];
  }

  return data || [];
}


// src/services/auctionService.ts
export async function placeBid(
  auctionId: number,
  amount: number
) {
  // 1️⃣ Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to place a bid");
  }

  // 2️⃣ Insert bid with bidder_id
  const { error: bidError } = await supabase
    .from("bid")
    .insert({
      auction_id: auctionId,
      bidder_id: user.id,   // ✅ FIX
      bid_amount: amount,
    });

  if (bidError) {
    console.error("placeBid insert error", bidError);
    throw bidError;
  }

  // 3️⃣ Update auction price
  const { error: auctionError } = await supabase
    .from("auction")
    .update({ current_price: amount })
    .eq("auction_id", auctionId);

  if (auctionError) {
    console.error("placeBid update error", auctionError);
    throw auctionError;
  }
}

