import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Save, Trash2 } from 'lucide-react';
import { EquipmentFilters, Site, Service, Responsible, FilterPreset } from '../types';
import { Tooltip } from './Tooltip';

interface AdvancedFiltersProps {
    filters: EquipmentFilters;
    onFiltersChange: (filters: EquipmentFilters) => void;
    onClearFilters: () => void;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
    brands: string[];
    resultCount: number;
    totalCount: number;
}

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
        {label}
        <button
            onClick={onRemove}
            className="ml-1 hover:bg-blue-200 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label={`Eliminar filtro ${label}`}
        >
            <X className="w-3 h-3" aria-hidden="true" />
        </button>
    </span>
);

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
    sites,
    services,
    responsibles,
    brands,
    resultCount,
    totalCount
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [brandSearch, setBrandSearch] = useState(filters.brand || '');
    const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
    
    // Filtrar marcas basado en la búsqueda
    const filteredBrands = brands.filter(brand => 
        brand.toLowerCase().includes(brandSearch.toLowerCase())
    );

    useEffect(() => {
        if (filters.siteId) {
            const servicesForSite = services.filter(s => s.siteId === filters.siteId);
            setFilteredServices(servicesForSite);
            // Si cambia la sede y el servicio actual no pertenece a la nueva sede, limpiar servicio
            if (filters.serviceId) {
                const currentService = servicesForSite.find(s => s.id === filters.serviceId);
                if (!currentService) {
                    // El servicio actual no pertenece a la nueva sede, limpiarlo
                    onFiltersChange({
                        ...filters,
                        serviceId: undefined
                    });
                }
            }
        } else {
            setFilteredServices(services);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.siteId, filters.serviceId, services]);

    // Sincronizar brandSearch con filters.brand cuando cambia externamente
    useEffect(() => {
        if (!filters.brand && brandSearch) {
            setBrandSearch('');
        } else if (filters.brand && brandSearch !== filters.brand) {
            setBrandSearch(filters.brand);
        }
    }, [filters.brand]);

    const handleFilterChange = (key: keyof EquipmentFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value === '' || value === 0 || (Array.isArray(value) && value.length === 0) ? undefined : value
        });
    };

    const handleStatusToggle = (status: 'Activo' | 'Inactivo' | 'Mantenimiento') => {
        const currentStatuses = filters.status || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter(s => s !== status)
            : [...currentStatuses, status];
        handleFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined);
    };

    const activeFiltersCount = () => {
        let count = 0;
        if (filters.status && filters.status.length > 0) count += filters.status.length;
        if (filters.siteId) count++;
        if (filters.serviceId) count++;
        if (filters.responsibleId) count++;
        if (filters.brand) count++;
        return count;
    };

    const getActiveFilterLabels = (): string[] => {
        const labels: string[] = [];
        if (filters.status && filters.status.length > 0) {
            filters.status.forEach(status => labels.push(`Estado: ${status}`));
        }
        if (filters.siteId) {
            const site = sites.find(s => s.id === filters.siteId);
            if (site) labels.push(`Sede: ${site.name}`);
        }
        if (filters.serviceId) {
            const service = services.find(s => s.id === filters.serviceId);
            if (service) labels.push(`Servicio: ${service.name}`);
        }
        if (filters.responsibleId) {
            const responsible = responsibles.find(r => r.id === filters.responsibleId);
            if (responsible) labels.push(`Responsable: ${responsible.name}`);
        }
        if (filters.brand) {
            labels.push(`Marca: ${filters.brand}`);
        }
        return labels;
    };

    const hasActiveFilters = activeFiltersCount() > 0;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-4 sm:mb-6">
            {/* Header del panel de filtros */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-lg"
                aria-expanded={isExpanded}
                aria-controls="filters-content"
            >
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-800">Filtros Avanzados</h3>
                        <p className="text-xs text-gray-500">
                            {hasActiveFilters 
                                ? `${activeFiltersCount()} filtro${activeFiltersCount() > 1 ? 's' : ''} activo${activeFiltersCount() > 1 ? 's' : ''}`
                                : 'Sin filtros activos'}
                        </p>
                    </div>
                    {hasActiveFilters && (
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {activeFiltersCount()}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearFilters();
                            }}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Limpiar todos los filtros"
                        >
                            Limpiar
                        </button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    )}
                </div>
            </button>

            {/* Chips de filtros activos - siempre visibles */}
            {hasActiveFilters && (
                <div className="px-4 pb-3 border-b border-gray-200 flex flex-wrap gap-2">
                    {getActiveFilterLabels().map((label, index) => (
                        <FilterChip
                            key={index}
                            label={label}
                            onRemove={() => {
                                // Determinar qué filtro eliminar basado en el label
                                if (label.startsWith('Estado:')) {
                                    const status = label.replace('Estado: ', '') as 'Activo' | 'Inactivo' | 'Mantenimiento';
                                    handleStatusToggle(status);
                                } else if (label.startsWith('Sede:')) {
                                    handleFilterChange('siteId', undefined);
                                } else if (label.startsWith('Servicio:')) {
                                    handleFilterChange('serviceId', undefined);
                                } else if (label.startsWith('Responsable:')) {
                                    handleFilterChange('responsibleId', undefined);
                                } else if (label.startsWith('Marca:')) {
                                    handleFilterChange('brand', undefined);
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Contador de resultados */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold text-blue-600">{resultCount}</span> de{' '}
                    <span className="font-semibold">{totalCount}</span> equipos
                </p>
            </div>

            {/* Contenido expandible de filtros */}
            {isExpanded && (
                <div id="filters-content" className="p-4 space-y-4">
                    {/* Filtro de Estado - Multi-select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <div className="flex flex-wrap gap-2">
                            {['Activo', 'Inactivo', 'Mantenimiento'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusToggle(status as 'Activo' | 'Inactivo' | 'Mantenimiento')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        filters.status?.includes(status as any)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtro de Sede */}
                    <div>
                        <label htmlFor="filter-site" className="block text-sm font-medium text-gray-700 mb-2">
                            Sede
                        </label>
                        <select
                            id="filter-site"
                            value={filters.siteId || ''}
                            onChange={(e) => handleFilterChange('siteId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
                        >
                            <option value="">Todas las sedes</option>
                            {sites.map(site => (
                                <option key={site.id} value={site.id}>{site.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Servicio - Dependiente de Sede */}
                    <div>
                        <label htmlFor="filter-service" className="block text-sm font-medium text-gray-700 mb-2">
                            Servicio
                        </label>
                        <select
                            id="filter-service"
                            value={filters.serviceId || ''}
                            onChange={(e) => handleFilterChange('serviceId', e.target.value ? parseInt(e.target.value) : undefined)}
                            disabled={!filters.siteId && filteredServices.length === 0}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {filters.siteId ? 'Todos los servicios' : 'Selecciona primero una sede'}
                            </option>
                            {filteredServices.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Responsable */}
                    <div>
                        <label htmlFor="filter-responsible" className="block text-sm font-medium text-gray-700 mb-2">
                            Responsable
                        </label>
                        <select
                            id="filter-responsible"
                            value={filters.responsibleId || ''}
                            onChange={(e) => handleFilterChange('responsibleId', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
                        >
                            <option value="">Todos los responsables</option>
                            {responsibles.map(responsible => (
                                <option key={responsible.id} value={responsible.id}>
                                    {responsible.name} - {responsible.role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Marca */}
                    <div className="relative">
                        <label htmlFor="filter-brand" className="block text-sm font-medium text-gray-700 mb-2">
                            Marca
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="filter-brand"
                                value={brandSearch}
                                onChange={(e) => {
                                    setBrandSearch(e.target.value);
                                    handleFilterChange('brand', e.target.value);
                                    setShowBrandSuggestions(true);
                                }}
                                onFocus={() => setShowBrandSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                                placeholder="Buscar por marca..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900"
                            />
                            {showBrandSuggestions && brandSearch && filteredBrands.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredBrands.slice(0, 10).map((brand, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setBrandSearch(brand);
                                                handleFilterChange('brand', brand);
                                                setShowBrandSuggestions(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-sm"
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {brands.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                {brands.length} marca{brands.length > 1 ? 's' : ''} disponible{brands.length > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

