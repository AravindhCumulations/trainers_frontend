'use client'
// src/components/RatingStars.tsx
import { Star } from "lucide-react";

type RatingStarsProps = {
    rating: number;
    max?: number; // optional if you want to show total stars (e.g., 5)
};


export const RatingStars = ({ rating, max = 5 }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {Array.from({ length: max }, (_, i) => {
        if (i < fullStars) {
          // full star
          return (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-[#FE9A00]"
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          // half star
          return (
            <div
              key={i}
              className="relative w-4 h-4 flex-shrink-0"
              style={{ lineHeight: 0 }}
            >
              {/* base outline */}
              <Star className="absolute w-4 h-4 text-yellow-400" />
              {/* half fill via mask */}
              <svg
                viewBox="0 0 24 24"
                className="absolute w-4 h-4 text-yellow-400"
              >
                <defs>
                  <clipPath id={`half-clip-${i}`}>
                    <rect x="0" y="0" width="12" height="24" />
                  </clipPath>
                </defs>
                <Star
                  className="fill-[#FE9A00]"
                  style={{ clipPath: `url(#half-clip-${i})` }}
                />
              </svg>
            </div>
          );
        } else {
          // empty star
          return (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400"
            />
          );
        }
      })}
    </div>
  );
};