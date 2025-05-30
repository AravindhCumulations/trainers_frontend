import React, { useState, ReactElement } from 'react';
import Link from 'next/link';
import Loader from './Loader';
import axios from 'axios';
import { categories } from "@/app/content/categories";

interface Category {
    name: string;
    icon: ReactElement;
}

interface SearchCategoriesRowProps {
    onCategoryClick: (categoryName: string) => void;
}

const SearchCategoriesRow: React.FC<SearchCategoriesRowProps> = ({ onCategoryClick }) => {
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);


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

    return (
        <div className="max-w-6xl h-[60px] flex items-center gap-2 mt-0 justify-center bg-white/20 rounded-full py-4 px-3 shadow-md backdrop-blur-md hero-categories">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-left">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                    <path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z" />
                </svg>
            </button>
            <div className="flex gap-10 overflow-x-auto overflow-x-hidden scrollbar-hide hero-categories-list">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className="flex flex-col items-center min-w-[70px] hero-category cursor-pointer"
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        {loadingCategory === category.name ? (
                            <div className="w-6 h-6">
                                <Loader isLoading={true} size="sm" />
                            </div>
                        ) : (
                            category.icon
                        )}
                        <span className="text-xs font-medium">{category.name}</span>
                    </button>
                ))}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-xl font-bold hover:bg-white/50 transition hero-categories-right">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                    <path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z" />
                </svg>
            </button>
        </div>
    );
};

export default SearchCategoriesRow; 