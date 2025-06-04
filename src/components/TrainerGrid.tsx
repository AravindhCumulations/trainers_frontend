"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';
import TrainerCard from './TrainerCard';
import PaginationControls from './PaginationControls';
import { TrainerCardModel } from '../models/trainerCard.model';
import { useLoading } from '@/context/LoadingContext';
import { getCurrentUserName, getCurrentUserRole } from "@/lib/utils/auth.utils";
import { useNavigation } from "@/lib/hooks/useNavigation";


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
}


export default function TrainerGrid({
    trainers,
    paginationMode = 'client',
    paginationConfig,
    onPageChange,
    pageLocked = false
}: TrainerGridProps) {
    const router = useRouter();
    const { page, pageSize } = paginationConfig;
    const [localPage, setLocalPage] = useState(page);
    const [isTrainer, setIsTrainer] = useState(false);
    const { showLoader, hideLoader } = useLoading();
    const { handleNavigation } = useNavigation();


    useEffect(() => {
        setIsTrainer(getCurrentUserRole() === 'Trainer');
    }, []);

    // Add debug logging




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

    }, [router]);



    return (
        <section className="w-full max-w-[1352px] mx-auto flex flex-col px-4 py-10 trainer-list-section">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 trainer-list-grid">
                {paginatedTrainers.length > 0 ? (
                    paginatedTrainers.map((trainer) => (
                        <TrainerCard
                            key={trainer.name}
                            trainer={trainer}
                            onClick={handleTrainerClick}
                        />
                    ))
                ) : (
                    <div className="col-span-full row-span-full text-center text-gray-500 text-lg font-semibold py-14 h-full">
                        Nothing to display
                    </div>
                )}
            </div>

            {pageLocked && trainers.length != 0 ? (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => router.push("/trainers-page")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
