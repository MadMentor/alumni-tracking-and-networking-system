import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow time for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };

    const iconClasses = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
        >
            <div className={`${typeClasses[type]} rounded-lg shadow-lg p-4 max-w-sm`}>
                <div className="flex items-center">
                    <span className="mr-2 text-lg">{iconClasses[type]}</span>
                    <span className="flex-1">{message}</span>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast; 