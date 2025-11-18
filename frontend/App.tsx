
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Equipment, Site, Service, Responsible, View } from './types';
import { mockEquipments, mockSites, mockServices, mockResponsibles } from './data/mockData';
import { Header } from './components/Header';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
    const [sites, setSites] = useState<Site[]>(mockSites);
    const [services, setServices] = useState<Service[]>(mockServices);
    const [responsibles, setResponsibles] = useState<Responsible[]>(mockResponsibles);
    
    const [searchQuery, setSearchQuery] = useState('');

    const handleSaveEquipment = (equipmentToSave: Equipment) => {
        const isNew = !equipmentToSave.id;
        if (isNew) {
            const newEquipment = { ...equipmentToSave, id: `EQ-${Date.now()}` };
            setEquipments(prev => [newEquipment, ...prev]);
        } else {
            setEquipments(prev => prev.map(eq => eq.id === equipmentToSave.id ? equipmentToSave : eq));
        }
    };

    const handleDecommission = (equipmentId: string, date: string, reason: string) => {
        setEquipments(prev => prev.map(eq => 
            eq.id === equipmentId 
                ? { ...eq, status: 'Inactivo', decommissionInfo: { date, reason } }
                : eq
        ));
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
            <Sidebar currentView={view} setView={setView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
                   {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;
