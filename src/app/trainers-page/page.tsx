"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TrainerGrid from '../../components/TrainerGrid';
import { useSearchParams, useRouter } from 'next/navigation';
import { trainerApis } from '../../lib/apis/trainer.apis';
import { getCurrentUserName } from '@/lib/utils/auth.utils'
import { useLoading } from '@/context/LoadingContext';
import { TrainerCardModel } from '@/models/trainerCard.model';
import { indianCities } from '@/app/content/IndianCities';
import { getCategories } from "@/app/content/categories";
import { usePopup } from '@/lib/hooks/usePopup';
import Popup from '@/components/Popup';
import { useUser } from '@/context/UserContext';


function TrainersPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [citySearch, setCitySearch] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<TrainerCardModel[]>([]);
    const [searchTitle, setSearchTitle] = useState('All Trainers');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { showLoader, hideLoader } = useLoading();
    const { popupState, showConfirmation, hidePopup } = usePopup();
    const { user } = useUser();

    // Add state for selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const callLogin = () => {
        showConfirmation(
            'Please login to continue',
            () => {
                router.push('/login');
            },
            {
                title: 'Login Required',
                confirmText: 'Login',
                cancelText: 'Stay'
            }
        );
    };

    const updateUrlParams = (search: string, city: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (search) {
            params.set('search_text', search);
        } else {
            params.delete('search_text');
        }

        if (city) {
            params.set('city', city);
        } else {
            params.delete('city');
        }

        router.push(`?${params.toString()}`);
    };

    const handleSearch = async (searchValue = searchText, cityValue = citySearch, page = currentPage, pageSize = itemsPerPage) => {
        try {
            setIsLoading(true);
            updateUrlParams(searchValue, cityValue);
            const response = await trainerApis.searchTrainers(
                user.email,
                searchValue,
                cityValue,
                page,
                pageSize
            );

            const trainers = response.data?.results || [];
            const total = response.data?.total || 0;

            setSearchResults(trainers);
            setTotalItems(total);

            if (searchValue || cityValue) {
                setSearchTitle(`Search Results ${searchValue ? `for  "${searchValue}"` : ''}${cityValue ? ` in "${cityValue}"` : ''}`);
            } else {
                setSearchTitle('All Trainers');
            }
        } catch (error) {
            console.error('Error searching trainers:', error);
            setSearchResults([]);
            setSearchTitle('All Trainers');
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newConfig: { page: number; pageSize: number }) => {
        setCurrentPage(newConfig.page);
        setItemsPerPage(newConfig.pageSize);
        handleSearch(searchText, citySearch, newConfig.page, newConfig.pageSize);
    };

    const handleSearchClick = () => {
        setCurrentPage(1);
        setSearchResults([]);
        handleSearch(searchText, citySearch, 1, itemsPerPage);
    };

    const handleClearSearch = () => {
        setSearchText('');
        setCurrentPage(1);
        setSearchResults([]);
        setSelectedCategory(null); // Clear selected category
        updateUrlParams('', citySearch);
        handleSearch('', citySearch, 1, itemsPerPage);
    };

    const handleClearCity = () => {
        setCitySearch('');
        setCurrentPage(1);
        setSearchResults([]);
        updateUrlParams(searchText, '');
        handleSearch(searchText, '', 1, itemsPerPage);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            setSearchResults([]);
            handleSearch();
        }
    };

    const handleWishlistUpdate = async (trainer: TrainerCardModel, isWishlisted: boolean) => {
        try {
            // Update the trainer in the search results
            setSearchResults(prevResults =>
                prevResults.map(t =>
                    t.name === trainer.name
                        ? { ...t, is_wishlisted: isWishlisted ? 1 : 0 }
                        : t
                )
            );

            // If we're on a specific page, refresh the current page data to maintain consistency
            if (currentPage > 1) {
                await handleSearch(searchText, citySearch, currentPage, itemsPerPage);
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    useEffect(() => {
        const initializeSearch = async () => {
            try {
                showLoader();

                const city = searchParams.get('city') || undefined;
                const searchText = searchParams.get('search_text') || undefined;

                if (city || searchText) {
                    if (city) setCitySearch(city);
                    if (searchText) setSearchText(searchText);
                    if (searchText || city) {
                        setSearchTitle(`Search Results for${searchText ? ` "${searchText}"` : ''}${city ? ` in "${city}"` : ''}`);
                    }
                }
                await handleSearch(searchText, city, 1, itemsPerPage);
            } catch (error) {
                console.error('Error in initial search:', error);
                setSearchResults([]);
                setSearchTitle('All Trainers');
                setTotalItems(0);
                setCitySearch('');
                setSearchText('');
            }
            finally {
                hideLoader()
            }
        };

        initializeSearch();
    }, [searchParams]);

    useEffect(() => {

    }, [searchResults]);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Popup
                isOpen={popupState.isOpen}
                type={popupState.type}
                message={popupState.message}
                title={popupState.title}
                onClose={hidePopup}
                onConfirm={popupState.onConfirm}
                confirmText={popupState.confirmText}
                cancelText={popupState.cancelText}
            />
            <section className="relative w-full mx-auto flex flex-col items-center header-hero-section bg-white">
                <div className="w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white  lg:pb-10 px-4  lg:px-8 flex flex-col items-center rounded-b-[20px] sm:rounded-b-[30px] lg:rounded-b-[40px] relative z-10 header-hero-bg">
                    <Navbar bgColor='transparent' />
                    <div className="flex w-full justify-center items-center py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-3 sm:gap-4 items-center justify-center">
                            <div className="w-full lg:w-[60%] flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-3 sm:mb-4 lg:mb-5 hero-search-bar">
                                <input
                                    type="text"
                                    placeholder="Search by trainer name, skill, or city..."
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        if (e.target.value === '') {
                                            setCurrentPage(1);
                                            setSearchResults([]);
                                            setSelectedCategory(null);
                                            updateUrlParams('', citySearch);
                                            handleSearch('', citySearch, 1, itemsPerPage);
                                        }
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-3 sm:px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-sm sm:text-base font-normal hero-search-input"
                                />
                                {searchText && (
                                    <div className="pr-2 cursor-pointer" onClick={handleClearSearch}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                                        </svg>
                                    </div>
                                )}
                                <div className="pr-2 cursor-pointer" onClick={handleSearchClick}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                                        <mask id="mask0_201_1588" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_201_1588)">
                                            <path d="M19.5425 20.577L13.2618 14.296C12.7618 14.7088 12.1868 15.0319 11.5368 15.2653C10.8868 15.4986 10.2144 15.6153 9.51955 15.6153C7.81038 15.6153 6.36388 15.0235 5.18005 13.84C3.99621 12.6565 3.4043 11.2103 3.4043 9.50152C3.4043 7.79285 3.99605 6.34618 5.17955 5.16152C6.36305 3.97702 7.80921 3.38477 9.51805 3.38477C11.2267 3.38477 12.6734 3.97668 13.858 5.16051C15.0425 6.34435 15.6348 7.79085 15.6348 9.50002C15.6348 10.2142 15.515 10.8963 15.2753 11.5463C15.0355 12.1963 14.7155 12.7616 14.3155 13.2423L20.5963 19.523L19.5425 20.577ZM9.51955 14.1155C10.808 14.1155 11.8994 13.6683 12.7935 12.774C13.6879 11.8798 14.135 10.7885 14.135 9.50002C14.135 8.21152 13.6879 7.12018 12.7935 6.22601C11.8994 5.33168 10.808 4.88452 9.51955 4.88452C8.23105 4.88452 7.13971 5.33168 6.24555 6.22601C5.35121 7.12018 4.90405 8.21152 4.90405 9.50002C4.90405 10.7885 5.35121 11.8798 6.24555 12.774C7.13971 13.6683 8.23105 14.1155 9.51955 14.1155Z" fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full lg:w-[40%] flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-3 sm:mb-4 lg:mb-5 hero-search-city-bar relative">
                                <select
                                    value={citySearch}
                                    onChange={(e) => {
                                        setCitySearch(e.target.value);
                                        setCurrentPage(1);
                                        setSearchResults([]);
                                        setSelectedCategory(null);
                                        updateUrlParams(searchText, e.target.value);
                                        handleSearch(searchText, e.target.value, 1, itemsPerPage);
                                    }}
                                    className="flex-1 px-3 sm:px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-sm sm:text-base font-normal hero-search-input appearance-none cursor-pointer hover:bg-white/10 transition-colors duration-200"
                                >
                                    <option value="" className="text-gray-900 bg-white">Choose City</option>
                                    {indianCities.map((city) => (
                                        <option key={city} value={city} className="text-gray-900 bg-white hover:bg-blue-50">
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-10 sm:right-12 pointer-events-none">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                                        <path d="M7 10l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {citySearch && (
                                    <div className="pr-2 cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors duration-200" onClick={handleClearCity}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-grow px-4">
                <div className="w-full max-w-[1352px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {searchTitle}
                    </h2>
                    {totalItems > 0 && (
                        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                        </p>
                    )}
                </div>

                <TrainerGrid
                    trainers={searchResults}
                    paginationMode="server"
                    paginationConfig={{
                        page: currentPage,
                        pageSize: itemsPerPage,
                        totalItems: totalItems
                    }}
                    onPageChange={handlePageChange}
                    onWishlistUpdate={handleWishlistUpdate}
                    callLogin={callLogin}
                    isLoading={isLoading}
                />

            </main>

            <div className="w-full max-w-[1352px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Similar Categories</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                    {getCategories("#3B82F6").map((category, index) => (
                        <button
                            onClick={() => {
                                setSearchText(category.name);
                                setSelectedCategory(category.name); // Set selected category
                                handleSearch(category.name, '', 1, itemsPerPage);
                            }}
                            key={index}
                            className={`py-1.5 sm:py-2 px-3 sm:px-4 
                                ${selectedCategory === category.name
                                    ? 'border-2 border-blue-600 bg-blue-50 font-bold text-blue-700'
                                    : 'bg-blue-100 text-[#3B82F6]'
                                }
                                text-xs sm:text-sm font-medium rounded-md items-center flex flex-col hover:bg-blue-200 transition-colors duration-200`}
                        >
                            {category.icon}
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function TrainersPage() {
    return (
        <Suspense fallback={null}>
            <TrainersPageContent />
        </Suspense>
    );
} 