import { supabase } from "../lib/supabaseClient";

/* ------------------------------------------------------
 *  AUCTION PRODUCTS
 *  (JOIN auction + product + product_images)
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

  return data.map((row: any) => {
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
 *  MARKETPLACE PRODUCTS (NON-AUCTION)
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
      product_images (
        url
      )
    `)
    .eq("is_auction", false);

  if (error) {
    console.error("getMarketplaceProducts error:", error);
    return [];
  }

  return data.map((p: any) => ({
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
 *  GET PRODUCT BY ID
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
    .limit(1)
    .single();

  if (error) {
    console.error("getProductById error:", error);
    return { product: null, error };
  }

  return { product: data, error: null };
}

/* ------------------------------------------------------
 *  PRODUCT IMAGES
 * ------------------------------------------------------ */
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

/* ------------------------------------------------------
 *  GET AUCTION ROW (IF PRODUCT IS AUCTIONED)
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
      uid         
    `)
    .eq("product_id", productId)
    .limit(1)
    .single();

 if (error) {
  console.error("getAuctionProducts error:", JSON.stringify(error, null, 2));
  return [];
}


  return { auction: data, error: null };
}
