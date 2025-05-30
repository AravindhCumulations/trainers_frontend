"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TrainerGrid from '../../components/TrainerGrid';
import { useSearchParams } from 'next/navigation';
import { trainerApis } from '../../lib/apis/trainer.apis';
import { categories } from '@/app/content/categories'
import { getCurrentUserName } from '@/lib/utils/auth.utils'

const dummyTrainers = [
    {
        name: "sanya_gupta",
        full_name: "Sanya Gupta",
        first_name: "Sanya",
        last_name: "Gupta",
        image: "/sanya.jpg", // Replace with actual image path or URL
        avg_rating: 4.5,
        location: "Pune",
        charge: 1800,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Conflict Resolution" }, { expetrise: "Team Building" }],
    },
    {
        name: "rahul_vedfrma",
        full_name: "Rahul Verma",
        first_name: "Rahul",
        last_name: "Verma",
        image: "/rahul.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Delhi",
        charge: 2500,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Public Speaking" }, { expetrise: "Leadership" }],
    },
    {
        name: "anjalisd_mehta",
        full_name: "Anjali Mehta",
        first_name: "Anjali",
        last_name: "Mehta",
        image: "/anjali.jpg", // Replace with actual image path or URL
        avg_rating: 5.0,
        location: "Mumbai",
        charge: 2200,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Emotional Intelligence" }, { expetrise: "Life Coaching" }],
    },
    {
        name: "sddfkiran_rao",
        full_name: "Kiran Rao",
        first_name: "Kiran",
        last_name: "Rao",
        image: "/kiran.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Bengaluru",
        charge: 1800,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Time Management" }, { expetrise: "Career Growth" }],
    },
    {
        name: "sanyfdsa_gupta",
        full_name: "Sanya Gupta",
        first_name: "Sanya",
        last_name: "Gupta",
        image: "/sanya.jpg", // Replace with actual image path or URL
        avg_rating: 4.5,
        location: "Pune",
        charge: 1800,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Conflict Resolution" }, { expetrise: "Team Building" }],
    },
    {
        name: "rasahul_verma",
        full_name: "Rahul Verma",
        first_name: "Rahul",
        last_name: "Verma",
        image: "/rahul.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Delhi",
        charge: 2500,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Public Speaking" }, { expetrise: "Leadership" }],
    },
    {
        name: "agffnjali_mehta",
        full_name: "Anjali Mehta",
        first_name: "Anjali",
        last_name: "Mehta",
        image: "/anjali.jpg", // Replace with actual image path or URL
        avg_rating: 5.0,
        location: "Mumbai",
        charge: 2200,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Emotional Intelligence" }, { expetrise: "Life Coaching" }],
    },
    {
        name: "kiran_asdrao",
        full_name: "Kiran Rao",
        first_name: "Kiran",
        last_name: "Rao",
        image: "/kiran.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Bengaluru",
        charge: 1800,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Time Management" }, { expetrise: "Career Growth" }],
    },
    {
        name: "sanya_sagupta 2",
        full_name: "Sanya Gupta",
        first_name: "Sanya",
        last_name: "Gupta",
        image: "/sanya.jpg", // Replace with actual image path or URL
        avg_rating: 4.5,
        location: "Pune",
        charge: 1800,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Conflict Resolution" }, { expetrise: "Team Building" }],
    },
    {
        name: "rahul_gfverma",
        full_name: "Rahul Verma",
        first_name: "Rahul",
        last_name: "Verma",
        image: "/rahul.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Delhi",
        charge: 2500,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Public Speaking" }, { expetrise: "Leadership" }],
    },
    {
        name: "anjali_measahta",
        full_name: "Anjali Mehta",
        first_name: "Anjali",
        last_name: "Mehta",
        image: "/anjali.jpg", // Replace with actual image path or URL
        avg_rating: 5.0,
        location: "Mumbai",
        charge: 2200,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Emotional Intelligence" }, { expetrise: "Life Coaching" }],
    },
    {
        name: "kiran_rssao",
        full_name: "Kiran Rao",
        first_name: "Kiran",
        last_name: "Rao",
        image: "/kiran.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Bengaluru",
        charge: 1800,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Time Management" }, { expetrise: "Career Growth" }],
    },
    {
        name: "sanya_gupffta",
        full_name: "Sanya Gupta",
        first_name: "Sanya",
        last_name: "Gupta",
        image: "/sanya.jpg", // Replace with actual image path or URL
        avg_rating: 4.5,
        location: "Pune",
        charge: 1800,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Conflict Resolution" }, { expetrise: "Team Building" }],
    },
    {
        name: "rahul_vasaerma",
        full_name: "Rahul Verma",
        first_name: "Rahul",
        last_name: "Verma",
        image: "/rahul.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Delhi",
        charge: 2500,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Public Speaking" }, { expetrise: "Leadership" }],
    },
    {
        name: "anjafdfli_mehta",
        full_name: "Anjali Mehta",
        first_name: "Anjali",
        last_name: "Mehta",
        image: "/anjali.jpg", // Replace with actual image path or URL
        avg_rating: 5.0,
        location: "Mumbai",
        charge: 2200,
        is_wishlisted: 0,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Emotional Intelligence" }, { expetrise: "Life Coaching" }],
    },
    {
        name: "kiran_aarao",
        full_name: "Kiran Rao oho",
        first_name: "Kiran",
        last_name: "Rao",
        image: "/kiran.jpg", // Replace with actual image path or URL
        avg_rating: 4.0,
        location: "Bengaluru",
        charge: 1800,
        is_wishlisted: 1,
        is_unlocked: 1,
        expertise_in: [{ expetrise: "Time Management" }, { expetrise: "Career Growth" }],
    },
];

