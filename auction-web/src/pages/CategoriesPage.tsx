import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/homeService";
import { useAppContext } from "../context/AppContext";
import type { Category } from "../services/homeService";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { currentMode } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleClick = (cat: Category) => {
    if (currentMode === "auction") {
      navigate(`/auctions?category=${encodeURIComponent(cat.name)}`);
    } else {
      navigate(`/products?category=${encodeURIComponent(cat.name)}`);
    }
  };

  return (
    <main className="max-w-[1500px] mx-auto px-4 py-10 mt-20">
      <h1 className="text-2xl font-semibold mb-8">
        Shop by Category
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.categories_id}
            onClick={() => handleClick(cat)}
            className="
              bg-white
              border border-gray-200
              rounded-lg
              p-4
              flex flex-col items-center
              hover:shadow-md
              transition
            "
          >
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mb-3">
              <img
                src={cat.icon || "/placeholder.png"}
                alt={cat.name}
                className="max-h-12 object-contain"
              />
            </div>

            <div className="text-sm font-medium text-center">
              {cat.name}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;
