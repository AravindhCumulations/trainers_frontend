"use client";

import React, { useEffect } from 'react';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children, className = '' }) => {
    useEffect(() => {
        if (isOpen) {
            // Save the current scroll position
            const scrollY = window.scrollY;
            // Add styles to prevent scrolling
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position and remove fixed positioning
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        // Cleanup function
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/40 z-50 flex justify-center items-start p-2 sm:p-4 lg:p-8 ${className}`}
            onClick={onClose}
        >
            <div
                className="w-full max-w-full flex justify-center items-start"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full max-w-full max-h-[95vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/70">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Overlay; 