export default function TrainersPage() {

    const searchParams = useSearchParams();
    const [citySearch, setCitySearch] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchTitle, setSearchTitle] = useState('All Trainers');
    const allExpertise = dummyTrainers.flatMap(trainer => trainer.expertise_in.map(e => e.expetrise));

    const handleSearch = (searchValue = searchText, cityValue = citySearch) => {
        console.log('Search params:', { searchValue, cityValue });

        trainerApis.searchTrainers(getCurrentUserName(), searchValue, cityValue)
            .then(response => {
                console.log('Full API response:', response);
                console.log('Response data:', response.data);
                console.log('Trainers array (attempting data.trainers):', response.data?.trainers);
                console.log('Response message:', response.message);
                console.log('Response message[0]:', response.message?.[0]);

                // Assuming trainers are in response.message or response.message[0]
                const trainers = Array.isArray(response.message) ? response.message : (Array.isArray(response.message?.[0]?.trainers) ? response.message[0].trainers : []);

                console.log('Setting search results with:', trainers);
                setSearchResults(trainers);

                // Update search title after successful API call
                if (searchValue || cityValue) {
                    setSearchTitle(`Search Results for${searchValue ? ` "${searchValue}"` : ''}${cityValue ? ` in "${cityValue}"` : ''}`);
                } else {
                    setSearchTitle('All Trainers');
                }
            })
            .catch(error => {
                console.error('Error searching trainers:', error);
                setSearchResults([]);
                setSearchTitle('All Trainers');
            });
    };

    const handleSearchClick = () => {
        handleSearch();
    };

    const handleClearSearch = () => {
        setSearchText('');
        handleSearch('', citySearch);
    };

    const handleClearCity = () => {
        setCitySearch('');
        handleSearch(searchText, '');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const city = searchParams.get('city') || undefined;
        const searchText = searchParams.get('search_text') || undefined;

        console.log('URL params:', { city, searchText });

        if (city || searchText) {
            if (city) setCitySearch(city);
            if (searchText) setSearchText(searchText);
            if (searchText || city) {
                setSearchTitle(`Search Results for${searchText ? ` "${searchText}"` : ''}${city ? ` in "${city}"` : ''}`);
            }
        }
        trainerApis.searchTrainers(getCurrentUserName(), searchText, city)
            .then(response => {
                console.log('Initial search - Full API response:', response);
                console.log('Initial search - Response data:', response.data);
                console.log('Initial search - Trainers array (attempting data.trainers):', response.data?.trainers);
                console.log('Initial search - Response message:', response.message);
                console.log('Initial search - Response message[0]:', response.message?.[0]);

                // Assuming trainers are in response.message or response.message[0]
                const trainers = Array.isArray(response.message) ? response.message : (Array.isArray(response.message?.[0]?.trainers) ? response.message[0].trainers : []);

                console.log('Initial search - Setting search results with:', trainers);
                setSearchResults(trainers);
            })
            .catch(error => {
                console.error('Error in initial search:', error);
                setSearchResults([]);
            });

    }, [searchParams]);

    // Add a debug effect to monitor searchResults
    useEffect(() => {
        console.log('Current searchResults state:', searchResults);
    }, [searchResults]);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <section className="relative w-full mx-auto flex flex-col items-center header-hero-section bg-white">
                <div className="w-full bg-gradient-to-b  from-blue-400 to-blue-600 text-white pb-10 px-0 flex flex-col items-center rounded-b-[40px] relative z-10 header-hero-bg">
                    <Navbar bgColor='transparent' />
                    <div className="flex w-full items-center py-6 px-[80px]">
                        <div className="flex w-full gap-3 items-center justify-center">
                            <div className=" w-[60%]  flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-bar">
                                <input
                                    type="text"
                                    placeholder="Motivational Speaker"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
                                />
                                {searchText && (
                                    <div className="pr-2 cursor-pointer" onClick={handleClearSearch}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                                        </svg>
                                    </div>
                                )}
                                <div className="pr-2 cursor-pointer" onClick={handleSearchClick}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="mask0_201_1588" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_201_1588)">
                                            <path d="M19.5425 20.577L13.2618 14.296C12.7618 14.7088 12.1868 15.0319 11.5368 15.2653C10.8868 15.4986 10.2144 15.6153 9.51955 15.6153C7.81038 15.6153 6.36388 15.0235 5.18005 13.84C3.99621 12.6565 3.4043 11.2103 3.4043 9.50152C3.4043 7.79285 3.99605 6.34618 5.17955 5.16152C6.36305 3.97702 7.80921 3.38477 9.51805 3.38477C11.2267 3.38477 12.6734 3.97668 13.858 5.16051C15.0425 6.34435 15.6348 7.79085 15.6348 9.50002C15.6348 10.2142 15.515 10.8963 15.2753 11.5463C15.0355 12.1963 14.7155 12.7616 14.3155 13.2423L20.5963 19.523L19.5425 20.577ZM9.51955 14.1155C10.808 14.1155 11.8994 13.6683 12.7935 12.774C13.6879 11.8798 14.135 10.7885 14.135 9.50002C14.135 8.21152 13.6879 7.12018 12.7935 6.22601C11.8994 5.33168 10.808 4.88452 9.51955 4.88452C8.23105 4.88452 7.13971 5.33168 6.24555 6.22601C5.35121 7.12018 4.90405 8.21152 4.90405 9.50002C4.90405 10.7885 5.35121 11.8798 6.24555 12.774C7.13971 13.6683 8.23105 14.1155 9.51955 14.1155Z" fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className=" w-[40%]   flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-city-bar">
                                <input
                                    type="text"
                                    placeholder="Choose City"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
                                />
                                {citySearch && (
                                    <div className="pr-2 cursor-pointer" onClick={handleClearCity}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                                        </svg>
                                    </div>
                                )}
                                <div className="pr-2 cursor-pointer" onClick={handleSearchClick}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="mask0_201_1588" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <rect width="24" height="24" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_201_1588)">
                                            <path d="M19.5425 20.577L13.2618 14.296C12.7618 14.7088 12.1868 15.0319 11.5368 15.2653C10.8868 15.4986 10.2144 15.6153 9.51955 15.6153C7.81038 15.6153 6.36388 15.0235 5.18005 13.84C3.99621 12.6565 3.4043 11.2103 3.4043 9.50152C3.4043 7.79285 3.99605 6.34618 5.17955 5.16152C6.36305 3.97702 7.80921 3.38477 9.51805 3.38477C11.2267 3.38477 12.6734 3.97668 13.858 5.16051C15.0425 6.34435 15.6348 7.79085 15.6348 9.50002C15.6348 10.2142 15.515 10.8963 15.2753 11.5463C15.0355 12.1963 14.7155 12.7616 14.3155 13.2423L20.5963 19.523L19.5425 20.577ZM9.51955 14.1155C10.808 14.1155 11.8994 13.6683 12.7935 12.774C13.6879 11.8798 14.135 10.7885 14.135 9.50002C14.135 8.21152 13.6879 7.12018 12.7935 6.22601C11.8994 5.33168 10.808 4.88452 9.51955 4.88452C8.23105 4.88452 7.13971 5.33168 6.24555 6.22601C5.35121 7.12018 4.90405 8.21152 4.90405 9.50002C4.90405 10.7885 5.35121 11.8798 6.24555 12.774C7.13971 13.6683 8.23105 14.1155 9.51955 14.1155Z" fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-grow">
                {/* Search Results Heading */}
                <div className="w-full max-w-[1352px] mx-auto px-4 py-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {searchTitle}
                    </h2>
                </div>

                <TrainerGrid
                    trainers={searchResults}
                    paginationMode="client"
                    paginationConfig={{ page: 1, pageSize: 8 }}
                />
            </main>

            {/* Similar Categories */}
            <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Categories</h2>
                <div className="flex flex-wrap gap-3">
                    {categories.map((category, index) => (
                        <button
                            onClick={() => {
                                setSearchText(category.name);
                                handleSearch(category.name, '');
                            }}
                            key={index}
                            className="py-1.5 px-4 text-[#3B82F6] bg-blue-100 text-sm font-medium rounded-md items-center flex flex-col"
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