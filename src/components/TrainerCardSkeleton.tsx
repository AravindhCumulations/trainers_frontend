import React from 'react';

const TrainerCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col items-center w-full h-auto min-h-[320px] sm:min-h-[360px] lg:min-h-[385px] trainer-card">
            {/* Trainer image skeleton */}
            <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 flex items-center justify-center bg-gray-100 relative h-32 sm:h-40 lg:h-48 w-full animate-pulse">
                <div className="w-full h-full bg-gray-200" />
            </div>

            {/* Trainer info skeleton */}
            <div className="text-left w-full flex-grow">
                <div className="h-4 sm:h-5 lg:h-[18px] w-3/4 bg-gray-200 rounded animate-pulse mb-1 sm:mb-2" />
                <div className="h-3 sm:h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2 sm:mb-3" />

                <div className="space-y-1 sm:space-y-2">
                    <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 sm:h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 sm:h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            {/* Bottom info skeleton */}
            <div className="flex items-center w-full justify-between mt-auto h-6 sm:h-7 lg:h-[30px]">
                <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default TrainerCardSkeleton; 