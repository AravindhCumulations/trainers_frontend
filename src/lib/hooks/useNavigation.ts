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
            // Always use window.location.href for auth-related pages to ensure middleware runs
            if (page === '/' || page === '/trainer-details' || page === '/manage-credits') {
                window.location.href = fullPath;
                return;
            }

            // For other pages, use client-side navigation
            if (currentPath === page) {
                // If on same page, do a hard refresh to ensure fresh state
                window.location.href = fullPath;
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
