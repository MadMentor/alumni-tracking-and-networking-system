import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: () => void;
}

const toastConfig = {
    success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-500'
    },
    error: {
        icon: <XCircle className="w-5 h-5" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-500'
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5" />,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-500'
    },
    info: {
        icon: <Info className="w-5 h-5" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-500'
    }
};

export default function Toast({ 
    type, 
    title, 
    message, 
    duration = 5000, 
    onClose 
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const config = toastConfig[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4`}>
                <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${config.iconColor}`}>
                        {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium ${config.textColor}`}>
                            {title}
                        </h4>
                        {message && (
                            <p className={`text-sm ${config.textColor} opacity-90 mt-1`}>
                                {message}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Toast Container for managing multiple toasts
export function ToastContainer() {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        type: ToastType;
        title: string;
        message?: string;
        duration?: number;
    }>>([]);

    const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Expose addToast method globally
    useEffect(() => {
        (window as any).showToast = addToast;
        return () => {
            delete (window as any).showToast;
        };
    }, []);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
} 