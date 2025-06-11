import { useEffect } from 'react';

export type PopupType = 'success' | 'error' | 'info' | 'warning' | 'confirmation';

interface PopupProps {
    isOpen: boolean;
    type: PopupType;
    message: string;
    title?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const Popup = ({
    isOpen,
    type,
    message,
    title,
    onClose,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel'
}: PopupProps) => {

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'confirmation':
                return (
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getIconBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-100';
            case 'error': return 'bg-red-100';
            case 'info': return 'bg-blue-100';
            case 'warning': return 'bg-yellow-100';
            case 'confirmation': return 'bg-blue-100';
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (type) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'info': return 'Information';
            case 'warning': return 'Warning';
            case 'confirmation': return 'Confirm';
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Popup card */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all">
                <div className="text-center">
                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${getIconBgColor()} mb-4`}>
                        {getIcon()}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{getTitle()}</h3>

                    {/* Message */}
                    <p className="text-sm text-gray-500 mb-6">{message}</p>

                    {/* Buttons */}
                    <div className="flex justify-center gap-3">
                        {type === 'confirmation' && (
                            <button
                                onClick={onClose}
                                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors duration-200 ${type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                    type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                        'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup; 