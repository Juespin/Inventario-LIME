import React, { useState, useEffect } from 'react';
import { Equipment, Site, Service, Responsible } from '../types';
import { PdfPreview } from './PdfPreview';

interface TransferFormProps {
    equipment: Equipment;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
    onConfirm: (newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string, signature: string) => void;
    onCancel: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({ equipment, sites, services, responsibles, onConfirm, onCancel }) => {
    const [newSiteId, setNewSiteId] = useState<number>(0);
    const [newServiceId, setNewServiceId] = useState<number>(0);
    const [newResponsibleId, setNewResponsibleId] = useState<number>(0);
    const [justification, setJustification] = useState('');
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [showPdf, setShowPdf] = useState(false);

    const siteOrigin = sites.find(s => s.id === equipment.siteId)?.name || 'N/A';
    const serviceOrigin = services.find(s => s.id === equipment.serviceId)?.name || 'N/A';
    
    useEffect(() => {
        if (newSiteId) {
            setFilteredServices(services.filter(s => s.siteId === newSiteId));
            setNewServiceId(0);
        } else {
            setFilteredServices([]);
        }
    }, [newSiteId, services]);

    const handleGeneratePdf = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSiteId && newServiceId && newResponsibleId && justification) {
            setShowPdf(true);
        }
    };

    const selectedResponsible = responsibles.find(r => r.id === newResponsibleId);

    if (showPdf) {
        return <PdfPreview 
            equipment={equipment}
            originSite={siteOrigin}
            originService={serviceOrigin}
            destinationSite={sites.find(s => s.id === newSiteId)?.name || 'N/A'}
            destinationService={services.find(s => s.id === newServiceId)?.name || 'N/A'}
            responsible={selectedResponsible?.name || 'N/A'}
            responsibleRole={selectedResponsible?.role}
            justification={justification}
            sites={sites}
            services={services}
            responsibles={responsibles}
            onConfirm={(signature) => onConfirm(newSiteId, newServiceId, newResponsibleId, justification, signature)}
            onBack={() => setShowPdf(false)}
        />
    }

    return (
        <form onSubmit={handleGeneratePdf} className="space-y-4">
            <div>
                <h4 className="font-semibold">Ubicación Actual</h4>
                <p className="text-sm text-gray-600">Sede: {siteOrigin}</p>
                <p className="text-sm text-gray-600">Servicio: {serviceOrigin}</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Sede</label>
                <select value={newSiteId} onChange={(e) => setNewSiteId(parseInt(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required>
                    <option value={0}>Seleccione una sede</option>
                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nuevo Servicio</label>
                <select value={newServiceId} onChange={(e) => setNewServiceId(parseInt(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={!newSiteId}>
                    <option value={0}>Seleccione un servicio</option>
                    {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Nuevo Responsable</label>
                <select value={newResponsibleId} onChange={(e) => setNewResponsibleId(parseInt(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required>
                    <option value={0}>Seleccione un responsable</option>
                    {responsibles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Justificación</label>
                <textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button 
                    type="button" 
                    onClick={onCancel}
                    aria-label="Cancelar traslado de equipo"
                    className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    aria-label="Generar PDF y confirmar traslado del equipo"
                    className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};
