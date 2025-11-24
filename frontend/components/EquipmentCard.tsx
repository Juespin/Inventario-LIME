
import React, { useState } from 'react';
import { Equipment, Site, Service, Responsible } from '../types';
import { Edit, Move, Trash2, MapPin, Briefcase, User, ChevronDown } from 'lucide-react';
import { Modal } from './Modal';
import { DecommissionForm } from './DecommissionForm';
import { TransferForm } from './TransferForm';

interface EquipmentCardProps {
    equipment: Equipment;
    siteName: string;
    serviceName: string;
    onEdit: (equipment: Equipment) => void;
    onDecommission: (equipmentId: string, date: string, reason: string) => void;
    onTransfer: (equipmentId: string, newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string) => void;
    onDelete?: (equipmentId: string) => void;
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
}

const StatusBadge: React.FC<{ status: Equipment['status'] }> = ({ status }) => {
    const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full";
    const statusClasses = {
        'Activo': "bg-green-100 text-green-800",
        'Inactivo': "bg-red-100 text-red-800",
        'Mantenimiento': "bg-yellow-100 text-yellow-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, siteName, serviceName, onEdit, onDecommission, onTransfer, sites, services, responsibles }) => {
    const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const responsible = responsibles.find(r => r.id === equipment.responsibleId);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{equipment.name}</h3>
                    <StatusBadge status={equipment.status} />
                </div>
                <p className="text-sm text-gray-500">{equipment.brand} - {equipment.model}</p>
                <p className="text-xs text-gray-400 mt-1 mb-3">Código: {equipment.inventoryCode}</p>

                <div className="space-y-2 text-sm text-gray-600 flex-grow">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{siteName}</span>
                    </div>
                    <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{serviceName}</span>
                    </div>
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{responsible?.name || 'No asignado'}</span>
                    </div>
                </div>

                <div className="border-t mt-4 pt-3 flex justify-between items-center">
                    <button onClick={() => onEdit(equipment)} className="text-sm text-blue-600 hover:underline">Ver más</button>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <ul className="py-1">
                                    <li><button onClick={() => { onEdit(equipment); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><Edit className="w-4 h-4 mr-2"/> Editar</button></li>
                                    <li><button onClick={() => { setIsTransferModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><Move className="w-4 h-4 mr-2"/> Trasladar</button></li>
                                    <li><button onClick={() => { setIsDecommissionModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"><Trash2 className="w-4 h-4 mr-2"/> Dar de baja</button></li>
                                    <li><button onClick={() => { if (onDelete && confirm(`¿Eliminar permanentemente ${equipment.name}?`)) { onDelete(equipment.id); } setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 flex items-center">Eliminar</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isDecommissionModalOpen && (
                <Modal title={`Dar de baja a ${equipment.name}`} onClose={() => setIsDecommissionModalOpen(false)}>
                    <DecommissionForm
                        equipmentName={equipment.name}
                        onConfirm={(date, reason) => {
                            onDecommission(equipment.id, date, reason);
                            setIsDecommissionModalOpen(false);
                        }}
                        onCancel={() => setIsDecommissionModalOpen(false)}
                    />
                </Modal>
            )}
             {isTransferModalOpen && (
                <Modal title={`Trasladar ${equipment.name}`} onClose={() => setIsTransferModalOpen(false)}>
                    <TransferForm
                        equipment={equipment}
                        sites={sites}
                        services={services}
                        responsibles={responsibles}
                        onConfirm={(newSiteId, newServiceId, newResponsibleId, justification) => {
                            onTransfer(equipment.id, newSiteId, newServiceId, newResponsibleId, justification);
                            setIsTransferModalOpen(false);
                        }}
                        onCancel={() => setIsTransferModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};
