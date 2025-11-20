import { EquipmentFilters } from '../types';

/**
 * Convierte los filtros a parámetros de URL
 */
export const filtersToUrlParams = (filters: EquipmentFilters): URLSearchParams => {
    const params = new URLSearchParams();

    if (filters.status && filters.status.length > 0) {
        params.set('status', filters.status.join(','));
    }

    if (filters.siteId) {
        params.set('siteId', filters.siteId.toString());
    }

    if (filters.serviceId) {
        params.set('serviceId', filters.serviceId.toString());
    }

    if (filters.responsibleId) {
        params.set('responsibleId', filters.responsibleId.toString());
    }

    if (filters.brand && filters.brand.trim()) {
        params.set('brand', filters.brand.trim());
    }

    return params;
};

/**
 * Lee los filtros de los parámetros de URL
 */
export const urlParamsToFilters = (searchParams: URLSearchParams): EquipmentFilters => {
    const filters: EquipmentFilters = {};

    // Estado (puede ser múltiple, separado por comas)
    const statusParam = searchParams.get('status');
    if (statusParam) {
        const statuses = statusParam.split(',').filter(s => 
            ['Activo', 'Inactivo', 'Mantenimiento'].includes(s)
        ) as ('Activo' | 'Inactivo' | 'Mantenimiento')[];
        if (statuses.length > 0) {
            filters.status = statuses;
        }
    }

    // Sede
    const siteIdParam = searchParams.get('siteId');
    if (siteIdParam) {
        const siteId = parseInt(siteIdParam, 10);
        if (!isNaN(siteId)) {
            filters.siteId = siteId;
        }
    }

    // Servicio
    const serviceIdParam = searchParams.get('serviceId');
    if (serviceIdParam) {
        const serviceId = parseInt(serviceIdParam, 10);
        if (!isNaN(serviceId)) {
            filters.serviceId = serviceId;
        }
    }

    // Responsable
    const responsibleIdParam = searchParams.get('responsibleId');
    if (responsibleIdParam) {
        const responsibleId = parseInt(responsibleIdParam, 10);
        if (!isNaN(responsibleId)) {
            filters.responsibleId = responsibleId;
        }
    }

    // Marca
    const brandParam = searchParams.get('brand');
    if (brandParam && brandParam.trim()) {
        filters.brand = brandParam.trim();
    }

    return filters;
};

/**
 * Actualiza la URL con los filtros sin recargar la página
 */
export const updateUrlWithFilters = (filters: EquipmentFilters, replace: boolean = false) => {
    const params = filtersToUrlParams(filters);
    const newUrl = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

    if (replace) {
        window.history.replaceState({}, '', newUrl);
    } else {
        window.history.pushState({}, '', newUrl);
    }
};

/**
 * Lee los filtros de la URL actual
 */
export const getFiltersFromUrl = (): EquipmentFilters => {
    const searchParams = new URLSearchParams(window.location.search);
    return urlParamsToFilters(searchParams);
};

