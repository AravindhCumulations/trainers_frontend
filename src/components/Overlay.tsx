"use client";

import React from 'react';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/40 z-50 flex justify-center items-start py-8 ${className}`}
            onClick={onClose}
        >
            <div
                className="w-auto min-w-0 max-w-[95vw] flex justify-around items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-auto min-w-0 max-h-[95vh] overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/70">
                    <div className="w-fit">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overlay; 