'use client';

import { useTheme } from '@/styles/ThemeProvider';

export const ThemeToggle = () => {
    const { mode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        >
            {mode === 'light' ? '🌙' : '☀️'}
        </button>
    );
}; 