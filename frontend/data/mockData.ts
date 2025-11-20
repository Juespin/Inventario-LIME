import { Equipment, Site, Service, Responsible } from '../types';

export const mockSites: Site[] = [
    { id: 1, name: 'HAMA - Sede Principal' },
    { id: 2, name: 'LIME - Laboratorio Central' },
    { id: 3, name: 'UdeA - Sede Investigación' },
];

export const mockServices: Service[] = [
    { id: 1, name: 'Cardiología', siteId: 1 },
    { id: 2, name: 'Rayos X', siteId: 1 },
    { id: 3, name: 'Unidad de Cuidados Intensivos (UCI)', siteId: 1 },
    { id: 4, name: 'Análisis Clínicos', siteId: 2 },
    { id: 5, name: 'Microbiología', siteId: 2 },
    { id: 6, name: 'Biología Molecular', siteId: 3 },
];

export const mockResponsibles: Responsible[] = [
    { id: 1, name: 'Dr. Juan Pérez', role: 'Jefe de Cardiología' },
    { id: 2, name: 'Ing. Ana García', role: 'Ingeniera Biomédica' },
    { id: 3, name: 'Lic. Carlos Rodríguez', role: 'Jefe de Laboratorio' },
    { id: 4, name: 'Dra. María López', role: 'Investigadora Principal' },
];

export const mockEquipments: Equipment[] = [
    {
        id: 'EQ-001',
        name: 'Electrocardiógrafo',
        brand: 'Philips',
        model: 'PageWriter TC30',
        serial: 'PH-12345',
        inventoryCode: 'HAMA-CARD-001',
        status: 'Activo',
        siteId: 1,
        serviceId: 1,
        responsibleId: 1,
        imageUrl: 'https://picsum.photos/seed/ecg/400/300',
        documents: [
            { name: 'Hoja de vida', hasDocument: true, fileURL: '#' },
            { name: 'Manual de usuario', hasDocument: true, fileURL: '#' },
            { name: 'Protocolo de mantenimiento', hasDocument: false },
            { name: 'Guía rápida', hasDocument: false },
        ],
        generalInfo: {},
        historicalRecord: {
            acquisitionDate: '2022-05-10',
            provider: 'Medtronic',
            log: [
              '2023-01-15: Mantenimiento preventivo realizado.',
              '2023-06-20: Calibración anual completada.'
            ]
        },
        metrologicalAdminInfo: {
            maintenance: true,
            maintenanceFrequency: 6,
            lastMaintenanceDate: '2025-05-01', // Último hace ~6.5 meses, próxima sería 2025-11-01 (VENCIDO - hace 18 días)
            calibration: true,
            calibrationFrequency: 12,
            lastCalibrationDate: '2025-10-25' // Última hace ~25 días, próxima sería 2026-10-25 (PROGRAMADO - >30 días)
        },
        operatingConditions: {
            voltage: '110-240V',
            dimensions: '40x30x20 cm'
        }
    },
    {
        id: 'EQ-002',
        name: 'Máquina de Rayos X',
        brand: 'Siemens',
        model: 'Multix Fusion Max',
        serial: 'SM-67890',
        inventoryCode: 'HAMA-RAYX-001',
        status: 'Activo',
        siteId: 1,
        serviceId: 2,
        responsibleId: 2,
        imageUrl: 'https://picsum.photos/seed/xray/400/300',
        documents: [
            { name: 'Hoja de vida', hasDocument: true, fileURL: '#' },
            { name: 'Manual de usuario', hasDocument: false },
        ],
        historicalRecord: {
            acquisitionDate: '2021-03-15'
        },
        metrologicalAdminInfo: {
            maintenance: true,
            maintenanceFrequency: 3,
            lastMaintenanceDate: '2025-09-05', // Último hace ~2.5 meses, próxima sería 2025-12-05 (PRÓXIMO - en 16 días)
            calibration: true,
            calibrationFrequency: 6,
            lastCalibrationDate: '2025-10-28' // Última hace ~22 días, próxima sería 2026-04-28 (PROGRAMADO - >30 días)
        }
    },
    {
        id: 'EQ-003',
        name: 'Analizador de Hematología',
        brand: 'Roche',
        model: 'Cobas 8000',
        serial: 'RC-11223',
        inventoryCode: 'LIME-HEMA-001',
        status: 'Mantenimiento',
        siteId: 2,
        serviceId: 4,
        responsibleId: 3,
        imageUrl: 'https://picsum.photos/seed/hema/400/300',
        documents: [
            { name: 'Hoja de vida', hasDocument: true, fileURL: '#' },
        ],
        historicalRecord: {
            acquisitionDate: '2023-01-20'
        },
        metrologicalAdminInfo: {
            maintenance: true,
            maintenanceFrequency: 6,
            lastMaintenanceDate: '2025-10-20', // Último hace ~30 días, próxima sería 2026-04-20 (PROGRAMADO - >30 días)
            calibration: true,
            calibrationFrequency: 12,
            lastCalibrationDate: '2025-11-05' // Última hace ~14 días, próxima sería 2026-11-05 (PRÓXIMO - en ~30 días, límite)
        }
    },
    {
        id: 'EQ-004',
        name: 'Secuenciador de ADN',
        brand: 'Illumina',
        model: 'NovaSeq 6000',
        serial: 'IL-44556',
        inventoryCode: 'UDEA-BIOM-001',
        status: 'Activo',
        siteId: 3,
        serviceId: 6,
        responsibleId: 4,
        imageUrl: 'https://picsum.photos/seed/dna/400/300',
        documents: [
            { name: 'Hoja de vida', hasDocument: true, fileURL: '#' },
            { name: 'Manual de usuario', hasDocument: true, fileURL: '#' },
            { name: 'Protocolo de mantenimiento', hasDocument: true, fileURL: '#' },
        ],
        historicalRecord: {
            acquisitionDate: '2023-08-10'
        },
        metrologicalAdminInfo: {
            maintenance: true,
            maintenanceFrequency: 12,
            lastMaintenanceDate: '2025-11-15', // Último hace ~4 días, próxima sería 2026-11-15 (PROGRAMADO - >30 días)
            calibration: false
        }
    },
];