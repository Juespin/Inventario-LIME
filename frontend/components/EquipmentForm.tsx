import React, { useState, useEffect } from 'react';
import { Equipment, Site, Service, Responsible, Document } from '../types';
import { ChevronDown, ChevronUp, FileText, Upload, Eye, Trash2, Plus } from 'lucide-react';

interface EquipmentFormProps {
    equipment: Equipment;
    onSave: (equipment: Equipment) => void;
    onCancel: () => void;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
}

export const emptyEquipment: Equipment = {
    id: '', name: '', brand: '', model: '', serial: '', inventoryCode: '',
    status: 'Activo', siteId: 0, serviceId: 0, responsibleId: 0, imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
    documents: [
      { name: 'Hoja de vida', hasDocument: false },
      { name: 'Manual de usuario', hasDocument: false },
      { name: 'Protocolo de mantenimiento', hasDocument: false },
      { name: 'Guía rápida', hasDocument: false },
    ],
    generalInfo: {}, 
    historicalRecord: { log: [] }, 
    metrologicalAdminInfo: {}, 
    metrologicalTechnicalInfo: {}, 
    operatingConditions: {}
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-md mb-4 bg-white">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-t-md">
        <h4 className="font-semibold text-md text-slate-700">{title}</h4>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

const DocumentUploader: React.FC<{ document: Document, onChange: (doc: Document) => void }> = ({ document, onChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onChange({ ...document, file, fileURL: URL.createObjectURL(file), hasDocument: true });
        }
    };

    return (
        <div className="flex items-center justify-between p-3 border rounded-md mb-2 bg-white hover:bg-slate-50">
            <span className="font-medium text-sm flex items-center"><FileText className="w-4 h-4 mr-2 text-lime-blue-600" />{document.name}</span>
            <div className="flex items-center space-x-3">
                <span className="text-sm">¿Tiene documento?</span>
                 <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={document.hasDocument} onChange={(e) => onChange({...document, hasDocument: e.target.checked})} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-lime-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-green-600"></div>
                </label>

                {document.hasDocument && (
                    <>
                        <label htmlFor={`file-${document.name}`} className="cursor-pointer text-lime-blue-600 hover:text-lime-blue-800">
                            <Upload className="w-5 h-5" />
                            <input id={`file-${document.name}`} type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                        {document.fileURL && (
                            <>
                                <a href={document.fileURL} target="_blank" rel="noopener noreferrer" className="text-lime-blue-600 hover:text-lime-blue-800"><Eye className="w-5 h-5"/></a>
                                <div className="w-10 h-10 border rounded"><img src="https://picsum.photos/seed/pdf/50/50" alt="thumbnail" className="object-cover w-full h-full"/></div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

const FormInput: React.FC<{ label: string; name: string; value: any; onChange: any; type?: string; placeholder?: string;}> = ({ label, name, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder || label}
            className="p-2 border border-gray-300 rounded-md w-full shadow-sm focus:ring-lime-blue-500 focus:border-lime-blue-500"
        />
    </div>
);

const FormCheckbox: React.FC<{ label: string; name: string; checked: boolean; onChange: any;}> = ({ label, name, checked, onChange }) => (
    <div className="flex items-center h-full pt-6">
        <input
            type="checkbox"
            name={name}
            id={name}
            checked={!!checked}
            onChange={onChange}
            className="h-4 w-4 text-lime-blue-600 border-gray-300 rounded focus:ring-lime-blue-500"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900">{label}</label>
    </div>
);


export const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel, sites, services, responsibles }) => {
    const [formData, setFormData] = useState<Equipment>(equipment);
    const [showMore, setShowMore] = useState(false);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [newLogEntry, setNewLogEntry] = useState('');

    useEffect(() => {
        setFormData(equipment)
    }, [equipment]);
    
    useEffect(() => {
        if (formData.siteId) {
            setFilteredServices(services.filter(s => s.siteId === formData.siteId));
        } else {
            setFilteredServices([]);
        }
    }, [formData.siteId, services]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.endsWith('Id') ? parseInt(value) : value }));
    };

    const handleSectionChange = (section: keyof Equipment, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [name]: type === 'checkbox' ? checked : value,
            }
        }));
    };

    const handleAddLog = () => {
        if (newLogEntry.trim()) {
            const entry = `${new Date().toLocaleDateString('es-ES')}: ${newLogEntry.trim()}`;
            const newLog = [...(formData.historicalRecord?.log || []), entry];
            setFormData(prev => ({
                ...prev,
                historicalRecord: {
                    ...prev.historicalRecord,
                    log: newLog
                }
            }));
            setNewLogEntry('');
        }
    };

    const handleDocChange = (index: number, updatedDoc: Document) => {
        const newDocs = [...(formData.documents || [])];
        newDocs[index] = updatedDoc;
        setFormData(prev => ({...prev, documents: newDocs}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-md bg-white">
                 <h3 className="font-semibold text-lg mb-3">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Nombre del Equipo" name="name" value={formData.name} onChange={handleChange} />
                    <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                    <FormInput label="Modelo" name="model" value={formData.model} onChange={handleChange} />
                    <FormInput label="Número de Serie" name="serial" value={formData.serial} onChange={handleChange} />
                    <FormInput label="Código de Inventario" name="inventoryCode" value={formData.inventoryCode} onChange={handleChange} />
                    <div>
                         <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                         <select name="status" id="status" value={formData.status} onChange={handleChange} className="p-2 border border-gray-300 rounded-md w-full shadow-sm focus:ring-lime-blue-500 focus:border-lime-blue-500">
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="siteId" className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                        <select name="siteId" id="siteId" value={formData.siteId} onChange={handleChange} className="p-2 border border-gray-300 rounded-md w-full shadow-sm" required>
                            <option value={0}>Seleccione Sede</option>
                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                        <select name="serviceId" id="serviceId" value={formData.serviceId} onChange={handleChange} className="p-2 border border-gray-300 rounded-md w-full shadow-sm" required disabled={!formData.siteId}>
                            <option value={0}>Seleccione Servicio</option>
                            {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="responsibleId" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                        <select name="responsibleId" id="responsibleId" value={formData.responsibleId} onChange={handleChange} className="p-2 border border-gray-300 rounded-md w-full shadow-sm" required>
                            <option value={0}>Seleccione Responsable</option>
                            {responsibles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            <button type="button" onClick={() => setShowMore(!showMore)} className="text-lime-blue-600 hover:underline font-medium flex items-center gap-1">
                {showMore ? <><ChevronUp size={16}/> Ocultar Ficha Técnica</> : <><ChevronDown size={16}/> Ver más (Ficha Técnica)</>}
            </button>

            {showMore && (
                <div className="mt-4 bg-slate-50 p-4 rounded-md">
                    <Section title="Información General">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Proceso" name="process" value={formData.generalInfo?.process} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Código IPS" name="ipsCode" value={formData.generalInfo?.ipsCode} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Código ECRI" name="ecriCode" value={formData.generalInfo?.ecriCode} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Responsable del Proceso" name="processResponsible" value={formData.generalInfo?.processResponsible} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Ubicación Física" name="physicalLocation" value={formData.generalInfo?.physicalLocation} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Clasificación Misional" name="misionalClassification" value={formData.generalInfo?.misionalClassification} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Clasificación IPS" name="ipsClassification" value={formData.generalInfo?.ipsClassification} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Clasificación por Riesgo" name="riskClassification" value={formData.generalInfo?.riskClassification} onChange={(e) => handleSectionChange('generalInfo', e)} />
                            <FormInput label="Registro Invima" name="invimaRecord" value={formData.generalInfo?.invimaRecord} onChange={(e) => handleSectionChange('generalInfo', e)} />
                       </div>
                    </Section>
                    <Section title="Registro Histórico">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Tiempo de Vida Útil" name="usefulLife" value={formData.historicalRecord?.usefulLife} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Fecha de Adquisición" name="acquisitionDate" type="date" value={formData.historicalRecord?.acquisitionDate} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Propietario" name="owner" value={formData.historicalRecord?.owner} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Fecha de Fabricación" name="fabricationDate" type="date" value={formData.historicalRecord?.fabricationDate} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="NIT Proveedor" name="nit" value={formData.historicalRecord?.nit} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Proveedor" name="provider" value={formData.historicalRecord?.provider} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormCheckbox label="En Garantía" name="inWarranty" checked={formData.historicalRecord?.inWarranty} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Fin de Garantía" name="warrantyEndDate" type="date" value={formData.historicalRecord?.warrantyEndDate} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Forma de Adquisición" name="acquisitionMethod" value={formData.historicalRecord?.acquisitionMethod} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Tipo de Documento" name="documentType" value={formData.historicalRecord?.documentType} onChange={e => handleSectionChange('historicalRecord', e)} />
                            <FormInput label="Número de Documento" name="documentNumber" value={formData.historicalRecord?.documentNumber} onChange={e => handleSectionChange('historicalRecord', e)} />
                        </div>
                        <div className="mt-6">
                            <h5 className="font-semibold text-sm mb-2">Bitácora</h5>
                            <ul className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md bg-white mb-2">
                                {formData.historicalRecord?.log?.length ? formData.historicalRecord.log.map((entry, i) => (
                                    <li key={i} className="text-xs text-gray-600 border-b pb-1">{entry}</li>
                                )) : <li className="text-xs text-gray-400">No hay entradas en la bitácora.</li>}
                            </ul>
                             <div className="flex gap-2">
                                <input type="text" value={newLogEntry} onChange={e => setNewLogEntry(e.target.value)} placeholder="Nueva entrada en la bitácora..." className="p-2 border border-gray-300 rounded-md w-full" />
                                <button type="button" onClick={handleAddLog} className="bg-lime-blue-600 text-white p-2 rounded-lg hover:bg-lime-blue-700 flex items-center"><Plus size={18}/></button>
                            </div>
                        </div>
                    </Section>
                    <Section title="Documentos">
                      {formData.documents?.map((doc, index) => (
                          <DocumentUploader key={index} document={doc} onChange={(updatedDoc) => handleDocChange(index, updatedDoc)} />
                      ))}
                    </Section>
                    <Section title="Información Metrológica Administrativa">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormCheckbox label="Requiere Mantenimiento" name="maintenance" checked={formData.metrologicalAdminInfo?.maintenance} onChange={e => handleSectionChange('metrologicalAdminInfo', e)} />
                            <FormInput label="Frecuencia Mantenimiento (meses)" name="maintenanceFrequency" type="number" value={formData.metrologicalAdminInfo?.maintenanceFrequency} onChange={e => handleSectionChange('metrologicalAdminInfo', e)} />
                             <FormCheckbox label="Requiere Calibración" name="calibration" checked={formData.metrologicalAdminInfo?.calibration} onChange={e => handleSectionChange('metrologicalAdminInfo', e)} />
                            <FormInput label="Frecuencia Calibración (meses)" name="calibrationFrequency" type="number" value={formData.metrologicalAdminInfo?.calibrationFrequency} onChange={e => handleSectionChange('metrologicalAdminInfo', e)} />
                        </div>
                    </Section>
                    <Section title="Información Metrológica Técnica">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Magnitud" name="magnitude" value={formData.metrologicalTechnicalInfo?.magnitude} onChange={e => handleSectionChange('metrologicalTechnicalInfo', e)} />
                            <FormInput label="Rango del Equipo" name="equipmentRange" value={formData.metrologicalTechnicalInfo?.equipmentRange} onChange={e => handleSectionChange('metrologicalTechnicalInfo', e)} />
                            <FormInput label="Resolución" name="resolution" value={formData.metrologicalTechnicalInfo?.resolution} onChange={e => handleSectionChange('metrologicalTechnicalInfo', e)} />
                            <FormInput label="Rango de Trabajo" name="workRange" value={formData.metrologicalTechnicalInfo?.workRange} onChange={e => handleSectionChange('metrologicalTechnicalInfo', e)} />
                            <FormInput label="Error Máximo Permitido" name="maxPermittedError" value={formData.metrologicalTechnicalInfo?.maxPermittedError} onChange={e => handleSectionChange('metrologicalTechnicalInfo', e)} />
                         </div>
                    </Section>
                    <Section title="Condiciones de Funcionamiento">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Voltaje" name="voltage" value={formData.operatingConditions?.voltage} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Corriente" name="current" value={formData.operatingConditions?.current} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Humedad Relativa" name="relativeHumidity" value={formData.operatingConditions?.relativeHumidity} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Temperatura" name="temperature" value={formData.operatingConditions?.temperature} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Dimensiones" name="dimensions" value={formData.operatingConditions?.dimensions} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Peso" name="weight" value={formData.operatingConditions?.weight} onChange={e => handleSectionChange('operatingConditions', e)} />
                            <FormInput label="Otras" name="otherConditions" value={formData.operatingConditions?.otherConditions} onChange={e => handleSectionChange('operatingConditions', e)} />
                        </div>
                    </Section>
                </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-lime-green-700">Guardar</button>
            </div>
        </form>
    );
};