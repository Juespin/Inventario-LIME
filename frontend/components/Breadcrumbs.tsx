import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    if (items.length === 0) return null;

    return (
        <nav 
            aria-label="Breadcrumb"
            className="mb-4 sm:mb-6"
        >
            <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li
                            key={index}
                            className="flex items-center"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />
                            )}
                            {isFirst && (
                                <Home className="w-4 h-4 text-gray-500 mr-1" aria-hidden="true" />
                            )}
                            {isLast ? (
                                <span
                                    className="text-gray-600 font-medium"
                                    aria-current="page"
                                    itemProp="name"
                                >
                                    {item.label}
                                </span>
                            ) : item.onClick ? (
                                <button
                                    onClick={item.onClick}
                                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                    itemProp="name"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <span className="text-gray-500" itemProp="name">
                                    {item.label}
                                </span>
                            )}
                            <meta itemProp="position" content={String(index + 1)} />
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

