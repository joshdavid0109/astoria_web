// src/services/homeService.ts
import { supabase } from "../lib/supabaseClient";

export type Banner = { banner_id: number; image_url?: string | null; link_url?: string | null; priority?: number; is_active_bool?: boolean };
export type Category = { categories_id: number; name: string; icon?: string | null; parent_id?: number | null };
export type ProductRow = any;
export type AuctionRow = any;
export type FlashDealRow = any;
export type BestSellerRow = any;

export async function fetchActiveBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("featured_banner")
    .select("*")
    .eq("is_active_bool", true)
    .order("priority", { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
  if (error) { console.error(error); return []; }
  return data || [];
}

/** Use view product_with_category that includes image_url and normalized category */
export async function fetchProductsByCategoryNames(categoryNames: string[], limit = 12): Promise<ProductRow[]> {
  if (!categoryNames || categoryNames.length === 0) return [];
  const { data, error } = await supabase
    .from("product_with_category")
    .select("*")
    .in("category", categoryNames)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data || [];
}

/** Fetch auctions with product joined (uses raw auction table) */
export async function fetchActiveAuctionsByCategoryNames(categoryNames: string[], limit = 12): Promise<AuctionRow[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("auction")
    .select("*, product:product_id(*)")
    .gt("end_time", now)
    .order("end_time", { ascending: true })
    .limit(limit);
  if (error) { console.error(error); return []; }
  // client-side filter by normalized category (product.category)
  return (data || []).filter((a: any) => {
    const cat = a.product?.category;
    if (!cat) return false;
    return categoryNames.includes(String(cat));
  });
}

export async function fetchEndingSoonAuctions(limit = 10): Promise<AuctionRow[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("auction")
    .select("*, product:product_id(*)")
    .gt("end_time", now)
    .order("end_time", { ascending: true })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function fetchFlashDeals(limit = 12): Promise<(FlashDealRow & { product?: ProductRow })[]> {
  const { data, error } = await supabase
    .from("flash_deals")
    .select("*, product:product_id(*)")
    .order("discount_percent", { ascending: false })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function fetchBestSellers(limit = 12): Promise<(BestSellerRow & { product?: ProductRow })[]> {
  const { data, error } = await supabase
    .from("best_seller")
    .select("*, product:product_id(*)")
    .order("ranking", { ascending: true })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data || [];
}
export async function fetchProductsByCategoryName(categoryName: string, limit = 24) {
  if (!categoryName) return [];
  const { data, error } = await supabase
    .from("product_with_category")
    .select("*")
    .eq("category", categoryName)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchProductsByCategoryName", error);
    return [];
  }
  return data || [];
}
export async function fetchProducts({
  category,
  search,
  minPrice,
  maxPrice,
  minRating,
  sort,
  page = 1,
  limit = 48,
}: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  let query = supabase
    .from("product_with_category")
    .select("*", { count: "exact" });

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);
  if (minPrice) query = query.gte("price", minPrice);
  if (maxPrice) query = query.lte("price", maxPrice);
  if (minRating) query = query.gte("avg_rating", minRating);

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  if (sort === "price_desc") query = query.order("price", { ascending: false });
  if (sort === "rating") query = query.order("avg_rating", { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { data: [], count: 0 };
  }

  return { data, count };
}
