import React from 'react';

const TrainerDetailsSkeleton = () => {
    return (
        <div className="flex max-w-7xl mx-auto gap-4">
            {/* Left Column - Profile Card */}
            <div className="w-[30%] flex flex-col gap-6">
                <div className="row-span-2 col-span-1">
                    <div className="profile-card shadow-lg flex flex-col gap-3 justify-center items-center rounded-xl bg-white p-10 h-full">
                        {/* Profile Image Skeleton */}
                        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />

                        {/* Name Skeleton */}
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />

                        {/* Rating Skeleton */}
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />

                        {/* Expertise Tags Skeleton */}
                        <div className="flex flex-row gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                            ))}
                        </div>

                        {/* Contact Info Skeleton */}
                        <div className="w-full space-y-3">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Analytics Card Skeleton */}
                <div className="bg-white rounded-xl p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-[70%] mx-auto">
                {/* Workshops Section Skeleton */}
                <div className="mb-6 rounded-xl bg-white p-6">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                    <div className="flex gap-4 overflow-x-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[280px] h-[320px] bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* About Me Section Skeleton */}
                <div className="mb-6 rounded-xl bg-white p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>

                {/* Masonry Grid Skeleton */}
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="break-inside-avoid bg-white rounded-xl p-6">
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainerDetailsSkeleton; 