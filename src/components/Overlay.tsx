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
            className={`fixed inset-0 bg-black/40 z-50 flex justify-center items-start ${className}`}
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl flex justify-around items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Overlay; 