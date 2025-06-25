import React from 'react';

const TrainerCardSkeleton = () => {
    return (
        <div className="trainer-card-cont">
            {/* Trainer image skeleton */}
            <div className="trainer-card-image animate-pulse">
                <div className="w-full h-full bg-gray-200" />
            </div>

            {/* Trainer info skeleton */}
            <div className="text-left w-full min-w-[193px] flex-grow">
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