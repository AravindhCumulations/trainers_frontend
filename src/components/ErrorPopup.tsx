import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ErrorPopupProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const ErrorPopup = ({ isOpen, message, onClose }: ErrorPopupProps) => {
    const router = useRouter();

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

    const handleOkClick = () => {
        onClose();
        router.back();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Popup card */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all">
                <div className="text-center">
                    {/* Error icon */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Error message */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>

                    {/* OK button */}
                    <button
                        onClick={handleOkClick}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup; 