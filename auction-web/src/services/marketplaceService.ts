import { supabase } from "../lib/supabaseClient";

export async function fetchProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      product_id,
      title,
      price,
      category,
      description,
      images:product_images ( url )
    `)
    .ilike("category", `%${category}%`);

  if (error) {
    console.error("❌ fetchProductsByCategory error:", error);
    return [];
  }

  return data;
}
