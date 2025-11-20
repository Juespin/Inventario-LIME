import React from 'react';
import { Search, Package, FolderX, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
    type?: 'search' | 'empty' | 'error' | 'no-data';
    title?: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    type = 'empty',
    title,
    message,
    action 
}) => {
    const configs = {
        search: {
            icon: Search,
            defaultTitle: 'No se encontraron resultados',
            defaultMessage: 'Intenta cambiar los términos de búsqueda o ajustar los filtros.',
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        empty: {
            icon: Package,
            defaultTitle: 'No hay equipos registrados',
            defaultMessage: 'Comienza agregando tu primer equipo médico al inventario.',
            iconColor: 'text-gray-400',
            bgColor: 'bg-gray-50'
        },
        error: {
            icon: AlertCircle,
            defaultTitle: 'Algo salió mal',
            defaultMessage: 'No se pudieron cargar los datos. Por favor, intenta de nuevo.',
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50'
        },
        'no-data': {
            icon: FolderX,
            defaultTitle: 'No hay información disponible',
            defaultMessage: 'Esta sección no tiene contenido aún.',
            iconColor: 'text-gray-400',
            bgColor: 'bg-gray-50'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div 
            className={`flex flex-col items-center justify-center p-8 sm:p-12 rounded-lg ${config.bgColor} border-2 border-dashed border-gray-300`}
            role="status"
            aria-live="polite"
        >
            <Icon className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 ${config.iconColor}`} aria-hidden="true" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
                {title || config.defaultTitle}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center max-w-md">
                {message || config.defaultMessage}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={action.label}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

