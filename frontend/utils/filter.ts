import { Equipment, EquipmentFilters } from '../types';

export const applyFilters = (equipments: Equipment[], filters: EquipmentFilters, searchQuery?: string): Equipment[] => {
    let filtered = [...equipments];

    // Aplicar búsqueda general primero
    if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(eq =>
            eq.name.toLowerCase().includes(query) ||
            eq.brand.toLowerCase().includes(query) ||
            eq.model.toLowerCase().includes(query) ||
            eq.inventoryCode.toLowerCase().includes(query)
        );
    }

    // Aplicar filtro de estado
    if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(eq => filters.status!.includes(eq.status));
    }

    // Aplicar filtro de sede
    if (filters.siteId) {
        filtered = filtered.filter(eq => eq.siteId === filters.siteId);
    }

    // Aplicar filtro de servicio
    if (filters.serviceId) {
        filtered = filtered.filter(eq => eq.serviceId === filters.serviceId);
    }

    // Aplicar filtro de responsable
    if (filters.responsibleId) {
        filtered = filtered.filter(eq => eq.responsibleId === filters.responsibleId);
    }

    // Aplicar filtro de marca
    if (filters.brand && filters.brand.trim()) {
        const brandQuery = filters.brand.toLowerCase().trim();
        filtered = filtered.filter(eq => 
            eq.brand.toLowerCase().includes(brandQuery)
        );
    }

    return filtered;
};

export const getUniqueBrands = (equipments: Equipment[]): string[] => {
    const brands = new Set(equipments.map(eq => eq.brand).filter(Boolean));
    return Array.from(brands).sort();
};

