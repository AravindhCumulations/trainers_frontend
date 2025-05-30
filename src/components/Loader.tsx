'use client';

import React from 'react';

interface LoaderProps {
    isLoading: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    isLoading,
    size = 'md',
    className = ''
}) => {
    if (!isLoading) return null;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
                role="status"
                aria-label="loading"
            />
        </div>
    );
};

export default Loader; 