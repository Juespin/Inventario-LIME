import React, { useState, useMemo, useEffect } from 'react';
import { Equipment, Site, Service, Responsible, EquipmentFilters } from '../types';
import { Modal } from './Modal';
import { EquipmentForm, emptyEquipment } from './EquipmentForm';
import { PlusCircle, Edit, Move, Trash2, Eye } from 'lucide-react';
import { DecommissionForm } from './DecommissionForm';
import { TransferForm } from './TransferForm';
import { EquipmentDetail } from './EquipmentDetail';
import { Tooltip } from './Tooltip';
import { EmptyState } from './EmptyState';
import { Breadcrumbs } from './Breadcrumbs';
import { AdvancedFilters } from './AdvancedFilters';
import { applyFilters, getUniqueBrands } from '../utils/filters';

interface DashboardProps {
    equipments: Equipment[];
    sites: Site[];
    services: Service[];
    responsibles: Responsible[];
    onSaveEquipment: (equipment: Equipment) => void;
    onDecommission: (equipmentId: string, date: string, reason: string) => void;
    onTransfer: (equipmentId: string, newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string, signature: string) => void;
    // `delete` action intentionally removed from UI per request
    fetchEquipmentByBackendId?: (backendId: number) => Promise<Equipment>;
    searchQuery: string;
    filters: EquipmentFilters;
    onFiltersChange: (filters: EquipmentFilters) => void;
    onClearFilters: () => void;
    userData?: any;
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

export const Dashboard: React.FC<DashboardProps> = ({ equipments, sites, services, responsibles, onSaveEquipment, onDecommission, onTransfer, fetchEquipmentByBackendId, searchQuery, filters, onFiltersChange, onClearFilters, userData }) => {
    const isAdmin = userData?.role === 'admin';
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    const handleAddNew = () => {
        setSelectedEquipment(emptyEquipment);
        setIsFormModalOpen(true);
    };

    const [detailLoading, setDetailLoading] = useState(false);

    const handleEdit = async (equipment: Equipment) => {
        // open form immediately with current data, then fetch fresh details in background
        console.debug('handleEdit called for', equipment.id, 'backendId', (equipment as any).backendId);
        setSelectedEquipment(equipment);
        setIsFormModalOpen(true);

        if ((equipment as any)?.backendId && fetchEquipmentByBackendId) {
            setDetailLoading(true);
            try {
                const full = await fetchEquipmentByBackendId((equipment as any).backendId);
                setSelectedEquipment(full);
            } catch (err) {
                console.error('Failed to fetch equipment details for edit', err);
            } finally {
                setDetailLoading(false);
            }
        }
    };
    
    const handleOpenDecommission = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsDecommissionModalOpen(true);
    };

