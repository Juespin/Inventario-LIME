export type View = 'dashboard' | 'administration';

export interface Site {
    id: number;
    name: string;
}

export interface Service {
    id: number;
    name: string;
    siteId: number;
}

export interface Responsible {
    id: number;
    name: string;
    role: string;
}

export interface Document {
    name: string;
    hasDocument: boolean;
    fileContent?: string;
    fileType?: string;
}

export interface DecommissionInfo {
    date: string;
    reason: string;
}

export interface TransferInfo {
    fromSiteId: number;
    fromServiceId: number;

    toSiteId: number;
    toServiceId: number;
    responsibleId: number;
    date: string;
    justification: string;
    signature?: string;
}

export interface Equipment {
    id: string;
    name: string;
    brand: string;
    model: string;
    serial: string;
    inventoryCode: string;
    status: 'Activo' | 'Inactivo' | 'Mantenimiento';
    siteId: number;
    serviceId: number;
    responsibleId: number;
    imageUrl: string;
    
    // Ficha técnica
    generalInfo?: {
        process?: string;
        ipsCode?: string;
        ecriCode?: string;
        processResponsible?: string;
        physicalLocation?: string;
        misionalClassification?: string;
        ipsClassification?: string;
        riskClassification?: string;
        invimaRecord?: string;
    };
    historicalRecord?: {
        usefulLife?: string;
        acquisitionDate?: string;
        owner?: string;
        fabricationDate?: string;
        nit?: string;
        provider?: string;
        inWarranty?: boolean;
        warrantyEndDate?: string;
        acquisitionMethod?: string;
        documentType?: string;
        documentNumber?: string;
        log?: string[];
    };
    documents?: Document[];
    metrologicalAdminInfo?: {
        maintenance?: boolean;
        maintenanceFrequency?: number;
        calibration?: boolean;
        calibrationFrequency?: number;
    };
    metrologicalTechnicalInfo?: {
        magnitude?: string;
        equipmentRange?: string;
        resolution?: string;
        workRange?: string;
        maxPermittedError?: string;
    };
    operatingConditions?: {
        voltage?: string;
        current?: string;
        relativeHumidity?: string;
        temperature?: string;
        dimensions?: string;
        weight?: string;
        otherConditions?: string;
    };

    decommissionInfo?: DecommissionInfo;
    transferHistory?: TransferInfo[];
}