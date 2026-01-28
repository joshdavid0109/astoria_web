import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../services/homeService";

interface CuratedBlock {
  title: string;
  categoryNames: string[];
  footerText?: string;
}

interface Props {
  categories: Category[];
  blocks: CuratedBlock[];
}

const CuratedCategoryGrid: React.FC<Props> = ({ categories, blocks }) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  /* ================= VISIBILITY CHECK ================= */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new ResizeObserver(() => {
      const el = sectionRef.current;
      if (!el) return;

      const style = window.getComputedStyle(el);
      setIsVisible(style.display !== "none");
    });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  const findCategory = (name: string) =>
    categories.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );

  return (
    <section
      ref={sectionRef}
      className="max-w-[1500px] mx-auto px-4 mt-8"
    >
      <div
        className="
          grid
          grid-cols-1
          gap-4

          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {blocks.map((block, idx) => {
          const cats = block.categoryNames
            .map(findCategory)
            .filter(Boolean)
            .slice(0, 4) as Category[];

          if (cats.length === 0) return null;

          return (
            <div
              key={idx}
              className="
                bg-white
                border
                border-gray-300
                p-4
                flex
                flex-col

                min-h-[320px]
                sm:min-h-[360px]
                lg:h-[390px]
              "
            >
              <h2 className="text-base sm:text-lg font-bold mb-3">
                {block.title}
              </h2>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {cats.map((cat) => (
                  <button
                    key={cat.categories_id}
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(cat.name)}`
                      )
                    }
                    className="text-left group"
                  >
                    <div
                      className="
                        bg-gray-100
                        h-[90px]
                        sm:h-[110px]
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        rounded
                      "
                    >
                      <img
                        src={cat.icon || "/placeholder.png"}
                        alt={cat.name}
                        className="
                          max-h-[60px]
                          sm:max-h-[80px]
                          max-w-[80px]
                          object-contain
                          group-hover:scale-105
                          transition
                        "
                      />
                    </div>

                    <div className="text-xs sm:text-sm mt-1 line-clamp-2">
                      {cat.name}
                    </div>
                  </button>
                ))}
              </div>

              <button className="text-sm text-blue-600 hover:underline mt-3 text-left">
                {block.footerText || "See more"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedCategoryGrid;
