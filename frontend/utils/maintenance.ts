import { Equipment, MaintenanceEvent } from '../types';

/**
 * Calcula la próxima fecha de mantenimiento/calibración basándose en la última fecha y frecuencia
 */
export const calculateNextDate = (lastDate: string | undefined, frequencyMonths: number | undefined): string | null => {
    if (!lastDate || !frequencyMonths || frequencyMonths <= 0) {
        return null;
    }

    const lastDateObj = new Date(lastDate);
    if (isNaN(lastDateObj.getTime())) {
        return null;
    }

    const nextDate = new Date(lastDateObj);
    nextDate.setMonth(nextDate.getMonth() + frequencyMonths);

    return nextDate.toISOString().split('T')[0]; // Retorna en formato YYYY-MM-DD
};

/**
 * Calcula los días restantes hasta una fecha
 */
export const calculateDaysRemaining = (nextDate: string | null): number | null => {
    if (!nextDate) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDateObj = new Date(nextDate);
    nextDateObj.setHours(0, 0, 0, 0);

    if (isNaN(nextDateObj.getTime())) {
        return null;
    }

    const diffTime = nextDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Determina el estado de un evento de mantenimiento
 */
export const getMaintenanceStatus = (daysRemaining: number | null): 'upcoming' | 'due' | 'overdue' => {
    if (daysRemaining === null) {
        return 'upcoming';
    }

    if (daysRemaining < 0) {
        return 'overdue'; // Vencido
    } else if (daysRemaining <= 30) {
        return 'due'; // Próximo (dentro de 30 días)
    } else {
        return 'upcoming'; // Próximo pero no urgente
    }
};

/**
 * Genera eventos de mantenimiento a partir de los equipos
 */
export const generateMaintenanceEvents = (equipments: Equipment[]): MaintenanceEvent[] => {
    const events: MaintenanceEvent[] = [];

    equipments.forEach(equipment => {
        const metrologicalInfo = equipment.metrologicalAdminInfo;

        // Solo incluir equipos activos
        if (equipment.status !== 'Activo') {
            return;
        }

        // Generar evento de mantenimiento si está configurado
        if (metrologicalInfo?.maintenance && metrologicalInfo.maintenanceFrequency) {
            const lastMaintenanceDate = metrologicalInfo.lastMaintenanceDate || equipment.historicalRecord?.acquisitionDate;
            const nextMaintenanceDate = calculateNextDate(lastMaintenanceDate, metrologicalInfo.maintenanceFrequency);

            if (nextMaintenanceDate) {
                const daysRemaining = calculateDaysRemaining(nextMaintenanceDate);
                const status = getMaintenanceStatus(daysRemaining);

                events.push({
                    id: `${equipment.id}-maintenance`,
                    equipmentId: equipment.id,
                    equipmentName: equipment.name,
                    inventoryCode: equipment.inventoryCode,
                    type: 'maintenance',
                    lastDate: lastMaintenanceDate || '',
                    nextDate: nextMaintenanceDate,
                    frequency: metrologicalInfo.maintenanceFrequency,
                    daysRemaining: daysRemaining || 0,
                    status,
                    siteId: equipment.siteId,
                    serviceId: equipment.serviceId,
                    responsibleId: equipment.responsibleId,
                });
            }
        }

        // Generar evento de calibración si está configurado
        if (metrologicalInfo?.calibration && metrologicalInfo.calibrationFrequency) {
            const lastCalibrationDate = metrologicalInfo.lastCalibrationDate || equipment.historicalRecord?.acquisitionDate;
            const nextCalibrationDate = calculateNextDate(lastCalibrationDate, metrologicalInfo.calibrationFrequency);

            if (nextCalibrationDate) {
                const daysRemaining = calculateDaysRemaining(nextCalibrationDate);
                const status = getMaintenanceStatus(daysRemaining);

                events.push({
                    id: `${equipment.id}-calibration`,
                    equipmentId: equipment.id,
                    equipmentName: equipment.name,
                    inventoryCode: equipment.inventoryCode,
                    type: 'calibration',
                    lastDate: lastCalibrationDate || '',
                    nextDate: nextCalibrationDate,
                    frequency: metrologicalInfo.calibrationFrequency,
                    daysRemaining: daysRemaining || 0,
                    status,
                    siteId: equipment.siteId,
                    serviceId: equipment.serviceId,
                    responsibleId: equipment.responsibleId,
                });
            }
        }
    });

    return events;
};

/**
 * Formatea los días restantes en un texto legible
 */
export const formatDaysRemaining = (days: number): string => {
    if (days < 0) {
        return `Vencido hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`;
    } else if (days === 0) {
        return 'Hoy';
    } else if (days === 1) {
        return 'Mañana';
    } else if (days < 30) {
        return `En ${days} días`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (remainingDays === 0) {
            return `En ${months} mes${months !== 1 ? 'es' : ''}`;
        }
        return `En ${months} mes${months !== 1 ? 'es' : ''} y ${remainingDays} día${remainingDays !== 1 ? 's' : ''}`;
    } else {
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        if (months === 0) {
            return `En ${years} año${years !== 1 ? 's' : ''}`;
        }
        return `En ${years} año${years !== 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
    }
};

/**
 * Ordena eventos por fecha próxima (más urgentes primero)
 */
export const sortEventsByUrgency = (events: MaintenanceEvent[]): MaintenanceEvent[] => {
    return [...events].sort((a, b) => {
        // Primero los vencidos (daysRemaining negativo)
        if (a.daysRemaining < 0 && b.daysRemaining >= 0) return -1;
        if (a.daysRemaining >= 0 && b.daysRemaining < 0) return 1;
        
        // Entre vencidos, los más vencidos primero
        if (a.daysRemaining < 0 && b.daysRemaining < 0) {
            return a.daysRemaining - b.daysRemaining;
        }
        
        // Entre no vencidos, los más próximos primero
        return a.daysRemaining - b.daysRemaining;
    });
};

