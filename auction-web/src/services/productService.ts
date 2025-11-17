import { supabase } from "../lib/supabaseClient";

/* ------------------------------------------------------
 *  SAFE HELPER (no undefined, no breaking shapes)
 * ------------------------------------------------------ */
function safeReturn(dataKey: string, data: any, error: any) {
  return {
    [dataKey]: data ?? null,
    error: error ?? null,
  };
}

/* ------------------------------------------------------
 *  AUCTION PRODUCTS (Homepage listings)
 * ------------------------------------------------------ */
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
        uid,
        status,
        product_images:product_images!product_id ( url )
      )
    `);

  if (error) {
    console.error("getAuctionProducts error:", error);
    return [];
  }

  return (data || []).map((row: any) => {
    const p = row.product;
    return {
      id: String(p.product_id),
      title: p.title,
      description: p.description,
      image: p.product_images?.[0]?.url || null,
      category: p.category,
      seller_uid: p.uid,
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

/* ------------------------------------------------------
 *  MARKETPLACE PRODUCTS
 * ------------------------------------------------------ */
export async function getMarketplaceProducts() {
  const { data, error } = await supabase
    .from("product")
    .select(`
      product_id,
      title,
      description,
      category,
      price,
      uid,
      is_auction,
      product_images ( url )
    `)
    .eq("is_auction", false);

  if (error) {
    console.error("getMarketplaceProducts error:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.product_id.toString(),
    title: p.title,
    description: p.description,
    image: p.product_images?.[0]?.url || null,
    category: p.category,
    seller_uid: p.uid,
    currentBid: p.price,
  }));
}

/* ------------------------------------------------------
 *  GET PRODUCT BY ID — ALWAYS RETURNS {product, error}
 * ------------------------------------------------------ */
export async function getProductById(productId: string | number) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      product_id,
      title,
      description,
      category,
      price,
      uid,
      is_auction,
      status
    `)
    .eq("product_id", productId)
    .maybeSingle(); // SAFE

  return safeReturn("product", data, error);
}

/* ------------------------------------------------------
 *  PRODUCT IMAGES — ALWAYS RETURNS {images, error}
 * ------------------------------------------------------ */
export async function getProductImages(productId: string | number) {
  const { data, error } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", productId)
    .order("image_id", { ascending: true });

  return safeReturn("images", data || [], error);
}

/* ------------------------------------------------------
 *  GET AUCTION BY PRODUCT ID — ALWAYS RETURNS {auction, error}
 * ------------------------------------------------------ */
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
    .maybeSingle(); // SAFE: never throws on 0 rows

  return safeReturn("auction", data, error);
}
