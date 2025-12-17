import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating?: number;        // 0–5
  count?: number;         // review count
  size?: number;
}

const StarRating: React.FC<Props> = ({
  rating = 0,
  count = 0,
  size = 14,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1 text-sm">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                size={size}
                className="fill-[#FFA41C] text-[#FFA41C]"
              />
            );
          }
          if (i === fullStars && hasHalf) {
            return (
              <Star
                key={i}
                size={size}
                className="fill-[#FFA41C]/50 text-[#FFA41C]"
              />
            );
          }
          return (
            <Star
              key={i}
              size={size}
              className="text-gray-300"
            />
          );
        })}
      </div>

      {count > 0 && (
        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
          {count}
        </span>
      )}
    </div>
  );
};

export default StarRating;
