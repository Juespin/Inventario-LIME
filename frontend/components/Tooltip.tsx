import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
    text, 
    children, 
    position = 'top' 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && tooltipRef.current && wrapperRef.current) {
            const tooltip = tooltipRef.current;
            const wrapper = wrapperRef.current;
            
            // Ajustar posición para que no salga de la pantalla
            const rect = wrapper.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            if (position === 'top' && rect.top < tooltipRect.height) {
                tooltip.style.transform = 'translateY(100%)';
            }
        }
    }, [isVisible, position]);

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-r-transparent border-b-transparent border-l-transparent',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-r-transparent border-t-transparent border-l-transparent',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-r-transparent border-t-transparent border-b-transparent',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-l-transparent border-t-transparent border-b-transparent'
    };

    return (
        <div 
            ref={wrapperRef}
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
                >
                    {text}
                    <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} aria-hidden="true"></div>
                </div>
            )}
        </div>
    );
};

