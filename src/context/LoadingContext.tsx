'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loader from '@/components/Loader';
import { p } from 'framer-motion/client';

interface LoadingContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
            {isLoading && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Loader isLoading={true} size="lg" />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}; 