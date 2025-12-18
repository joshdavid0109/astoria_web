import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/home/amazon/Breadcrumbs";
import Filters from "../components/home/amazon/Filters";
import Pagination from "../components/home/amazon/Pagination";
import StarRating from "../components/home/amazon/StarRating";
import { fetchProducts } from "../services/homeService";

const LIMIT = 48;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const category = params.get("category") || undefined;
  const search = params.get("search") || undefined;

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>();
  const [minRating, setMinRating] = useState<number>();
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});

  useEffect(() => {
    fetchProducts({
      category,
      search,
      minRating,
      minPrice: price.min,
      maxPrice: price.max,
      sort,
      page,
      limit: LIMIT,
    }).then((res) => {
        console.log("products", res.data)
      setProducts(res.data);
      setTotal(res.count ?? 0);
    });
  }, [category, search, page, sort, minRating, price]);

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <Breadcrumbs category={category} />

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            {total} results {category && <>for <b>"{category}"</b></>}
          </div>

          <select
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 text-sm"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Filters
            setMinRating={setMinRating}
            setPrice={(min, max) => setPrice({ min, max })}
          />

          {/* PRODUCTS GRID */}
          <section className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => 

              <div
                key={p.id}
                className="bg-white border p-3 hover:shadow-md transition"
              >
                {/* IMAGE (clickable) */}
                <div
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="h-[220px] bg-gray-100 flex items-center justify-center mb-2 cursor-pointer overflow-hidden"
                >
                  <img
                    loading="lazy"
                    src={p.image_url}
                    alt={p.title}
                    className="
                      object-contain max-h-[200px]
                      transition-transform duration-200
                      hover:scale-105
                    "
                  />
                </div>

                {/* TITLE (clickable) */}
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="
                    text-sm line-clamp-2 cursor-pointer
                    hover:text-[#C7511F]
                  "
                >
                  {p.title}
                </div>

                <StarRating
                  rating={p.avg_rating}
                  count={p.review_count}
                />

                {p.price && (
                  <div className="font-semibold mt-1">
                    CAD ${p.price}
                  </div>
                )}

                {/* ADD TO CART (no navigation) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: addToCart(p)
                  }}
                  className="
                    mt-2 bg-[#FFD814] hover:bg-[#F7CA00]
                    px-3 py-1 rounded-full text-sm
                  "
                >
                  Add to Cart
                </button>
              </div>
            )}
          </section>
        </div>

        <Pagination
          page={page}
          total={total}
          limit={LIMIT}
          onChange={setPage}
        />
      </div>
    </main>
  );
};

export default ProductsPage;
