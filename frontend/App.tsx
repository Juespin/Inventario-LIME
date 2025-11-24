
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

                // Equipos - map backend fields to frontend Equipment shape
                if (results[0].status === 'fulfilled') {
                    const backendEquipments = (results[0].value).data || [];
                    const mapped = backendEquipments.map((e: any) => ({
                        // use inventory_code as stable string id when available, fallback to numeric id
                        id: e.inventory_code ? String(e.inventory_code) : String(e.id),
                        // preserve backend numeric PK for updates/deletes
                        backendId: e.id || null,
                        name: e.name || '',
                        brand: e.brand || '',
                        model: e.model || '',
                        serial: e.serial || '',
                        inventoryCode: e.inventory_code || e.ips_code || '',
                        status: e.status || 'Activo',
                        siteId: e.site || e.site_id || 0,
                        serviceId: e.service || e.service_id || 0,
                        responsibleId: e.responsible || e.responsible_id || 0,
                        // placeholder image when backend doesn't provide one
                        imageUrl: e.image_url || `https://picsum.photos/seed/${encodeURIComponent(e.inventory_code || e.name || e.id)}/400/300`,
                        documents: [],
                        generalInfo: {},
                        historicalRecord: {},
                        operatingConditions: {},
                        decommissionInfo: undefined,
                        transferHistory: [],
                    }));
                    setEquipments(mapped);
                }
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

    const mapFrontendToBackend = (eq: Equipment) => ({
        inventory_code: eq.inventoryCode || undefined,
        name: eq.name || '',
        brand: eq.brand || '',
        model: eq.model || '',
        serial: eq.serial || '',
        status: eq.status || 'Activo',
        site: eq.siteId || null,
        service: eq.serviceId || null,
        ips_code: eq.generalInfo?.ipsCode || '',
        ecri_code: eq.generalInfo?.ecriCode || '',
        responsible: eq.responsibleId || null,
        physical_location: eq.generalInfo?.physicalLocation || '',
        misional_classification: Array.isArray(eq.generalInfo?.misionalClassification) ? (eq.generalInfo?.misionalClassification || []).join(', ') : eq.generalInfo?.misionalClassification || '',
        ips_classification: eq.generalInfo?.ipsClassification || '',
        risk_classification: eq.generalInfo?.riskClassification || '',
        invima_record: eq.generalInfo?.invimaRecord || '',
        useful_life: eq.historicalRecord?.usefulLife || null,
        acquisition_date: eq.historicalRecord?.acquisitionDate || null,
        owner: eq.historicalRecord?.owner || '',
        fabrication_date: eq.historicalRecord?.fabricationDate || null,
        nit: eq.historicalRecord?.nit || '',
        provider: eq.historicalRecord?.provider || '',
        in_warranty: !!eq.historicalRecord?.inWarranty,
        warranty_end_date: eq.historicalRecord?.warrantyEndDate || null,
        acquisition_method: eq.historicalRecord?.acquisitionMethod || '',
        document_type: eq.historicalRecord?.documentType || '',
        document_number: eq.historicalRecord?.documentNumber || '',
        maintenance_required: !!eq.metrologicalAdminInfo?.maintenance,
        maintenance_frequency: eq.metrologicalAdminInfo?.maintenanceFrequency || null,
        calibration_required: !!eq.metrologicalAdminInfo?.calibration,
        calibration_frequency: eq.metrologicalAdminInfo?.calibrationFrequency || null,
        magnitude: eq.metrologicalTechnicalInfo?.magnitude || '',
        measurement_range: (eq.metrologicalTechnicalInfo?.equipmentRangeMin || '') && (eq.metrologicalTechnicalInfo?.equipmentRangeMax || '') ? `${eq.metrologicalTechnicalInfo?.equipmentRangeMin}-${eq.metrologicalTechnicalInfo?.equipmentRangeMax}` : (eq.metrologicalTechnicalInfo?.equipmentRangeMin || eq.metrologicalTechnicalInfo?.equipmentRangeMax || ''),
        resolution: eq.metrologicalTechnicalInfo?.resolution || '',
        work_range: (eq.metrologicalTechnicalInfo?.workRangeMin || '') && (eq.metrologicalTechnicalInfo?.workRangeMax || '') ? `${eq.metrologicalTechnicalInfo?.workRangeMin}-${eq.metrologicalTechnicalInfo?.workRangeMax}` : (eq.metrologicalTechnicalInfo?.workRangeMin || eq.metrologicalTechnicalInfo?.workRangeMax || ''),
        max_permitted_error: eq.metrologicalTechnicalInfo?.maxPermittedError || '',
        voltage: eq.operatingConditions?.voltage || '',
        current: eq.operatingConditions?.current || '',
        relative_humidity: eq.operatingConditions?.relativeHumidity || '',
        operating_temperature: eq.operatingConditions?.temperature || '',
        dimensions: eq.operatingConditions?.dimensions || '',
        weight: eq.operatingConditions?.weight || '',
        others: eq.operatingConditions?.otherConditions || '',
    });

    const handleSaveEquipment = async (equipmentToSave: Equipment) => {
        try {
            // prepare payload for backend
            const payload = mapFrontendToBackend(equipmentToSave);

            if ((equipmentToSave as any).backendId) {
                // update existing (use PATCH to allow partial updates)
                const backendId = (equipmentToSave as any).backendId;
                // remove empty values so we don't overwrite existing DB columns with blank strings
                const cleaned: any = {};
                Object.entries(payload).forEach(([k, v]) => {
                    // keep booleans and numbers (including 0), keep non-empty arrays/strings
                    if (v === false || v === true) cleaned[k] = v;
                    else if (typeof v === 'number') cleaned[k] = v;
                    else if (Array.isArray(v) && v.length > 0) cleaned[k] = v;
                    else if (v !== undefined && v !== null && String(v).trim() !== '') cleaned[k] = v;
                });

                const res = await api.patch(`/api/equipos/${backendId}/`, cleaned);
                // map returned object into frontend shape
                const updated = mapBackendToFrontend(res.data);
                setEquipments(prev => prev.map(eq => ((eq as any).backendId === backendId ? updated : eq)));
                showToast(`Equipo "${updated.name}" actualizado exitosamente`, 'success');
            } else {
                // create new
                const res = await api.post('/api/equipos/', payload);
                const created = mapBackendToFrontend(res.data);
                setEquipments(prev => [created, ...prev]);
                showToast(`Equipo "${created.name}" registrado exitosamente`, 'success');
            }
        } catch (err: any) {
            console.error('Error saving equipment', err);
            showToast(`Error al guardar equipo: ${err?.message || err}`, 'error');
        }
    };

    const handleDecommission = async (equipmentId: string, date: string, reason: string) => {
        const equipment = equipments.find(eq => eq.id === equipmentId);
        try {
            if ((equipment as any)?.backendId) {
                await api.patch(`/api/equipos/${(equipment as any).backendId}/`, { status: 'Inactivo' });
            }
            setEquipments(prev => prev.map(eq => 
                eq.id === equipmentId 
                    ? { ...eq, status: 'Inactivo', decommissionInfo: { date, reason } }
                    : eq
            ));
            if (equipment) showToast(`Equipo "${equipment.name}" dado de baja correctamente`, 'warning');
        } catch (err: any) {
            console.error('Error decommissioning', err);
            showToast(`Error al dar de baja: ${err?.message || err}`, 'error');
        }
    };

    const handleDeleteEquipment = async (equipmentId: string) => {
        const equipment = equipments.find(eq => eq.id === equipmentId);
        if (!equipment) return;
        if (!confirm(`¿Eliminar permanentemente ${equipment.name}? Esta acción no se puede deshacer.`)) return;

        try {
            if ((equipment as any)?.backendId) {
                await api.delete(`/api/equipos/${(equipment as any).backendId}/`);
            }
            setEquipments(prev => prev.filter(eq => eq.id !== equipmentId));
            showToast(`Equipo "${equipment.name}" eliminado correctamente`, 'success');
        } catch (err: any) {
            console.error('Delete error', err);
            showToast(`Error eliminando equipo: ${err?.message || err}`, 'error');
        }
    };

    // helper to map backend object -> frontend equipment shape
    const mapBackendToFrontend = (e: any): Equipment => ({
        id: e.inventory_code ? String(e.inventory_code) : String(e.id),
        backendId: e.id || null,
        name: e.name || '',
        brand: e.brand || '',
        model: e.model || '',
        serial: e.serial || '',
        inventoryCode: e.inventory_code || e.ips_code || '',
        status: e.status || 'Activo',
        siteId: e.site || e.site_id || 0,
        serviceId: e.service || e.service_id || 0,
        responsibleId: e.responsible || e.responsible_id || 0,
        imageUrl: e.image_url || `https://picsum.photos/seed/${encodeURIComponent(e.inventory_code || e.name || e.id)}/400/300`,
        documents: [],
        generalInfo: {
            ipsCode: e.ips_code || '',
            ecriCode: e.ecri_code || '',
            physicalLocation: e.physical_location || '',
            misionalClassification: e.misional_classification ? e.misional_classification.split(/,\s*/g) : [],
            ipsClassification: e.ips_classification || '',
            riskClassification: e.risk_classification || '',
            invimaRecord: e.invima_record || '',
        },
        historicalRecord: {
            usefulLife: e.useful_life || undefined,
            acquisitionDate: e.acquisition_date || undefined,
            owner: e.owner || undefined,
            fabricationDate: e.fabrication_date || undefined,
            provider: e.provider || undefined,
            nit: e.nit || undefined,
            inWarranty: !!e.in_warranty,
            warrantyEndDate: e.warranty_end_date || undefined,
            acquisitionMethod: e.acquisition_method || undefined,
            documentType: e.document_type || undefined,
            documentNumber: e.document_number || undefined,
            log: e.log || [],
        },
        metrologicalAdminInfo: {
            maintenance: !!e.maintenance_required,
            maintenanceFrequency: e.maintenance_frequency || undefined,
            lastMaintenanceDate: e.last_maintenance_date || undefined,
            // backend uses english names after normalization
            calibration: !!(e.calibration_required ?? e.calibracion),
            calibrationFrequency: (e.calibration_frequency ?? e.frecuencia_calibracion) || undefined,
            lastCalibrationDate: e.last_calibration_date || undefined,
        },
        metrologicalTechnicalInfo: (() => {
            const mt = {
                magnitude: e.magnitude || '',
                equipmentRangeMin: undefined as number | undefined,
                equipmentRangeMax: undefined as number | undefined,
                resolution: e.resolucion || '',
                workRangeMin: undefined as number | undefined,
                workRangeMax: undefined as number | undefined,
                maxPermittedError: e.max_permitted_error || '',
            };

            // Try parse measurement_range into min/max numbers (e.g. "0-5 mV")
            const meas = e.measurement_range || e.measurementRange || '';
            if (meas) {
                const nums = (meas.match(/-?\d+(?:\.\d+)*/g) || []).map(n => Number(n));
                if (nums.length >= 2) {
                    mt.equipmentRangeMin = nums[0];
                    mt.equipmentRangeMax = nums[1];
                }
            }

            // Try parse work_range into min/max numbers
            const work = e.work_range || e.workRange || '';
            if (work) {
                const nums = (work.match(/-?\d+(?:\.\d+)*/g) || []).map(n => Number(n));
                if (nums.length >= 2) {
                    mt.workRangeMin = nums[0];
                    mt.workRangeMax = nums[1];
                }
            }

            return mt;
        })(),
        operatingConditions: {
            voltage: e.voltage || '',
            current: e.current || '',
            relativeHumidity: e.relative_humidity || '',
            temperature: e.operating_temperature || '',
            dimensions: e.dimensions || '',
            weight: e.weight || '',
            otherConditions: e.others || '',
        },
        decommissionInfo: undefined,
        transferHistory: [],
    });

    // helper: fetch single equipment from backend and map it into frontend shape
    const fetchEquipmentByBackendId = async (backendId: number) => {
        const res = await api.get(`/api/equipos/${backendId}/`);
        return mapBackendToFrontend(res.data);
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

    const addSite = useCallback(async (name: string) => {
        try {
            const res = await api.post('/api/sedes/', { name });
            const created = res.data;
            // ensure created shape matches frontend Site
            const site = { id: created.id, name: created.name } as Site;
            setSites(prev => [site, ...prev]);
            showToast(`Sede "${site.name}" creada correctamente`, 'success');
            return site;
        } catch (err: any) {
            console.error('Error creating site', err);
            showToast(`Error creando sede: ${err?.message || err}`, 'error');
            throw err;
        }
    }, [showToast]);

    const addService = useCallback(async (name: string, siteId: number) => {
        try {
            const res = await api.post('/api/servicios/', { name, siteId });
            const created = res.data;
            const service = { id: created.id, name: created.name, siteId: created.siteId } as Service;
            setServices(prev => [service, ...prev]);
            showToast(`Servicio "${service.name}" creado correctamente`, 'success');
            return service;
        } catch (err: any) {
            console.error('Error creating service', err);
            showToast(`Error creando servicio: ${err?.message || err}`, 'error');
            throw err;
        }
    }, [showToast]);

    const addResponsible = useCallback(async (name: string, role: string) => {
        try {
            const res = await api.post('/api/responsables/', { name, role });
            const created = res.data;
            const responsible = { id: created.id, name: created.name, role: created.role } as Responsible;
            setResponsibles(prev => [responsible, ...prev]);
            showToast(`Responsable "${responsible.name}" creado correctamente`, 'success');
            return responsible;
        } catch (err: any) {
            console.error('Error creating responsable', err);
            showToast(`Error creando responsable: ${err?.message || err}`, 'error');
            throw err;
        }
    }, [showToast]);


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
                            fetchEquipmentByBackendId={fetchEquipmentByBackendId}
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
