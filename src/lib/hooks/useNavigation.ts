'use client';

import { useLoading } from '@/context/LoadingContext';
import { useRouter, usePathname } from 'next/navigation';

export const useNavigation = () => {
    const loading = useLoading();
    const router = useRouter();
    const currentPath = usePathname();

    const handleNavigation = async (page: string, params?: Record<string, string>) => {
        loading.showLoader();
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        const fullPath = `${page}${query}`;

        try {
            // Only use window.location.href for auth-related pages to ensure middleware runs
            if (page === '/login' || page === '/signup') {
                window.location.href = fullPath;
                return;
            }

            // For all other pages, use client-side navigation
            if (currentPath === page) {
                // If on same page, do nothing or optionally refresh data (no hard reload)
                // Optionally, you could add logic to refresh data here if needed
                // For now, do nothing
                loading.hideLoader();
                return;
            } else {
                await router.push(fullPath);
            }
        } catch (err) {
            console.error("Navigation error:", err);
            // Fallback to hard navigation if client-side navigation fails
            window.location.href = fullPath;
        } finally {
            // Hide loader after a short delay to ensure smooth transition
            setTimeout(() => {
                loading.hideLoader();
            }, 100);
        }
    };

    return { handleNavigation };
};
