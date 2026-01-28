import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import StarRating from "../components/home/amazon/StarRating";
import ProductInfo from "../components/product/ProductInfo";

import { fetchProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

type ProductImage = {
  url: string;
};

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
}


const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // mobile UI
  const [showSpecs, setShowSpecs] = useState(false);

  // mobile sticky behavior
  const [showStickyBar, setShowStickyBar] = useState(true);
  const lastScrollY = useRef(0);

  // confirmation
  const [showConfirm, setShowConfirm] = useState(false);

  const [cartError, setCartError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const isDesktop = useIsDesktop();


  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (!id) return;

    fetchProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  /* ---------------- MOBILE STICKY HIDE / SHOW ---------------- */
  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 1024) return;

      const currentY = window.scrollY;

      if (currentY > lastScrollY.current && currentY > 120) {
        setShowStickyBar(false);
      } else {
        setShowStickyBar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading product…</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const mainImage =
    product.images?.[activeImage]?.url || "/placeholder.png";

     /* ---------------- VALIDATION ---------------- */
  const validateQuantity = () => {
    if (quantity < 1) {
      setCartError("Please select a valid quantity.");
      return false;
    }
    setCartError(null);
    return true;
  };

  /* ---------------- ACTIONS ---------------- */
  const handleAddToCart = async () => {
    if (!validateQuantity()) return;

    try {
      setAdding(true);
      setAuthError(false);
      setCartError(null);

      await addToCart(product.product_id, quantity);

      // ✅ SHOW CONFIRMATION
      setShowConfirm(true);
    } catch (err: any) {
      if (
        err?.message?.toLowerCase().includes("log") ||
        err?.message?.toLowerCase().includes("auth")
      ) {
        setAuthError(true);
      } else {
        setCartError("Unable to add item to cart.");
      }
    } finally {
      setAdding(false);
    }
  };


  const handleBuyNow = async () => {
    if (!validateQuantity()) return;

    try {
      setAdding(true);
      setAuthError(false);
      setCartError(null);

      await addToCart(product.product_id, quantity);
      window.location.href = "/cart";
    } catch (err: any) {
      if (
        err?.message?.toLowerCase().includes("log") ||
        err?.message?.toLowerCase().includes("auth")
      ) {
        setAuthError(true);
      } else {
        setCartError("Unable to proceed to checkout.");
      }
    } finally {
      setAdding(false);
    }
  };


  return (
    <main className="bg-[#EAEDED] min-h-screen pt-[120px] pb-[160px] lg:pt-0 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* ================= DESKTOP BREADCRUMBS ================= */}
        <div className="hidden lg:block mb-3">
          <Breadcrumbs category={product.category} />
        </div>

        {/* ================= MOBILE ================= */}
        {!isDesktop && (
        <div className="lg:hidden space-y-3">
          {/* IMAGE */}
          <div className="bg-white rounded-md overflow-hidden">
            <img
              src={mainImage}
              className="object-contain w-full h-72"
            />
          </div>

          {/* TITLE + PRICE */}
          <div className="bg-white rounded-md px-4 py-3 space-y-2">
            <h1 className="text-base font-semibold">
              {product.title}
            </h1>

            <StarRating
              rating={product.avg_rating}
              count={product.review_count}
            />

            <div className="text-xl font-semibold">
              CAD ${product.price}
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="bg-white rounded-md px-4 py-3 text-sm text-gray-700">
              {product.description}
            </div>
          )}

          {/* COLLAPSIBLE SPECS */}
          <div className="bg-white rounded-md">
            <button
              onClick={() => setShowSpecs((v) => !v)}
              className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium"
            >
              Product Details
              <span>{showSpecs ? "−" : "+"}</span>
            </button>

            {showSpecs && (
              <div className="px-4 pb-4">
                <ProductInfo product={product} />
              </div>
            )}
          </div>
        </div>
        )}

        {/* ================= DESKTOP (UNCHANGED DESIGN) ================= */}
        {isDesktop && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6">
          {/* ================= LEFT — IMAGE GALLERY ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative group bg-gray-50 rounded-lg h-[420px] overflow-hidden flex items-center justify-center">
                <img
                  src={
                    product.images?.[activeImage]?.url || "/placeholder.png"
                  }
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                  Hover to zoom
                </div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {(product.images?.length
                  ? product.images
                  : [{ url: "/placeholder.png" }]
                ).map((img: ProductImage, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg border bg-white flex items-center justify-center transition ${
                      activeImage === i
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      className="object-contain max-h-14"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= CENTER — INFO ================= */}
          <div className="lg:col-span-5">
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              Visit the {product.brand || "Seller"} Store
            </p>

            <h1 className="text-xl font-semibold mt-1">
              {product.title}
            </h1>

            <StarRating
              rating={product.avg_rating}
              count={product.review_count}
            />

            <div className="mt-2 text-2xl font-semibold">
              CAD ${product.price}
            </div>

            <p className="text-sm text-gray-600 mt-1">
              No import charges & FREE delivery in Canada
            </p>
          </div>

          {/* ================= RIGHT — BUY BOX ================= */}
          <div className="lg:col-span-3 border border-gray-300 rounded p-4 text-sm h-fit">
            <div className="text-2xl font-semibold mb-2">
              CAD ${product.price}
            </div>

            <p className="text-green-700 mb-2">In Stock</p>

            <select
              className="w-full border px-2 py-1 mb-2"
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
                setCartError(null);
              }}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddToCart}
              disabled={adding || !!cartError}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full mb-2 font-medium disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={adding || !!cartError}
              className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full font-medium disabled:opacity-50"
            >
              Buy Now
            </button>

            <div className="bg-white border rounded-md p-6 mt-6">
              <h2 className="text-lg font-semibold mb-3">
                Product Information
              </h2>
              <ProductInfo product={product} />
            </div>

            {/* ================= DESKTOP HISTORY ================= */}
            <div className="bg-white border rounded-md p-6 mt-6">
              <h2 className="text-lg font-semibold mb-3">
                Customer Reviews
              </h2>
              <p className="text-sm text-gray-500">
                Reviews and ratings will appear here.
              </p>
            </div>

            {cartError && (
              <div className="mt-2 text-xs text-red-600">
                {cartError}
              </div>
            )}

            {authError && (
              <div className="mt-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  Log in to continue
                </div>
                <p className="text-gray-600 text-xs mb-2">
                  You must be signed in to add items to your cart.
                </p>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-600">
              Ships from Astoria <br />
              Sold by Astoria Marketplace
            </div>
          </div>
        </div>
        )}
      </div>

      {/* ================= MOBILE STICKY BAR ================= */}
      {!isDesktop && (
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50
            transition-transform duration-300
            ${showStickyBar ? "translate-y-0" : "translate-y-full"}
          `}
        >
          {/* soft fade so content doesn't feel blocked */}
          <div className="h-6 bg-gradient-to-t from-white to-transparent" />

          <div className="bg-white border-t p-4 shadow-lg space-y-3">
            {/* QUANTITY */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Qty
              </label>
              <select
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  setCartError(null);
                }}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-[#FFD814] py-3 rounded-full font-semibold disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={adding}
                className="flex-1 bg-[#FFA41C] py-3 rounded-full font-semibold disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* ERROR */}
            {cartError && (
              <div className="text-xs text-red-600">
                {cartError}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ================= CONFIRMATION MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={() => setShowConfirm(false)}
          />

          {/* MODAL (NOT BLURRED) */}
          <div className="relative z-10 bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">
              Added to Cart
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {product.title} was added to your cart.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border rounded-full py-2"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 bg-[#FFD814] rounded-full py-2 font-semibold"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default ProductDetailsPage;
