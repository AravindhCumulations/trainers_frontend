import React from 'react';

const TrainerCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col items-center min-h-[320px] max-w-[300px] mx-auto trainer-card">
            {/* Trainer image skeleton */}
            <div className="rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-100 relative h-[192px] w-[260px] animate-pulse">
                <div className="w-full h-full bg-gray-200" />
            </div>

            {/* Trainer info skeleton */}
            <div className="text-left w-full">
                <div className="h-[18px] w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3" />

                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            {/* Bottom info skeleton */}
            <div className="flex items-center w-full justify-between mt-4">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default TrainerCardSkeleton; 