import { useState, useCallback } from 'react';

interface UseErrorPopupReturn {
    isOpen: boolean;
    message: string;
    showError: (message: string) => void;
    hideError: () => void;
}

export const useErrorPopup = (): UseErrorPopupReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showError = useCallback((errorMessage: string) => {
        setMessage(errorMessage);
        setIsOpen(true);
    }, []);

    const hideError = useCallback(() => {
        setIsOpen(false);
        setMessage('');
    }, []);

    return {
        isOpen,
        message,
        showError,
        hideError,
    };
}; 