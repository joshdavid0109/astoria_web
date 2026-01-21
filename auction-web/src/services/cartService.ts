import { supabase } from "../lib/supabaseClient";

export async function addToCart(productId: number, quantity = 1) {
  // 1️⃣ Get auth user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();


console.log("SUPABASE USER:", user);

  if (authError || !user) {
    throw new Error("User not logged in");
  }

  console.log(user.id)
  // 2️⃣ Resolve user_profile by auth UID
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("profile_id")
    .eq("uid", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("User profile not found");
  }

  const profileId = profile.profile_id;

  // 3️⃣ Check existing cart item
  const { data: existingItem } = await supabase
    .from("cart")
    .select("*")
    .eq("profile_id", profileId)
    .eq("product_id", productId)
    .single();

  // 4️⃣ Update quantity if exists
  if (existingItem) {
    const { error } = await supabase
      .from("cart")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("cart_id", existingItem.cart_id);

    if (error) throw error;
    return;
  }

  // 5️⃣ Insert new cart row
  const { error } = await supabase.from("cart").insert({
    profile_id: profileId,
    product_id: productId,
    quantity,
  });

  if (error) throw error;
}


export async function fetchCartForPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  // Resolve profile_id
  const { data: profile } = await supabase
    .from("user_profile")
    .select("profile_id")
    .eq("uid", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { data, error } = await supabase
    .from("cart")
    .select(`
      cart_id,
      quantity,
      product:product_id (
        product_id,
        title,
        price,
        images:product_images ( url )
      )
    `)
    .eq("profile_id", profile.profile_id);

  if (error) throw error;
  return data || [];
}

/* ================= BIDS (AUCTION) ================= */

export async function fetchBidsForPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("bid")
    .select(`
      bid_id,
      bid_amount,
      created_at,
      auction:auction_id (
        auction_id,
        end_time,
        product:product_id (
          title,
          images:product_images ( url )
        )
      )
    `)
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}