import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import StarRating from "../components/home/amazon/StarRating";
import { fetchProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

type ProductImage = {
  url: string;
};

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [cartError, setCartError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading product…</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

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
    <main className="bg-[#EAEDED] min-h-screen mt-25">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <Breadcrumbs category={product.category} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6">
          {/* LEFT — IMAGE GALLERY */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative group bg-gray-50 rounded-lg h-[420px] overflow-hidden flex items-center justify-center">
                <img
                  src={product.images?.[activeImage]?.url || "/placeholder.png"}
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

          {/* CENTER — INFO */}
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

          {/* RIGHT — BUY BOX */}
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
              Ships from Astoria
              <br />
              Sold by Astoria Marketplace
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
