'use client';

import { useTheme } from '@/styles/ThemeProvider';

export const ColorExamples = () => {
    const { theme, mode, toggleTheme } = useTheme();

    return (
        <div className="p-8 space-y-8">
            {/* Example 1: Using theme colors directly with inline styles */}
            <div
                style={{
                    backgroundColor: theme.background.default,
                    color: theme.text.primary,
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${theme.neutral[200]}`
                }}
            >
                <h2 style={{ color: theme.primary.main }}>Primary Color Text</h2>
                <p style={{ color: theme.text.secondary }}>Secondary Text Color</p>
            </div>

            {/* Example 2: Using Tailwind classes with dark mode */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                <h2 className="text-primary dark:text-primary-light">Tailwind with Dark Mode</h2>
                <p className="text-gray-600 dark:text-gray-300">This text changes with theme</p>
            </div>

            {/* Example 3: Semantic colors */}
            <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.success.light }}>
                    <p style={{ color: theme.success.contrast }}>Success Message</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.error.light }}>
                    <p style={{ color: theme.error.contrast }}>Error Message</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.warning.light }}>
                    <p style={{ color: theme.warning.contrast }}>Warning Message</p>
                </div>
            </div>

            {/* Example 4: Interactive elements */}
            <div className="space-y-4">
                <button
                    onClick={toggleTheme}
                    style={{
                        backgroundColor: theme.primary.main,
                        color: theme.primary.contrast,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.primary.dark;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = theme.primary.main;
                    }}
                >
                    Toggle Theme
                </button>

                <div
                    className="p-4 rounded-lg transition-colors duration-200"
                    style={{
                        backgroundColor: mode === 'light' ? theme.neutral[100] : theme.neutral[800],
                        border: `1px solid ${mode === 'light' ? theme.neutral[200] : theme.neutral[700]}`
                    }}
                >
                    <p style={{ color: theme.text.primary }}>Current theme: {mode}</p>
                </div>
            </div>

            {/* Example 5: Card with hover effects */}
            <div
                className="p-6 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                    backgroundColor: theme.background.paper,
                    boxShadow: `0 4px 6px ${theme.neutral[200]}`
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 12px ${theme.neutral[300]}`;
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 6px ${theme.neutral[200]}`;
                }}
            >
                <h3 style={{ color: theme.primary.main }}>Interactive Card</h3>
                <p style={{ color: theme.text.secondary }}>Hover over me to see the effect!</p>
            </div>
        </div>
    );
}; 