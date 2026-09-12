import React from "react";
import { Star } from "lucide-react";

export function RatingStars({
  rating,
  maxRating = 5,
  size = "sm",
  showScore = false,
}: {
  rating: number;
  maxRating?: number;
  size?: "xs" | "sm" | "md";
  showScore?: boolean;
}) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;

          return (
            <Star
              key={i}
              className={`${sizeClasses} ${
                filled || partial
                  ? "text-[#D4AF6A] fill-[#D4AF6A]"
                  : "text-white/20"
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="font-mono text-xs font-bold text-[#ECECEE]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
