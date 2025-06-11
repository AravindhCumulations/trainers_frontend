import { useState, useCallback } from 'react';
import { PopupType } from '@/components/Popup';
import toast, { Toast } from 'react-hot-toast';

interface PopupState {
    isOpen: boolean;
    type: PopupType;
    message: string;
    title?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface UsePopupReturn {
    popupState: PopupState;
    showPopup: (type: PopupType, message: string, options?: {
        title?: string;
        onConfirm?: () => void;
        confirmText?: string;
        cancelText?: string;
    }) => void;
    hidePopup: () => void;
    showSuccess: (message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => void;
    showError: (message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => void;
    showInfo: (message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => void;
    showWarning: (message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => void;
    showConfirmation: (message: string, onConfirm: () => void, options?: Omit<PopupState, 'isOpen' | 'type' | 'message' | 'onConfirm'>) => void;
    // Toast functions
    toastSuccess: (message: string, options?: Partial<Toast>) => void;
    toastError: (message: string, options?: Partial<Toast>) => void;
    toastInfo: (message: string, options?: Partial<Toast>) => void;
    toastWarning: (message: string, options?: Partial<Toast>) => void;
}

const initialState: PopupState = {
    isOpen: false,
    type: 'info',
    message: '',
};

export const usePopup = (): UsePopupReturn => {
    const [popupState, setPopupState] = useState<PopupState>(initialState);

    const showPopup = useCallback((type: PopupType, message: string, options?: {
        title?: string;
        onConfirm?: () => void;
        confirmText?: string;
        cancelText?: string;
    }) => {
        setPopupState({
            isOpen: true,
            type,
            message,
            ...options,
        });
    }, []);

    const hidePopup = useCallback(() => {
        setPopupState(initialState);
    }, []);

    const showSuccess = useCallback((message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => {
        showPopup('success', message, options);
    }, [showPopup]);

    const showError = useCallback((message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => {
        showPopup('error', message, options);
    }, [showPopup]);

    const showInfo = useCallback((message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => {
        showPopup('info', message, options);
    }, [showPopup]);

    const showWarning = useCallback((message: string, options?: Omit<PopupState, 'isOpen' | 'type' | 'message'>) => {
        showPopup('warning', message, options);
    }, [showPopup]);

    const showConfirmation = useCallback((message: string, onConfirm: () => void, options?: Omit<PopupState, 'isOpen' | 'type' | 'message' | 'onConfirm'>) => {
        showPopup('confirmation', message, { ...options, onConfirm });
    }, [showPopup]);

    // Toast functions
    const toastSuccess = useCallback((message: string, options?: Partial<Toast>) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#10B981',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
            ...options,
        });
    }, []);

    const toastError = useCallback((message: string, options?: Partial<Toast>) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#EF4444',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
            ...options,
        });
    }, []);

    const toastInfo = useCallback((message: string, options?: Partial<Toast>) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#3B82F6',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
            icon: 'ℹ️',
            ...options,
        });
    }, []);

    const toastWarning = useCallback((message: string, options?: Partial<Toast>) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#F59E0B',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
            icon: '⚠️',
            ...options,
        });
    }, []);

    return {
        popupState,
        showPopup,
        hidePopup,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showConfirmation,
        toastSuccess,
        toastError,
        toastInfo,
        toastWarning,
    };
}; 