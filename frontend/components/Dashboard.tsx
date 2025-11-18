
import React, { useState, useMemo } from 'react';
import { Equipment, Site, Service, Responsible } from '../types';
import { Modal } from './Modal';
import { EquipmentForm, emptyEquipment } from './EquipmentForm';
import { PlusCircle, Edit, Move, Trash2, Eye } from 'lucide-react';
import { DecommissionForm } from './DecommissionForm';
import { TransferForm } from './TransferForm';
import { EquipmentDetail } from './EquipmentDetail';

interface DashboardProps {
    equipments: Equipment[];
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
    onSaveEquipment: (equipment: Equipment) => void;
    onDecommission: (equipmentId: string, date: string, reason: string) => void;
    onTransfer: (equipmentId: string, newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string, signature: string) => void;
    searchQuery: string;
}

const StatusBadge: React.FC<{ status: Equipment['status'] }> = ({ status }) => {
    const baseClasses = "text-xs font-semibold inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline rounded-full";
    const statusClasses = {
        'Activo': "bg-green-100 text-green-800",
        'Inactivo': "bg-red-100 text-red-800",
        'Mantenimiento': "bg-yellow-100 text-yellow-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export const Dashboard: React.FC<DashboardProps> = ({ equipments, sites, services, responsibles, onSaveEquipment, onDecommission, onTransfer, searchQuery }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    const handleAddNew = () => {
        setSelectedEquipment(emptyEquipment);
        setIsFormModalOpen(true);
    };

    const handleEdit = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsFormModalOpen(true);
    };
    
    const handleOpenDecommission = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsDecommissionModalOpen(true);
    };

    const handleOpenTransfer = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsTransferModalOpen(true);
    };

    const handleViewDetails = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsDetailModalOpen(true);
    };

    const handleSave = (equipment: Equipment) => {
        onSaveEquipment(equipment);
        closeModal(setIsFormModalOpen);
    };

    const handleDecommissionSubmit = (date: string, reason: string) => {
        if (selectedEquipment) {
            onDecommission(selectedEquipment.id, date, reason);
            closeModal(setIsDecommissionModalOpen);
        }
    };

    const handleTransferSubmit = (newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string, signature: string) => {
        if (selectedEquipment) {
            onTransfer(selectedEquipment.id, newSiteId, newServiceId, newResponsibleId, justification, signature);
            closeModal(setIsTransferModalOpen);
        }
    };

    const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        modalSetter(false);
        setSelectedEquipment(null);
    };

    const filteredEquipments = useMemo(() => {
        if (!searchQuery) return equipments;
        const lowercasedQuery = searchQuery.toLowerCase();
        return equipments.filter(eq =>
            eq.name.toLowerCase().includes(lowercasedQuery) ||
            eq.brand.toLowerCase().includes(lowercasedQuery) ||
            eq.model.toLowerCase().includes(lowercasedQuery) ||
            eq.inventoryCode.toLowerCase().includes(lowercasedQuery)
        );
    }, [equipments, searchQuery]);


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard de Equipos</h1>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-lime-green-700 transition duration-300 shadow-sm"
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Registrar Equipo
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Inventario</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Equipo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca / Modelo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede / Servicio</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEquipments.length > 0 ? filteredEquipments.map(equipment => {
                            const siteName = sites.find(s => s.id === equipment.siteId)?.name || 'N/A';
                            const serviceName = services.find(s => s.id === equipment.serviceId)?.name || 'N/A';
                            const isInactive = equipment.status === 'Inactivo';

                            return (
                                <tr key={equipment.id} className={`transition-colors ${isInactive ? 'bg-slate-50 text-slate-500' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isInactive ? 'text-slate-500' : 'text-gray-900'}`}>{equipment.inventoryCode}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isInactive ? 'text-slate-500' : 'text-gray-700'}`}>{equipment.name}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isInactive ? 'text-slate-400' : 'text-gray-500'}`}>{equipment.brand} / {equipment.model}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isInactive ? 'text-slate-400' : 'text-gray-500'}`}>{siteName} / {serviceName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={equipment.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => handleViewDetails(equipment)} title="Ver detalles" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => handleEdit(equipment)} title="Editar" className="p-2 text-lime-blue-600 hover:bg-lime-blue-100 rounded-full transition-colors"><Edit className="h-4 w-4" /></button>
                                            <button 
                                                onClick={() => handleOpenTransfer(equipment)} 
                                                title="Trasladar" 
                                                disabled={isInactive}
                                                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                                <Move className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDecommission(equipment)} 
                                                title="Dar de baja" 
                                                disabled={isInactive}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">No se encontraron equipos que coincidan con la búsqueda.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && (
                <Modal title={selectedEquipment && selectedEquipment.id ? 'Editar Equipo' : 'Registrar Nuevo Equipo'} onClose={() => closeModal(setIsFormModalOpen)}>
                    <EquipmentForm 
                        equipment={selectedEquipment || emptyEquipment}
                        onSave={handleSave}
                        onCancel={() => closeModal(setIsFormModalOpen)}
                        sites={sites}
                        services={services}
                        responsibles={responsibles}
                    />
                </Modal>
            )}

            {isDecommissionModalOpen && selectedEquipment && (
                <Modal title={`Dar de baja a ${selectedEquipment.name}`} onClose={() => closeModal(setIsDecommissionModalOpen)}>
                    <DecommissionForm
                        equipmentName={selectedEquipment.name}
                        onConfirm={handleDecommissionSubmit}
                        onCancel={() => closeModal(setIsDecommissionModalOpen)}
                    />
                </Modal>
            )}

             {isTransferModalOpen && selectedEquipment && (
                <Modal title={`Trasladar ${selectedEquipment.name}`} onClose={() => closeModal(setIsTransferModalOpen)}>
                    <TransferForm
                        equipment={selectedEquipment}
                        sites={sites}
                        services={services}
                        responsibles={responsibles}
                        onConfirm={handleTransferSubmit}
                        onCancel={() => closeModal(setIsTransferModalOpen)}
                    />
                </Modal>
            )}
            
            {isDetailModalOpen && selectedEquipment && (
                <Modal title={`Detalles de ${selectedEquipment.name}`} onClose={() => closeModal(setIsDetailModalOpen)}>
                    <EquipmentDetail 
                        equipment={selectedEquipment}
                        sites={sites}
                        services={services}
                        responsibles={responsibles}
                    />
                </Modal>
            )}
        </div>
    );
};
