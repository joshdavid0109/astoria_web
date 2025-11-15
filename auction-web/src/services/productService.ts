import { supabase } from "../lib/supabaseClient";

/** -------------------------------------------
 *  AUCTION PRODUCTS (JOIN auction + product + product_images)
 * -------------------------------------------*/
export async function getAuctionProducts() {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      current_price,
      end_time,
      product:product_id (
        product_id,
        title,
        description,
        category,
        price,
        seller_id,
        status,
        product_images:product_images!product_id ( url )
      )
    `);

  console.log("Auction products data:", data, error);

  if (error) return [];

  return data.map((row: any) => {
    const p = row.product;
    return {
      id: String(p.product_id),
      title: p.title,
      description: p.description,
      image: p.product_images?.[0]?.url || null,
      category: p.category,
      seller: p.seller_id,
      currentBid: row.current_price ?? p.price,
      minBidIncrement: 10,
      endTime: row.end_time ? new Date(row.end_time) : null,
      condition: "Good",
      location: "Unknown",
      shipping: "0",
      bidCount: 0,
    };
  });
}


/** -------------------------------------------
 *  MARKETPLACE PRODUCTS (NON-AUCTION)
 *  product + product_images
 * -------------------------------------------*/
export async function getMarketplaceProducts() {
  const { data, error } = await supabase
    .from("product")
    .select(`
      product_id,
      title,
      description,
      category,
      price,
      seller_id,
      is_auction,
      product_images:product_images (
        url
      )
    `)
    .eq("is_auction", false);

  console.log("Marketplace products:", data, error);

  if (error) return [];

  return data.map((p) => ({
    id: p.product_id.toString(),
    title: p.title,
    description: p.description,
    image: p.product_images?.[0]?.url || null,
    category: p.category,
    seller: p.seller_id,
    currentBid: p.price,
  }));
}

/**
 * Fetch raw product row by product_id (includes basic product fields).
 */
export async function getProductById(productId: string | number) {
  const { data, error } = await supabase
    .from("product")
    .select(
      `
      product_id,
      title,
      description,
      category,
      price,
      seller_id,
      is_auction,
      status
    `
    )
    .eq("product_id", productId)
    .limit(1)
    .single();

  if (error) {
    console.error("getProductById error:", error);
    return { product: null, error };
  }
  return { product: data, error: null };
}

/**
 * Fetch product_images for a product_id (returns array of { url }).
 */
export async function getProductImages(productId: string | number) {
  const { data, error } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", productId)
    .order("image_id", { ascending: true });

  if (error) {
    console.error("getProductImages error:", error);
    return { images: [], error };
  }
  return { images: data || [], error: null };
}

/**
 * Fetch auction row for a product_id (if exists).
 */
export async function getAuctionByProductId(productId: string | number) {
  const { data, error } = await supabase
    .from("auction")
    .select(`
      auction_id,
      product_id,
      start_price,
      current_price,
      start_time,
      end_time,
      winner_id
    `)
    .eq("product_id", productId)
    .limit(1)
    .single();

  if (error) {
    // If no auction row found, supabase returns 400 with message - handle gracefully
    // We treat missing auction as not-an-error for our UI
    // But log so devs can see underlying error
    if (error.code === "PGRST116" || error.message?.includes("Result is empty")) {
      return { auction: null, error: null };
    }
    console.error("getAuctionByProductId error:", error);
    return { auction: null, error };
  }

  return { auction: data, error: null };
}
