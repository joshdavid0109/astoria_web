// src/pages/ProductDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import {
  getProductById,
  getProductImages,
  getAuctionByProductId,
} from "../services/productService";

const placeholder = "https://via.placeholder.com/800x800?text=No+Image";

const formatCurrency = (n: number) =>
  n.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ---------------------------
  // ALWAYS declare hooks at top
  // ---------------------------
  const { addToCart, placeBid, isLoggedIn } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [productRow, setProductRow] = useState<any | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [auctionRow, setAuctionRow] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [now, setNow] = useState(new Date());

  // countdown timer tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // load data
  useEffect(() => {
    async function load() {
      setLoading(true);

      if (!id) {
        setProductRow(null);
        setAuctionRow(null);
        setImages([]);
        setLoading(false);
        return;
      }

      const pid = Number(id);

      const [{ product }, { images: imgs }, { auction }] = await Promise.all([
        getProductById(pid),
        getProductImages(pid),
        getAuctionByProductId(pid),
      ]);

      setProductRow(product ?? null);
      setImages((imgs ?? []).map((i: any) => i.url));
      setAuctionRow(auction ?? null);

      setLoading(false);
    }
    load();
  }, [id]);

  // ---------------------------
  // Create derived item object
  // ---------------------------
  const productAsItem = useMemo(() => {
    if (!productRow)
      return null;

    return {
      id: productRow.product_id,
      title: productRow.title,
      description: productRow.description,
      category: productRow.category,
      currentBid: auctionRow?.current_price ?? productRow.price ?? 0,
      originalPrice: productRow.price ?? 0,
      minBidIncrement: productRow.min_bid_increment ?? 10,
      bidCount: productRow.bid_count ?? 0,
      endTime: auctionRow?.end_time ? new Date(auctionRow.end_time) : null,
      seller: productRow.uid ?? "Seller",
      shipping: productRow.shipping ?? "Free Shipping",
    };
  }, [productRow, auctionRow]);

  // ---------------------------
  // Countdown safely memoized
  // ---------------------------
  const countdown = useMemo(() => {
    if (!productAsItem?.endTime)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

    const diff = productAsItem.endTime.getTime() - now.getTime();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return { days: d, hours: h, minutes: m, seconds: s, ended: false };
  }, [productAsItem, now]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handlePlaceBid = () => {
    if (!isLoggedIn) return navigate("/login");
    if (!productAsItem) return;

    const amt = Number(bidAmount);
    if (!amt) return alert("Enter a valid bid amount");

    const min = (productAsItem.currentBid ?? 0) + productAsItem.minBidIncrement;
    if (amt < min) return alert(`Minimum bid is ${min}`);

    placeBid(productAsItem.id, amt);
    setBidAmount("");
    alert("Bid placed.");
  };

  // ---------------------------
  // SAFE RENDER STARTS HERE
  // ---------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product…
      </div>
    );
  }

  // product does not exist
  if (!productAsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Product not found.
      </div>
    );
  }

  const thumbs = images.length ? images : [placeholder];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        
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
          <span className="text-gray-500">{productAsItem.category}</span>
          <span>/</span>
          <span className="text-orange-600 font-semibold">
            {productAsItem.title}
          </span>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT column */}
            <div className="lg:col-span-7">
              <div className="rounded-xl bg-gray-100 p-6">
                
                <div className="relative rounded-lg bg-white shadow-inner overflow-hidden">
                  <img
                    src={thumbs[selectedImage]}
                    className="w-full h-[520px] object-contain"
                  />
                </div>

                {/* thumbs */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  {thumbs.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                        i === selectedImage
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-200"
                      }`}
                    >
                      <img src={t} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* RIGHT column */}
            <div className="lg:col-span-5">

              {/* Countdown */}
              <div className=" items-center flex gap-4 justify-end mb-4">
                {["Days", "Hours", "Minutes", "Seconds"].map((label) => {
                  const value =
                    label === "Days"
                      ? countdown.days
                      : label === "Hours"
                      ? countdown.hours
                      : label === "Minutes"
                      ? countdown.minutes
                      : countdown.seconds;

                  return (
                    <div key={label} className="text-center">
                      <div className="bg-orange-100 text-orange-700 rounded-md py-3 px-4 text-2xl w-20 font-semibold">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{label}</div>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-2xl font-bold mb-2">{productAsItem.title}</h2>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({productAsItem.bidCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-end mb-4">
                <div className="text-right">
                  <div className="text-4xl font-bold text-orange-600">
                    {formatCurrency(productAsItem.currentBid)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Guaranteed to get by 31 Aug – 2 Sept
                  </div>
                </div>
              </div>

              {/* Bid box */}
              <div className="mt-6">
                <div className="text-sm text-gray-600 mb-1">Minimum Bid:</div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center px-4 py-3 border border-gray-300 rounded-md flex-1">
                    <span className="text-sm text-gray-500 mr-3">PHP</span>
                    <input
                      type="number"
                      className="w-full bg-transparent outline-none text-right font-semibold"
                      placeholder={(
                        productAsItem.currentBid +
                        productAsItem.minBidIncrement
                      ).toLocaleString()}
                      value={bidAmount as any}
                      onChange={(e) =>
                        setBidAmount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="text-sm text-orange-500">
                    + PHP {productAsItem.minBidIncrement}
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Minimum Bid: PHP{" "}
                  {(
                    productAsItem.currentBid + productAsItem.minBidIncrement
                  ).toLocaleString()}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => setBidAmount("")}
                  className="flex-1 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset Bid
                </button>

                <button
                  onClick={handlePlaceBid}
                  className="flex-1 py-3 bg-orange-600 text-white rounded-md font-semibold hover:brightness-95"
                >
                  Confirm Bid
                </button>
              </div>

              {/* Seller */}
              <div className="mt-6 p-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {String(productAsItem.seller).charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{productAsItem.seller}</div>
                    <div className="text-xs text-gray-500">
                      Typical response time: 5 mins
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md">
                  Chat Now
                </button>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {productAsItem.description}
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
