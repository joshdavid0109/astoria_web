import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import StarRating from "../components/home/amazon/StarRating";
import { fetchProductById } from ".././services/productService";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-4">

        <Breadcrumbs category={product.category} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6">

  {/* LEFT — IMAGE GALLERY */}
  <div className="lg:col-span-4 flex gap-3">
    {/* thumbnails */}
    <div className="flex flex-col gap-2">
      {[product.image_url].map((img: string, i: number) => (
        <img
          key={i}
          src={img}
          className="w-14 h-14 border cursor-pointer object-contain"
        />
      ))}
    </div>

    {/* main image */}
    <div className="flex-1">
      <img
        src={product.image_url}
        className="w-full object-contain hover:scale-105 transition-transform"
      />
    </div>
  </div>

  {/* CENTER — PRODUCT INFO */}
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

    

    {/* PRODUCT DETAILS */}
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Product details</h3>

      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-gray-500">Fabric type</div>
        <div>100% Cotton</div>

        <div className="text-gray-500">Care instructions</div>
        <div>Machine Wash</div>

        <div className="text-gray-500">Origin</div>
        <div>Imported</div>
      </div>
    </div>

    {/* ABOUT THIS ITEM */}
    <div className="mt-6">
      <h3 className="font-semibold mb-2">About this item</h3>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Printed with eco-friendly inks</li>
        <li>Classic fit</li>
        <li>Officially licensed product</li>
      </ul>
    </div>
  </div>

  {/* RIGHT — BUY BOX */}
  <div className="lg:col-span-3 border border-gray-300 rounded p-4 text-sm h-fit">
    <div className="text-2xl font-semibold mb-2">
      CAD ${product.price}
    </div>

    <p className="text-green-700 mb-2">In Stock</p>

    <select className="w-full border px-2 py-1 mb-3">
      {[1, 2, 3, 4, 5].map((q) => (
        <option key={q}>{q}</option>
      ))}
    </select>

    <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full mb-2">
      Add to Cart
    </button>

    <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full">
      Buy Now
    </button>

    <div className="mt-3 text-xs text-gray-600">
      Ships from Astoria<br />
      Sold by Astoria Marketplace
    </div>
  </div>

</div>


        {/* Reviews section */}
        <div className="bg-white mt-6 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Customer Reviews
          </h2>

          {product.review_count > 0 ? (
            <div className="text-sm text-gray-600">
              ⭐ {product.avg_rating} average based on{" "}
              {product.review_count} reviews
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No reviews yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
