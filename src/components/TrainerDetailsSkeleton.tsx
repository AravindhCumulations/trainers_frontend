import React from 'react';

const TrainerDetailsSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-4 px-2 sm:px-4 w-full">
            {/* Left Column - Profile Card */}
            <div className="w-full lg:w-[30%] flex flex-col gap-6 mb-4 lg:mb-0">
                <div className="row-span-2 col-span-1">
                    <div className="profile-card shadow-lg flex flex-col gap-3 justify-center items-center rounded-xl bg-white p-6 sm:p-10 h-full">
                        {/* Profile Image Skeleton */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 animate-pulse" />

                        {/* Name Skeleton */}
                        <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 rounded animate-pulse" />

                        {/* Rating Skeleton */}
                        <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />

                        {/* Expertise Tags Skeleton */}
                        <div className="flex flex-row gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 sm:h-8 w-16 sm:w-24 bg-gray-200 rounded-full animate-pulse" />
                            ))}
                        </div>

                        {/* Contact Info Skeleton */}
                        <div className="w-full space-y-3">
                            <div className="h-3 sm:h-4 w-2/3 sm:w-3/4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 sm:h-4 w-1/2 sm:w-2/3 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 sm:h-4 w-1/3 sm:w-1/2 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Analytics Card Skeleton */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                    <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 sm:h-32 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-20 sm:h-32 bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[70%] mx-auto">
                {/* Workshops Section Skeleton */}
                <div className="mb-4 sm:mb-6 rounded-xl bg-white p-4 sm:p-6">
                    <div className="h-5 sm:h-6 w-32 sm:w-48 bg-gray-200 rounded animate-pulse mb-4 sm:mb-6" />
                    <div className="flex gap-2 sm:gap-4 overflow-x-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[180px] sm:min-w-[280px] h-[180px] sm:h-[320px] bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* About Me Section Skeleton */}
                <div className="mb-4 sm:mb-6 rounded-xl bg-white p-4 sm:p-6">
                    <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-200 rounded animate-pulse mb-2 sm:mb-4" />
                    <div className="space-y-2">
                        <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 sm:h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>

                {/* Masonry Grid Skeleton */}
                <div className="columns-1 md:columns-2 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="break-inside-avoid bg-white rounded-xl p-4 sm:p-6">
                            <div className="h-5 sm:h-6 w-28 sm:w-40 bg-gray-200 rounded animate-pulse mb-2 sm:mb-4" />
                            <div className="space-y-2">
                                <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 sm:h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainerDetailsSkeleton; 