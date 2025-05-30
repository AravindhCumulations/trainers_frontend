'use client'
// src/components/RatingStars.tsx
import { Star } from "lucide-react";

type RatingStarsProps = {
    rating: number;
    max?: number; // optional if you want to show total stars (e.g., 5)
};

export const RatingStars = ({ rating, max = rating }: RatingStarsProps) => (
    <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 text-yellow-400 ${i < rating ? 'fill-[#FE9A00] ' : ''
                    }`}
            />
        ))}
    </div>
);
