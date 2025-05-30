'use client';

import { useLoading } from '@/context/LoadingContext';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
    const { showLoader, hideLoader } = useLoading();
    const router = useRouter();

    const handleNavigation = async (page: string, params?: Record<string, string>) => {
        showLoader(); // Show loader immediately
        try {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            await router.push(`${page}${query}`);
            // Add a small delay to ensure the loader is visible
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
            console.error("Navigation error:", err);
        } finally {
            // Add a small delay before hiding the loader
            setTimeout(() => {
                hideLoader();
            }, 300);
        }
    };

    return { handleNavigation };
}; 