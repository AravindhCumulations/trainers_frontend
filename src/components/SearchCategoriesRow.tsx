import React, { useState, useRef } from 'react';
import Loader from './Loader';
import { getCategories } from "@/app/content/categories";

interface SearchCategoriesRowProps {
    onCategoryClick: (categoryName: string) => void;
}

const SearchCategoriesRow: React.FC<SearchCategoriesRowProps> = ({ onCategoryClick }) => {
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleCategoryClick = async (categoryName: string) => {
        setLoadingCategory(categoryName);
        try {
            onCategoryClick(categoryName);
        } catch (error) {
            console.error('Error handling category click:', error);
        } finally {
            setLoadingCategory(null);
        }
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            const currentScroll = container.scrollLeft;
            const targetScroll = direction === 'left'
                ? Math.max(0, currentScroll - scrollAmount)
                : currentScroll + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="max-w-[1050px] mx-4 md:mx-0 w-[370px] md:w-[70%] lg:w-[60%] lg:flex max-w-6xl h-[60px] flex items-center gap-2 mt-0 justify-center bg-white/20 rounded-full py-4 px-3 shadow-md backdrop-blur-md hero-categories">
            <button
                onClick={() => handleScroll('left')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                    <path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z" />
                </svg>
            </button>
            <div
                ref={scrollContainerRef}
                className="flex gap-10 overflow-x-auto hero-categories-list flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollBehavior: 'smooth' }}
            >
                {getCategories("#ffffff").map((category, index) => (
                    <button
                        key={index}
                        className="flex flex-col items-center justify-center gap-1 min-w-[70px] max-w-[70px] hero-category cursor-pointer text-white hover:opacity-80 transition-opacity"
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        {loadingCategory === category.name ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                                <Loader isLoading={true} size="sm" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                                {category.icon}
                            </div>
                        )}
                        <span className="text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">{category.name}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={() => handleScroll('right')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                    <path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z" />
                </svg>
            </button>
        </div>
    );
};

export default SearchCategoriesRow; 