    const handleOpenTransfer = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsTransferModalOpen(true);
    };

    const handleViewDetails = async (equipment: Equipment) => {
        // open details immediately with current data, then fetch full details in background
        console.debug('handleViewDetails called for', equipment.id, 'backendId', (equipment as any).backendId);
        setSelectedEquipment(equipment);
        setIsDetailModalOpen(true);

        if ((equipment as any)?.backendId && fetchEquipmentByBackendId) {
            setDetailLoading(true);
            try {
                const full = await fetchEquipmentByBackendId((equipment as any).backendId);
                setSelectedEquipment(full);
            } catch (err) {
                console.error('Failed to fetch equipment details for view', err);
            } finally {
                setDetailLoading(false);
            }
        }
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

    // Obtener marcas únicas para el filtro
    const uniqueBrands = useMemo(() => getUniqueBrands(equipments), [equipments]);

    // Aplicar filtros y búsqueda
    const filteredEquipments = useMemo(() => {
        return applyFilters(equipments, filters, searchQuery);
    }, [equipments, filters, searchQuery]);

    // Estado para animación de resultados
    const [isFiltering, setIsFiltering] = useState(false);
    
    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => setIsFiltering(false), 300);
        return () => clearTimeout(timer);
    }, [filteredEquipments.length]);


    return (
        <div>
            <Breadcrumbs 
                items={[
                    { label: 'Dashboard', onClick: undefined }
                ]}
            />
            
            {/* Panel de Filtros Avanzados */}
            <AdvancedFilters
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearFilters={onClearFilters}
                sites={sites}
                services={services}
                responsibles={responsibles}
                brands={uniqueBrands}
                resultCount={filteredEquipments.length}
                totalCount={equipments.length}
            />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Dashboard de Equipos</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Gestiona y administra tu inventario de equipos médicos</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={handleAddNew}
                        aria-label="Registrar nuevo equipo"
                        className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                        <span className="hidden sm:inline">Registrar Equipo</span>
                        <span className="sm:hidden">Registrar</span>
                    </button>
                )}
            </div>

            {/* Vista de tabla para desktop */}
            <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-50 to-blue-50/50">
                            <tr>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marca / Modelo</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Serie</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Código IPS</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Código Inventario</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Registro Invima</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Riesgo</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sede / Servicio</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={`bg-white divide-y divide-gray-100 transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
                            {filteredEquipments.length > 0 ? filteredEquipments.map((equipment, index) => {
                                const siteName = sites.find(s => s.id === equipment.siteId)?.name || 'N/A';
                                const serviceName = services.find(s => s.id === equipment.serviceId)?.name || 'N/A';
                                const isInactive = equipment.status === 'Inactivo';

                                return (
                                    <tr 
                                        key={equipment.id} 
                                        className={`transition-all duration-150 animate-fade-in ${isInactive ? 'bg-gray-50/50 text-gray-400' : 'hover:bg-blue-50/50 hover:shadow-sm'}`}
                                        style={{ animationDelay: `${index * 0.03}s` }}
                                    >
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium ${isInactive ? 'text-gray-400' : 'text-gray-800'}`}>{equipment.name}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{equipment.brand} / {equipment.model}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{equipment.serial}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{equipment.generalInfo?.ipsCode || 'N/A'}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-semibold ${isInactive ? 'text-gray-400' : 'text-gray-900'}`}>{equipment.inventoryCode}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{equipment.invimaRecord || equipment.generalInfo?.invimaRecord || 'N/A'}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{equipment.riskClassification || equipment.generalInfo?.riskClassification || 'N/A'}</td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm ${isInactive ? 'text-gray-300' : 'text-gray-600'}`}>{siteName} / {serviceName}</td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <StatusBadge status={equipment.status} />
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-1" role="group" aria-label={`Acciones para ${equipment.name}`}>
                                                <Tooltip text="Ver detalles">
                                                    <button 
                                                        onClick={() => handleViewDetails(equipment)} 
                                                        aria-label={`Ver detalles de ${equipment.name}`}
                                                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                        <Eye className="h-4 w-4" aria-hidden="true" />
                                                    </button>
                                                </Tooltip>
                                                {isAdmin && (
                                                    <>
                                                        <Tooltip text="Editar equipo">
                                                            <button 
                                                                onClick={() => handleEdit(equipment)} 
                                                                aria-label={`Editar ${equipment.name}`}
                                                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                                <Edit className="h-4 w-4" aria-hidden="true" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text={isInactive ? "Equipo inactivo, no se puede trasladar" : "Trasladar equipo"}>
                                                            <button 
                                                                onClick={() => handleOpenTransfer(equipment)} 
                                                                aria-label={`Trasladar ${equipment.name}`}
                                                                disabled={isInactive}
                                                                aria-disabled={isInactive}
                                                                className="p-1.5 sm:p-2 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all duration-200 hover:scale-110 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:focus:ring-gray-400">
                                                                <Move className="h-4 w-4" aria-hidden="true" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip text={isInactive ? "Equipo ya está dado de baja" : "Dar de baja equipo"}>
                                                            <button 
                                                                onClick={() => handleOpenDecommission(equipment)} 
                                                                aria-label={`Dar de baja ${equipment.name}`}
                                                                disabled={isInactive}
                                                                aria-disabled={isInactive}
                                                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-110 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:focus:ring-gray-400">
                                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                            </button>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                {/* Delete action removed per UX request */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={8} className="p-0">
                                        <div className={`p-8 transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
                                            <EmptyState 
                                                type="search"
                                                action={searchQuery || !isAdmin ? undefined : {
                                                    label: 'Registrar Primer Equipo',
                                                    onClick: handleAddNew
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vista de tarjetas para móvil */}
            <div className={`md:hidden space-y-4 transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
                {filteredEquipments.length > 0 ? filteredEquipments.map((equipment, index) => {
                    const siteName = sites.find(s => s.id === equipment.siteId)?.name || 'N/A';
                    const serviceName = services.find(s => s.id === equipment.serviceId)?.name || 'N/A';
                    const isInactive = equipment.status === 'Inactivo';

                    return (
                        <div 
                            key={equipment.id}
                            className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 animate-fade-in ${isInactive ? 'opacity-60' : ''}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold ${isInactive ? 'text-gray-400' : 'text-gray-900'} mb-1`}>{equipment.name}</h3>
                                    <p className="text-xs text-gray-500">{equipment.brand} / {equipment.model}</p>
                                </div>
                                <StatusBadge status={equipment.status} />
                            </div>
                            
                            <div className="space-y-2 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Serie: </span>
                                    <span className={isInactive ? 'text-gray-400' : 'text-gray-800'}>{equipment.serial || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Código IPS: </span>
                                    <span className={isInactive ? 'text-gray-400' : 'text-gray-800'}>{equipment.generalInfo?.ipsCode || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Código Inventario: </span>
                                    <span className={isInactive ? 'text-gray-400' : 'text-gray-800'}>{equipment.inventoryCode || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Ubicación: </span>
                                    <span className={isInactive ? 'text-gray-400' : 'text-gray-800'}>{siteName} / {serviceName}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200" role="group" aria-label={`Acciones para ${equipment.name}`}>
                                <button 
                                    onClick={() => handleViewDetails(equipment)} 
                                    aria-label={`Ver detalles de ${equipment.name}`}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {isAdmin && (
                                    <>
                                        <button 
                                            onClick={() => handleEdit(equipment)} 
                                            aria-label={`Editar ${equipment.name}`}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                            <Edit className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button 
                                            onClick={() => handleOpenTransfer(equipment)} 
                                            aria-label={`Trasladar ${equipment.name}`}
                                            disabled={isInactive}
                                            aria-disabled={isInactive}
                                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:focus:ring-gray-400">
                                            <Move className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button 
                                            onClick={() => handleOpenDecommission(equipment)} 
                                            aria-label={`Dar de baja ${equipment.name}`}
                                            disabled={isInactive}
                                            aria-disabled={isInactive}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:focus:ring-gray-400">
                                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </>
                                )}
                                {/* Delete action removed from mobile card */}
                            </div>
                        </div>
                    );
                }) : (
                    <div className={`transition-opacity duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
                        <EmptyState 
                            type={equipments.length === 0 ? "empty" : "search"}
                            action={equipments.length === 0 && isAdmin ? {
                                label: 'Registrar Primer Equipo',
                                onClick: handleAddNew
                            } : undefined}
                        />
                    </div>
                )}
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
                    {detailLoading && <div className="p-3 text-sm text-gray-500">Cargando detalles...</div>}
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
