
export type ThemeMode = 'light' | 'dark';

export const lightTheme = {

    // Primary colors
    primary: {
        main: '#2563EB', // Blue
        light: '#60A5FA',
        dark: '#1D4ED8',
        contrast: '#FFFFFF',
    },

    // Secondary colors
    secondary: {
        main: '#7C3AED', // Purple
        light: '#A78BFA',
        dark: '#5B21B6',
        contrast: '#FFFFFF',
    },

    // Neutral colors
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Semantic colors
    success: {
        main: '#10B981', // Green
        light: '#34D399',
        dark: '#059669',
        contrast: '#FFFFFF',
    },

    error: {
        main: '#EF4444', // Red
        light: '#F87171',
        dark: '#DC2626',
        contrast: '#FFFFFF',
    },

    warning: {
        main: '#F59E0B', // Amber
        light: '#FBBF24',
        dark: '#D97706',
        contrast: '#FFFFFF',
    },

    info: {
        main: '#3B82F6', // Light Blue
        light: '#60A5FA',
        dark: '#2563EB',
        contrast: '#FFFFFF',
    },

    // Background colors
    background: {
        default: '#FFFFFF',
        paper: '#F9FAFB',
        dark: '#111827',
    },

    // Text colors
    text: {
        primary: '#111827',
        secondary: '#4B5563',
        disabled: '#9CA3AF',
        hint: '#6B7280',
    },

    //Button colors
    button: {
        primary: '#3B82F6',

    },


    // Inside both lightTheme and darkTheme
    gradients: {
        primary: 'linear-gradient(112.87deg, #DBEAFE 0%, #EFF6FF 100%)',
        header: 'linear-gradient(90deg, #7196FF 0%, #2563EB 100%)',

    },

} as const;

export const darkTheme = {
    // Primary colors
    primary: {
        main: '#60A5FA', // Lighter Blue
        light: '#93C5FD',
        dark: '#2563EB',
        contrast: '#111827',
    },

    // Secondary colors
    secondary: {
        main: '#A78BFA', // Lighter Purple
        light: '#C4B5FD',
        dark: '#7C3AED',
        contrast: '#111827',
    },

    // Neutral colors
    neutral: {
        50: '#111827',
        100: '#1F2937',
        200: '#374151',
        300: '#4B5563',
        400: '#6B7280',
        500: '#9CA3AF',
        600: '#D1D5DB',
        700: '#E5E7EB',
        800: '#F3F4F6',
        900: '#F9FAFB',
    },

    // Semantic colors
    success: {
        main: '#34D399', // Lighter Green
        light: '#6EE7B7',
        dark: '#10B981',
        contrast: '#111827',
    },

    error: {
        main: '#F87171', // Lighter Red
        light: '#FCA5A5',
        dark: '#EF4444',
        contrast: '#111827',
    },

    warning: {
        main: '#FBBF24', // Lighter Amber
        light: '#FCD34D',
        dark: '#F59E0B',
        contrast: '#111827',
    },

    info: {
        main: '#60A5FA', // Lighter Blue
        light: '#93C5FD',
        dark: '#3B82F6',
        contrast: '#111827',
    },

    // Background colors
    background: {
        default: '#111827',
        paper: '#1F2937',
        dark: '#000000',
    },

    // Text colors
    text: {
        primary: '#F9FAFB',
        secondary: '#E5E7EB',
        disabled: '#9CA3AF',
        hint: '#D1D5DB',
    },

    //Button colors
    button: {
        primary: '#3B82F6',

    },

    //Background gradients
    gradients: {
        primary: '#000000',
        header: 'linear-gradient(90deg, #7196FF 0%, #2563EB 100%)',

    },
} as const;

// Theme type that can be either light or dark theme
export type Theme = typeof lightTheme | typeof darkTheme;

// Theme context type
export interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    toggleTheme: () => void;
}

// Type for the color palette
export type ColorPalette = Theme;

// Type for individual color categories
export type PrimaryColors = Theme['primary'];
export type SecondaryColors = Theme['secondary'];
export type NeutralColors = Theme['neutral'];
export type SemanticColors = Theme['success'] | Theme['error'] | Theme['warning'] | Theme['info'];
export type BackgroundColors = Theme['background'];
export type TextColors = Theme['text']; 