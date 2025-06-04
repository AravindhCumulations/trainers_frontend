'use client';

import { useLoading } from '@/context/LoadingContext';
import { useRouter, usePathname } from 'next/navigation';

export const useNavigation = () => {
    const { showLoader, hideLoader } = useLoading();
    const router = useRouter();
    const currentPath = usePathname(); // <- get current path

    const handleNavigation = async (page: string, params?: Record<string, string>) => {
        showLoader(); // Show loader immediately
        try {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            const fullPath = `${page}${query}`;

            if (currentPath === page) {
                // Already on the same page — force refresh
                window.location.href = fullPath;// Soft refresh (or use window.location.href = fullPath for hard)
            } else {
                await router.push(fullPath); // Navigate to different page
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
            console.error("Navigation error:", err);
        } finally {
            setTimeout(() => {
                hideLoader();
            }, 300);
        }
    };

    return { handleNavigation };
};
