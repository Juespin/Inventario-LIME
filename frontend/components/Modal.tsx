
import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    // Crear contenedor para el portal si no existe
    const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        // Crear o usar un contenedor para modales
        let container = document.getElementById('modal-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'modal-root';
            container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 10000;';
            document.body.appendChild(container);
        }
        setPortalContainer(container);

        return () => {
            // No eliminar el contenedor, puede ser usado por otros modales
        };
    }, []);

    // Manejar tecla Escape para cerrar
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        // Prevenir scroll del body cuando el modal está abierto
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalWidth = document.body.style.width;
        const originalHeight = document.body.style.height;
        
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('modal-open');
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = originalWidth;
            document.body.style.height = originalHeight;
        };
    }, [onClose]);

    // Focus en el modal al abrir
    const modalRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        modalRef.current?.focus();
    }, []);

    if (!portalContainer) return null;

    // Usar portal para renderizar el modal en el body
    const modalContent = (
        <div 
            className="modal-overlay"
            aria-modal="true" 
            role="dialog" 
            aria-labelledby="modal-title"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw',
                maxHeight: '100vh',
                minWidth: '100vw',
                minHeight: '100vh',
                zIndex: 10000,
                margin: 0,
                padding: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                boxSizing: 'border-box',
                pointerEvents: 'auto'
            }}
        >
            <div 
                ref={modalRef}
                tabIndex={-1}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col m-3 sm:m-4 focus:outline-none animate-scale-in"
                role="document"
                onClick={(e) => e.stopPropagation()}
                style={{ 
                    position: 'relative', 
                    zIndex: 10001
                }}
            >
                <div className="flex justify-between items-center p-3 sm:p-4 border-b flex-shrink-0">
                    <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-slate-800 pr-2">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" 
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );

    // Renderizar en un portal al contenedor de modales
    return createPortal(modalContent, portalContainer);
};
