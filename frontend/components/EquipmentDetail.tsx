
import React from 'react';
import { Equipment, Site, Service, Responsible, Document, TransferInfo } from '../types';
import { FileText, CheckCircle, XCircle, Calendar, ArrowRight, User, File as FileIcon, Signature } from 'lucide-react';

interface EquipmentDetailProps {
    equipment: Equipment;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-lime-blue-800 border-b-2 border-lime-blue-200 pb-2 mb-3">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value?: React.ReactNode; className?: string; }> = ({ label, value, className }) => (
    <div className={`grid grid-cols-3 gap-4 items-start ${className}`}>
        <p className="text-sm font-medium text-gray-500 col-span-1">{label}</p>
        <div className="text-sm text-gray-800 col-span-2">{value ?? <span className="text-gray-400">N/A</span>}</div>
    </div>
);

const BooleanDisplay: React.FC<{ value: boolean | undefined }> = ({ value }) => (
    value ? <CheckCircle className="w-5 h-5 text-green-500 inline-block" /> : <XCircle className="w-5 h-5 text-red-500 inline-block" />
);

const DocumentItem: React.FC<{ doc: Document }> = ({ doc }) => (
    <div className="flex items-center justify-between p-2 border rounded-md bg-white hover:bg-slate-50 transition-colors">
        <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-lime-blue-600" />
            <span className="font-medium text-sm">{doc.name}</span>
        </div>
        {doc.hasDocument ? (
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">Disponible</span>
                {doc.fileURL && <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" className="text-lime-blue-600 hover:text-lime-blue-800 p-1 rounded-full hover:bg-lime-blue-100"><FileIcon className="w-4 h-4"/></a>}
            </div>
        ) : (
             <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">No disponible</span>
        )}
    </div>
);

const TransferHistoryItem: React.FC<{ transfer: TransferInfo; sites: Site[]; services: Service[]; responsibles: Responsible[] }> = ({ transfer, sites, services, responsibles }) => {
    const fromSite = sites.find(s => s.id === transfer.fromSiteId)?.name || 'N/A';
    const toSite = sites.find(s => s.id === transfer.toSiteId)?.name || 'N/A';
    const fromService = services.find(s => s.id === transfer.fromServiceId)?.name || 'N/A';
    const toService = services.find(s => s.id === transfer.toServiceId)?.name || 'N/A';
    const responsible = responsibles.find(r => r.id === transfer.responsibleId)?.name || 'N/A';

    return (
        <div className="p-3 border rounded-md bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{new Date(transfer.date).toLocaleDateString('es-ES')}</div>
                <div className="flex items-center"><User className="w-3 h-3 mr-1" />{responsible}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                    <p className="font-semibold">{fromSite}</p>
                    <p className="text-xs text-gray-500">{fromService}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-lime-blue-500 mx-4 flex-shrink-0" />
                <div className="text-center">
                    <p className="font-semibold">{toSite}</p>
                    <p className="text-xs text-gray-500">{toService}</p>
                </div>
            </div>
            <p className="text-xs italic text-gray-600 pt-2 border-t mt-2">Justificación: {transfer.justification}</p>
            {transfer.signature && <div className="flex items-center pt-2 border-t mt-2"> <Signature className="w-3 h-3 mr-1 text-gray-500" /> <span className="text-xs text-gray-500">Firma registrada</span> </div>}
        </div>
    );
}

export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment, sites, services, responsibles }) => {
    
    const { 
        generalInfo, historicalRecord, documents, metrologicalAdminInfo, 
        metrologicalTechnicalInfo, operatingConditions, decommissionInfo, transferHistory 
    } = equipment;

    return (
        <div className="text-sm">
            
            {decommissionInfo && (
                 <DetailSection title="Información de Baja">
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                        <DetailItem label="Fecha de Baja" value={new Date(decommissionInfo.date).toLocaleDateString('es-ES')} />
                        <DetailItem label="Motivo" value={decommissionInfo.reason} />
                    </div>
                </DetailSection>
            )}

            <DetailSection title="Información General">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <DetailItem label="Proceso" value={generalInfo?.process} />
                    <DetailItem label="Código IPS" value={generalInfo?.ipsCode} />
                    <DetailItem label="Código ECRI" value={generalInfo?.ecriCode} />
                    <DetailItem label="Responsable del Proceso" value={generalInfo?.processResponsible} />
                    <DetailItem label="Ubicación Física" value={generalInfo?.physicalLocation} />
                    <DetailItem label="Clasificación Misional" value={generalInfo?.misionalClassification} />
                    <DetailItem label="Clasificación IPS" value={generalInfo?.ipsClassification} />
                    <DetailItem label="Clasificación por Riesgo" value={generalInfo?.riskClassification} />
                    <DetailItem label="Registro Invima" value={generalInfo?.invimaRecord} />
                </div>
            </DetailSection>

            <DetailSection title="Registro Histórico">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <DetailItem label="Tiempo de Vida Útil" value={historicalRecord?.usefulLife} />
                    <DetailItem label="Fecha de Adquisición" value={historicalRecord?.acquisitionDate} />
                    <DetailItem label="Propietario" value={historicalRecord?.owner} />
                    <DetailItem label="Fecha de Fabricación" value={historicalRecord?.fabricationDate} />
                    <DetailItem label="NIT Proveedor" value={historicalRecord?.nit} />
                    <DetailItem label="Proveedor" value={historicalRecord?.provider} />
                    <DetailItem label="En Garantía" value={<BooleanDisplay value={historicalRecord?.inWarranty} />} />
                    <DetailItem label="Fin de Garantía" value={historicalRecord?.warrantyEndDate} />
                    <DetailItem label="Forma de Adquisición" value={historicalRecord?.acquisitionMethod} />
                    <DetailItem label="Tipo de Documento" value={historicalRecord?.documentType} />
                    <DetailItem label="Número de Documento" value={historicalRecord?.documentNumber} />
                 </div>
                 <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Bitácora</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md bg-slate-50">
                        {historicalRecord?.log?.length ? historicalRecord.log.map((entry, i) => (
                            <p key={i} className="text-xs text-gray-700 border-b pb-1 last:border-b-0">{entry}</p>
                        )) : <p className="text-xs text-gray-400 italic">No hay entradas en la bitácora.</p>}
                    </div>
                 </div>
            </DetailSection>

            <DetailSection title="Documentos">
                <div className="space-y-2">
                    {documents?.map((doc, index) => <DocumentItem key={index} doc={doc} />)}
                </div>
            </DetailSection>

            <DetailSection title="Información Metrológica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-base text-slate-700 mb-2">Administrativa</h4>
                        <DetailItem label="Requiere Mantenimiento" value={<BooleanDisplay value={metrologicalAdminInfo?.maintenance} />} />
                        <DetailItem label="Frec. Mantenimiento" value={metrologicalAdminInfo?.maintenanceFrequency ? `${metrologicalAdminInfo.maintenanceFrequency} meses` : undefined} />
                        <DetailItem label="Requiere Calibración" value={<BooleanDisplay value={metrologicalAdminInfo?.calibration} />} />
                        <DetailItem label="Frec. Calibración" value={metrologicalAdminInfo?.calibrationFrequency ? `${metrologicalAdminInfo.calibrationFrequency} meses` : undefined} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-base text-slate-700 mb-2">Técnica</h4>
                        <DetailItem label="Magnitud" value={metrologicalTechnicalInfo?.magnitude} />
                        <DetailItem label="Rango del Equipo" value={metrologicalTechnicalInfo?.equipmentRange} />
                        <DetailItem label="Resolución" value={metrologicalTechnicalInfo?.resolution} />
                        <DetailItem label="Rango de Trabajo" value={metrologicalTechnicalInfo?.workRange} />
                        <DetailItem label="Error Máximo Permitido" value={metrologicalTechnicalInfo?.maxPermittedError} />
                    </div>
                </div>
            </DetailSection>

             <DetailSection title="Condiciones de Funcionamiento">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <DetailItem label="Voltaje" value={operatingConditions?.voltage} />
                    <DetailItem label="Corriente" value={operatingConditions?.current} />
                    <DetailItem label="Humedad Relativa" value={operatingConditions?.relativeHumidity} />
                    <DetailItem label="Temperatura" value={operatingConditions?.temperature} />
                    <DetailItem label="Dimensiones" value={operatingConditions?.dimensions} />
                    <DetailItem label="Peso" value={operatingConditions?.weight} />
                    <DetailItem label="Otras" value={operatingConditions?.otherConditions} />
                </div>
            </DetailSection>

            {transferHistory && transferHistory.length > 0 && (
                <DetailSection title="Historial de Traslados">
                    <div className="space-y-3">
                        {transferHistory.slice().reverse().map((transfer, index) => (
                           <TransferHistoryItem key={index} transfer={transfer} sites={sites} services={services} responsibles={responsibles} />
                        ))}
                    </div>
                </DetailSection>
            )}

        </div>
    );
};
