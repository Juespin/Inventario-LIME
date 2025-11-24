export function mapEquipmentFromBackend(data: any) {
    return {
        id: data.id,
        name: data.name,
        brand: data.brand,
        model: data.model,
        status: data.status,
        imageUrl: data.image_url,
        inventoryCode: data.inventory_code,

        siteId: data.site_details?.id,
        serviceId: data.service_details?.id,
        responsibleId: data.responsible_details?.id,

        generalInfo: {
            ipsCode: data.ips_code,
            ecriCode: data.ecri_code,
            physicalLocation: data.physical_location,
            misionalClassification: data.misional_classification,
            ipsClassification: data.ips_classification,
            riskClassification: data.risk_classification,
            invimaRecord: data.invima_record,
            comercializationPermit: data.comercialization_permit,
            noAplica: data.no_aplica
        },

        historicalRecord: {
            usefulLife: data.useful_life,
            acquisitionDate: data.acquisition_date,
            owner: data.owner,
            fabricationDate: data.fabrication_date,
            nit: data.nit,
            provider: data.provider,
            inWarranty: data.in_warranty,
            warrantyEndDate: data.warranty_end_date,
            acquisitionMethod: data.acquisition_method,
            documentType: data.document_type,
            documentNumber: data.document_number
        },

        metrologicalAdminInfo: {
            maintenance: data.maintenance,
            maintenanceFrequency: data.maintenance_frequency,
            lastMaintenanceDate: data.last_maintenance_date,
            calibration: data.calibration,
            calibrationFrequency: data.calibration_frequency,
            lastCalibrationDate: data.last_calibration_date,
        },

        metrologicalTechnicalInfo: {
            magnitude: data.magnitude,
            equipmentRangeMin: data.equipment_range_min,
            equipmentRangeMax: data.equipment_range_max,
            resolution: data.resolution,
            workRangeMin: data.work_range_min,
            workRangeMax: data.work_range_max,
            maxPermittedError: data.max_permitted_error
        },

        operatingConditions: {
            voltage: data.voltage,
            current: data.current,
            relativeHumidity: data.humidity,
            temperature: data.temperature,
            dimensions: data.dimensions,
            weight: data.weight,
            otherConditions: data.other_conditions
        },

        documents: data.documents || [],
        transferHistory: data.transfers || [],
        decommissionInfo: data.decommission_info || null
    };
}
