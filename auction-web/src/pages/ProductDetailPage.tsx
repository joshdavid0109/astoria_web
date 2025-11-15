// src/pages/ProductDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Star, Clock } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { AuctionItem } from "../types/types";
import {
  getProductById,
  getProductImages,
  getAuctionByProductId,
} from "../services/productService";

const placeholder = "https://via.placeholder.com/800x800?text=No+Image";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    addToCart,
    placeBid,
    isLoggedIn,
    toggleWatchlist,
    isInWatchlist,
    currentMode,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [productRow, setProductRow] = useState<any | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [auctionRow, setAuctionRow] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState<number | "">("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const pid = Number(id);

        const [
          { product, error: pErr },
          { images: imgs, error: iErr },
          { auction, error: aErr },
        ] = await Promise.all([
          getProductById(pid),
          getProductImages(pid),
          getAuctionByProductId(pid),
        ]);

        if (pErr) console.error(pErr);
        else setProductRow(product);

        setImages((imgs || []).map((r: any) => r.url).filter(Boolean));

        if (aErr) console.error(aErr);
        else setAuctionRow(auction || null);
      } catch (err) {
        console.error("load product detail error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const isAuction = useMemo(() => {
    if (auctionRow) return true;
    return !!productRow?.is_auction;
  }, [auctionRow, productRow]);

  const price = useMemo(() => {
    if (auctionRow?.current_price != null) return Number(auctionRow.current_price);
    if (productRow?.price != null) return Number(productRow.price);
    return 0;
  }, [auctionRow, productRow]);

  const productAsItem: AuctionItem = useMemo(() => {
    return {
      id: String(productRow?.product_id ?? id ?? "0"),
      title: productRow?.title ?? "Product",
      description: productRow?.description ?? "",
      currentBid: price,
      originalPrice: productRow?.price ?? undefined,
      endTime: auctionRow?.end_time ? new Date(auctionRow.end_time) : undefined,
      image: images[0] || placeholder,
      category: productRow?.category ?? "",
      condition: productRow?.condition ?? "Good",
      location: productRow?.location ?? "Unknown",
      bidCount: productRow?.bid_count ?? 0,
      seller: productRow?.seller_id ? String(productRow.seller_id) : "Seller",
      shipping: productRow?.shipping ?? "0",
      minBidIncrement: productRow?.min_bid_increment ?? 10,
      featured: false,
      watchCount: productRow?.watch_count ?? 0,
    };
  }, [productRow, auctionRow, images, price, id]);

  const handlePlaceBid = () => {
    if (!isLoggedIn) return navigate("/login");

    const amt = Number(bidAmount);
    if (!amt || isNaN(amt)) return alert("Enter a valid bid amount");

    const min =
      (productAsItem.currentBid || 0) +
      (productAsItem.minBidIncrement || 10);

    if (amt < min) return alert(`Minimum bid is ${min}`);

    if (placeBid(productAsItem.id, amt)) {
      alert(`Bid placed: PHP ${amt}`);
      setBidAmount("");
    } else alert("Failed to place bid");
  };

  const handleAddToCart = () => {
    addToCart(productAsItem);
    alert("Added to cart");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );

  if (!productRow)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found.
      </div>
    );

  const thumbs = images.length ? images : [productAsItem.image];

  // auction timer
  const timeLeftMs = productAsItem.endTime
    ? Math.max(0, productAsItem.endTime.getTime() - Date.now())
    : 0;
  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-orange-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <span>/</span>
          <span className="text-gray-500">{productRow.category}</span>
          <span>/</span>
          <span className="text-orange-600 font-semibold">
            {productRow.title}
          </span>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT – Gallery */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full max-w-[450px] h-[450px] rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center relative shadow-sm">
                <img
                  src={thumbs[selectedImage] || placeholder}
                  alt={productRow.title}
                  className="w-full h-full object-contain"
                />

                {isAuction && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow-md">
                    AUCTION
                  </div>
                )}

                <button
                  onClick={() => toggleWatchlist(productAsItem.id)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-md ${
                    isInWatchlist(productAsItem.id)
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isInWatchlist(productAsItem.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() =>
                    setSelectedImage((s) => Math.max(0, s - 1))
                  }
                  className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  ←
                </button>

                <div className="flex gap-3">
                  {thumbs.map((u, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 shadow-sm ${
                        selectedImage === idx
                          ? "border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={u || placeholder}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setSelectedImage((s) =>
                      Math.min(thumbs.length - 1, s + 1)
                    )
                  }
                  className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  →
                </button>
              </div>
            </div>

            {/* RIGHT – INFO */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {productRow.title}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({productAsItem.bidCount} reviews)
                </span>
              </div>

              {/* AUCTION MODE */}
              {isAuction ? (
                <div className="bg-orange-50 rounded-lg p-5 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        Current Bid
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        PHP {productAsItem.currentBid.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Time Left
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 text-xl font-bold">
                        <Clock className="w-5 h-5" />
                        <span>
                          {hours > 0
                            ? `${hours}h ${minutes}m`
                            : `${minutes}m`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                    <div>
                      <strong>Total Bids:</strong> {productAsItem.bidCount}
                    </div>
                    <div>
                      <strong>Min Increment:</strong> PHP{" "}
                      {productAsItem.minBidIncrement}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="block text-sm text-gray-700 mb-2">
                      Your Bid
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        PHP
                      </span>
                      <input
                        type="number"
                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                        placeholder={`Min: PHP ${
                          (productAsItem.currentBid || 0) +
                          (productAsItem.minBidIncrement || 10)
                        }`}
                        value={bidAmount as any}
                        onChange={(e) =>
                          setBidAmount(
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <button
                      onClick={handlePlaceBid}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              ) : (
                /* MARKETPLACE MODE */
                <div className="bg-orange-50 rounded-lg p-5 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Price</div>
                      <div className="text-3xl font-bold text-orange-600">
                        PHP {price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="w-full mt-3 border border-orange-600 text-orange-600 py-3 rounded-md font-semibold"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* SHIPPING + SELLER */}
              <div className="mb-6">
                <div className="text-sm text-gray-600">Shipping</div>
                <div className="text-orange-600 font-semibold">
                  Guaranteed to get by 31 Aug – 2 Sept
                </div>
              </div>

              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {String(
                      productRow.seller_id ?? productRow.seller
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Typical response time: 5 mins
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md">
                  Chat Now
                </button>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {productRow.description}
                </p>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
