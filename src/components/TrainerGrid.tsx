"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import TrainerCard from './TrainerCard';
import PaginationControls from './PaginationControls';
import { TrainerCardModel } from '../models/trainerCard.model';
import { useNavigation } from "@/lib/hooks/useNavigation";
import TrainerCardSkeleton from './TrainerCardSkeleton';

export interface PaginationConfig {
    page: number;
    pageSize: number;
    totalItems?: number;
}

export interface TrainerGridProps {
    trainers: TrainerCardModel[];
    paginationMode?: 'client' | 'server';
    paginationConfig: PaginationConfig;
    onPageChange?: (newConfig: PaginationConfig) => void;
    pageLocked?: boolean;
    onWishlistUpdate?: (trainer: TrainerCardModel, isWishlisted: boolean) => void;
    callLogin?: () => void;
    isLoading?: boolean;
}

export default function TrainerGrid({
    trainers,
    paginationMode = 'client',
    paginationConfig,
    onPageChange,
    pageLocked = false,
    onWishlistUpdate,
    callLogin,
    isLoading = false
}: TrainerGridProps) {
    const router = useRouter();
    const { page, pageSize } = paginationConfig;
    const [localPage, setLocalPage] = useState(page);
    const { handleNavigation } = useNavigation();

    const totalPages = useMemo(() =>
        Math.ceil((paginationConfig.totalItems || trainers.length) / pageSize),
        [paginationConfig.totalItems, trainers.length, pageSize]
    );

    const handlePageChange = useCallback((newPage: number) => {
        if (paginationMode === 'server') {
            onPageChange?.({ ...paginationConfig, page: newPage });
        } else {
            setLocalPage(newPage);
        }
        // Scroll to top of the grid when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [paginationMode, onPageChange, paginationConfig]);

    const paginatedTrainers = useMemo(() => {
        if (paginationMode === 'server') return trainers;
        if (pageLocked) return trainers.slice(0, pageSize);

        const start = (localPage - 1) * pageSize;
        return trainers.slice(start, start + pageSize);
    }, [trainers, paginationMode, localPage, pageSize, pageLocked]);

    const handleTrainerClick = useCallback((trainer: TrainerCardModel) => {
        handleNavigation('/trainer-details', { 'trainer': trainer.name })
    }, [handleNavigation]);

    return (
        <section className="w-full max-w-[1352px] mx-auto flex flex-col trainer-list-section px-4 sm:px-6 lg:px-8">
            <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 trainer-list-grid">
                {isLoading ? (
                    // Show skeleton loaders based on pageSize
                    Array.from({ length: pageSize }).map((_, index) => (
                        <TrainerCardSkeleton key={index} />
                    ))
                ) : paginatedTrainers.length > 0 ? (
                    paginatedTrainers.map((trainer) => (
                        <TrainerCard
                            key={trainer.name}
                            trainer={trainer}
                            onClick={handleTrainerClick}
                            onWishlistUpdate={onWishlistUpdate}
                            callLogin={callLogin}
                        />
                    ))
                ) : (
                    <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4 text-center text-gray-500 text-sm sm:text-base lg:text-lg font-semibold py-8 sm:py-12 lg:py-14 h-full">
                        Nothing to display
                    </div>
                )}
            </div>

            {pageLocked && trainers.length != 0 ? (
                <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                    <button
                        onClick={() => router.push("/trainers-page")}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                    >
                        View All
                    </button>
                </div>
            ) : (
                <PaginationControls
                    currentPage={paginationMode === 'server' ? page : localPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
}
