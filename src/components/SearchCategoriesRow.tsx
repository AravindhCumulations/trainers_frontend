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
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-[70%] lg:max-w-[65.6rem] flex items-center gap-1 sm:gap-2 mt-0 justify-center bg-white/20 rounded-full py-1 sm:py-3 md:py-2 px-2 sm:px-3 md:px-2 shadow-md backdrop-blur-md hero-categories">
            <button
                onClick={() => handleScroll('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-left flex-shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#000" className="sm:w-6 sm:h-6">
                    <path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z" />
                </svg>
            </button>
            <div
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-6 md:gap-10 overflow-x-auto hero-categories-list flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollBehavior: 'smooth' }}
            >
                {getCategories("#ffffff").map((category, index) => (
                    <button
                        key={index}
                        className="group flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-[48px] max-w-[48px] sm:min-w-[60px] sm:max-w-[60px] md:min-w-[70px] md:max-w-[70px] hero-category cursor-pointer text-white hover:opacity-80 transition-opacity hover:bg-white/20 rounded p-1"
                        onClick={() => handleCategoryClick(category.name)}
                        title={category.name}
                    >
                        {loadingCategory === category.name ? (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                <Loader isLoading={true} size="sm" />
                            </div>
                        ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                {category.icon}
                            </div>
                        )}
                        <span className="relative w-full flex justify-center">
                            <span className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                {category.name}
                            </span>
                        </span>
                        {/* <span className="absolute z-50 top-full mt-1 hidden group-hover:flex bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                                {category.name}
                        </span> */}
                    </button>
                ))}
            </div>
            <button
                onClick={() => handleScroll('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-right flex-shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#000" className="sm:w-6 sm:h-6">
                    <path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z" />
                </svg>
            </button>
        </div>
    );
};

export default SearchCategoriesRow; 