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
        ]
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
        ]
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
        ]
    },
];