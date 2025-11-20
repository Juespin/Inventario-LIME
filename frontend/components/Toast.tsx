import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastProps {
    toast: ToastData;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const duration = toast.duration || 5000;
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    const iconClasses = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600',
        warning: 'text-amber-600'
    };

    const bgClasses = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-amber-50 border-amber-200'
    };

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle
    };

    const Icon = icons[toast.type];

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${bgClasses[toast.type]} animate-slide-in`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconClasses[toast.type]}`} aria-hidden="true" />
            <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                aria-label="Cerrar notificación"
            >
                <X className="w-4 h-4" aria-hidden="true" />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastData[];
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    if (toasts.length === 0) return null;

    return (
        <div 
            className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full sm:w-auto"
            role="region"
            aria-label="Notificaciones"
            aria-live="polite"
        >
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
};

// Hook para usar toasts
let toastIdCounter = 0;

export const useToast = () => {
    const [toasts, setToasts] = React.useState<ToastData[]>([]);

    const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
        const id = `toast-${++toastIdCounter}`;
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return { toasts, showToast, removeToast };
};

