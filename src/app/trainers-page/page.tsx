import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TrainerGrid from '../../components/TrainerGrid';

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
        name: "rahul_verma",
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
        name: "anjali_mehta",
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
        name: "kiran_rao",
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
];


export default function TrainersPage() {
    const allExpertise = dummyTrainers.flatMap(trainer => trainer.expertise_in.map(e => e.expetrise));
    const uniqueExpertise = Array.from(new Set(allExpertise));

    return (
        <>
            <section className="relative w-full mx-auto flex flex-col items-center header-hero-section">
                <div className="w-full bg-gradient-to-b  from-blue-400 to-blue-600 text-white pb-10 px-0 flex flex-col items-center rounded-b-[40px] relative z-10 header-hero-bg">
                    <Navbar bgColor='transparent' />
                    <div className="flex w-full items-center py-6 px-[80px]">
                        <div className="flex w-full gap-3 items-center justify-center">
                            <div className=" w-[60%]  flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-bar">
                                <input
                                    type="text"
                                    placeholder="Motivational Speaker"
                                    className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
                                />
                                <div className="pr-2">
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
                            {/* Search and Filter Section */}
                            <div className=" w-[40%]   flex flex-row items-center gap-2 bg-white/30 rounded-full p-1.5 shadow-md backdrop-blur-md mb-5 hero-search-city-bar">
                                <input
                                    type="text"
                                    placeholder="Choose city"
                                    className="flex-1 px-5 py-2 rounded-full outline-none text-white bg-transparent placeholder-white/80 text-[16px] font-normal hero-search-input"
                                />
                                <div className="pr-2">
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



            {/* Search Results Heading */}
            <div className="w-full max-w-[1352px] mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Search Results for Motivational Speakers</h2>
            </div>

            <TrainerGrid trainers={dummyTrainers} />
            <TrainerGrid trainers={dummyTrainers} />
            <TrainerGrid trainers={dummyTrainers} />
            <TrainerGrid trainers={dummyTrainers} />



            {/* Similar Categories */}
            <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Categories</h2>
                <div className="flex flex-wrap gap-3">
                    <button className="py-1 px-3 bg-blue-100 text-blue-800 text-sm font-medium rounded-md items-center flex flex-col">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3B82F6"><path d="M746.15-612.31q-50.47 0-87.65-32.46-37.19-32.46-44.27-81.38H344.77q-6.39 43.53-36.89 74.42-30.5 30.88-74.03 37.27v268.69q48.92 7.08 81.38 44.27 32.46 37.18 32.46 87.65 0 56-38.92 94.93Q269.85-80 213.85-80t-94.93-38.92Q80-157.85 80-213.85q0-50.47 32.46-87.65 32.46-37.19 81.39-44.27v-268.69q-48.93-7.08-81.39-44.08T80-746.15q0-56 39.09-94.93Q158.18-880 213.08-880q50.61 0 87.61 32.46t44.08 81.39h269.46q7.08-48.93 44.27-81.39Q695.68-880 746.15-880q55.22 0 94.53 39.32Q880-801.37 880-746.15q0 56-39.32 94.92-39.31 38.92-94.53 38.92ZM213.36-119.23q39.64 0 66.99-27.85 27.34-27.84 27.34-66.28 0-39.64-27.34-66.99-27.35-27.34-66.99-27.34-38.44 0-66.28 27.34-27.85 27.35-27.85 66.99 0 38.44 27.85 66.28 27.84 27.85 66.28 27.85Zm0-532.31q39.64 0 66.99-27.82 27.34-27.82 27.34-66.88 0-39.07-27.34-66.41Q253-840 213.36-840q-38.44 0-66.28 27.35-27.85 27.34-27.85 66.41 0 39.06 27.85 66.88 27.84 27.82 66.28 27.82ZM746.15-80q-56 0-94.92-38.92-38.92-38.93-38.92-94.37 0-55.44 38.92-94.92 38.92-39.48 94.92-39.48t94.93 39.48Q880-268.73 880-213.29q0 55.44-38.92 94.37Q802.15-80 746.15-80Zm.09-39.23q39.07 0 66.41-27.85Q840-174.92 840-213.36q0-39.64-27.35-66.99-27.34-27.34-66.41-27.34-39.06 0-66.88 27.34-27.82 27.35-27.82 66.99 0 38.44 27.82 66.28 27.82 27.85 66.88 27.85Zm0-532.31q39.07 0 66.41-27.82Q840-707.18 840-746.24q0-39.07-27.35-66.41Q785.31-840 746.24-840q-39.06 0-66.88 27.35-27.82 27.34-27.82 66.41 0 39.06 27.82 66.88 27.82 27.82 66.88 27.82ZM213.85-213.85Zm0-532.3Zm532.3 532.3Zm0-532.3Z" /></svg>
                        marketing
                    </button>
                </div>
            </div>



            <Footer />
        </>
    );
} 