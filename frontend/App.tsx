
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { MaintenanceCalendar } from './components/MaintenanceCalendar';
import { Equipment, Site, Service, Responsible, View, EquipmentFilters } from './types';
import { mockEquipments, mockSites, mockServices, mockResponsibles } from './data/mockData';
import api from './src/services/api';
import { Header } from './components/Header';
import { ToastContainer, useToast } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';
import { getFiltersFromUrl, updateUrlWithFilters } from './utils/urlFilters';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [responsibles, setResponsibles] = useState<Responsible[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<EquipmentFilters>(() => {
        // Cargar filtros de la URL al inicializar
        if (typeof window !== 'undefined') {
            return getFiltersFromUrl();
        }
        return {};
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    // Actualizar URL cuando cambien los filtros
    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateUrlWithFilters(filters, true);
        }
    }, [filters]);

    // Escuchar cambios en la URL (navegación del navegador)
    useEffect(() => {
        const handlePopState = () => {
            const urlFilters = getFiltersFromUrl();
            setFilters(urlFilters);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Cargar datos desde el backend al iniciar (fallback a mocks si falla)
    useEffect(() => {
        let mounted = true;
        async function loadData() {
            try {
                const results = await Promise.allSettled([
                    api.get('/api/equipos/'),
                    api.get('/api/sedes/'),
                    api.get('/api/responsables/'),
                    api.get('/api/servicios/'),
                ]);

                if (!mounted) return;

                // Equipos
                if (results[0].status === 'fulfilled') setEquipments((results[0].value).data || []);
                else setEquipments(mockEquipments);

                // Sedes
                if (results[1].status === 'fulfilled') setSites((results[1].value).data || []);
                else setSites(mockSites);

                // Responsables
                if (results[2].status === 'fulfilled') setResponsibles((results[2].value).data || []);
                else setResponsibles(mockResponsibles);

                // Servicios (puede no estar registrado en el router; fallback a mocks)
                if (results[3] && results[3].status === 'fulfilled') setServices((results[3].value).data || []);
                else setServices(mockServices);
            } catch (err) {
                console.error('Error cargando datos desde API:', err);
                if (mounted) {
                    setEquipments(mockEquipments);
                    setSites(mockSites);
                    setServices(mockServices);
                    setResponsibles(mockResponsibles);
                }
            } finally {
                if (mounted) setLoadingData(false);
            }
        }

        loadData();
        return () => { mounted = false; };
    }, []);

    const handleSaveEquipment = (equipmentToSave: Equipment) => {
        const isNew = !equipmentToSave.id;
        if (isNew) {
            const newEquipment = { ...equipmentToSave, id: `EQ-${Date.now()}` };
            setEquipments(prev => [newEquipment, ...prev]);
            showToast(`Equipo "${equipmentToSave.name}" registrado exitosamente`, 'success');
        } else {
            setEquipments(prev => prev.map(eq => eq.id === equipmentToSave.id ? equipmentToSave : eq));
            showToast(`Equipo "${equipmentToSave.name}" actualizado exitosamente`, 'success');
        }
    };

    const handleDecommission = (equipmentId: string, date: string, reason: string) => {
        const equipment = equipments.find(eq => eq.id === equipmentId);
        setEquipments(prev => prev.map(eq => 
            eq.id === equipmentId 
                ? { ...eq, status: 'Inactivo', decommissionInfo: { date, reason } }
                : eq
        ));
        if (equipment) {
            showToast(`Equipo "${equipment.name}" dado de baja correctamente`, 'warning');
        }
    };

    const handleTransfer = (equipmentId: string, newSiteId: number, newServiceId: number, newResponsibleId: number, justification: string, signature: string) => {
         setEquipments(prev => prev.map(eq => 
            eq.id === equipmentId 
                ? { ...eq, siteId: newSiteId, serviceId: newServiceId, responsibleId: newResponsibleId, transferHistory: [...(eq.transferHistory || []), {
                    fromSiteId: eq.siteId,
                    fromServiceId: eq.serviceId,
                    toSiteId: newSiteId,
                    toServiceId: newServiceId,
                    responsibleId: newResponsibleId,
                    date: new Date().toISOString().split('T')[0],
                    justification: justification,
                    signature: signature
                }] }
                : eq
        ));
    };

    const addSite = useCallback((name: string) => {
        setSites(prev => [...prev, { id: prev.length + 1, name }]);
    }, []);

    const addService = useCallback((name: string, siteId: number) => {
        setServices(prev => [...prev, { id: prev.length + 1, name, siteId }]);
    }, []);

    const addResponsible = useCallback((name: string, role: string) => {
        setResponsibles(prev => [...prev, { id: prev.length + 1, name, role }]);
    }, []);


    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            equipments={equipments}
                            sites={sites}
                            services={services}
                            responsibles={responsibles}
                            onSaveEquipment={handleSaveEquipment}
                            onDecommission={handleDecommission}
                            onTransfer={handleTransfer}
                            searchQuery={searchQuery}
                            filters={filters}
                            onFiltersChange={setFilters}
                            onClearFilters={() => setFilters({})}
                        />;
            case 'administration':
                return <AdminPanel 
                            sites={sites} 
                            services={services} 
                            responsibles={responsibles}
                            onAddSite={addSite}
                            onAddService={addService}
                            onAddResponsible={addResponsible}
                        />;
            case 'maintenance-calendar':
                return <MaintenanceCalendar 
                            equipments={equipments}
                            sites={sites}
                            services={services}
                            responsibles={responsibles}
                        />;
            default:
                return <Dashboard 
                            equipments={equipments}
                            sites={sites}
                            services={services}
                            responsibles={responsibles}
                            onSaveEquipment={handleSaveEquipment}
                            onDecommission={handleDecommission}
                            onTransfer={handleTransfer}
                            searchQuery={searchQuery}
                        />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800">
            <Sidebar 
                currentView={view} 
                setView={setView} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 w-full lg:w-auto">
                {/* DEBUG: barra visible para confirmar montaje y estado de datos */}
                <div className="w-full text-center text-xs bg-yellow-50 border-b border-yellow-200 text-yellow-800 py-1">{loadingData ? 'Cargando datos...' : `Equipos cargados: ${equipments.length}`}</div>
                <Header 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main 
                    id="main-content"
                    className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6 xl:p-8"
                    role="main"
                    aria-label="Contenido principal"
                    tabIndex={-1}
                >
                   {renderView()}
                </main>
            </div>
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <ScrollToTop />
        </div>
    );
};

export default App;
