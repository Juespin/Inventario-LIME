import React, { useState } from 'react';
import { Site, Service, Responsible } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { Edit, Trash2 } from 'lucide-react';
import api from '../src/services/api';

type AdminTab = 'sites' | 'services' | 'responsibles';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 ${
      isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

const SiteManager: React.FC<{ sites: Site[]; onAdd: (name: string) => Promise<any> | void; onEdit: (id: number, name: string) => Promise<any> | void; onDelete: (id: number) => Promise<any> | void; isAdmin: boolean }> = ({ sites, onAdd, onEdit, onDelete, isAdmin }) => {
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    return (
        <div>
            {isAdmin && (
                <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onAdd(name); setName(''); } finally { setSubmitting(false); } }} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la nueva sede" className="p-3 border border-gray-300 rounded-lg flex-grow bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" required/>
                    <button 
                        type="submit" 
                        aria-label="Agregar nuevo elemento"
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={submitting}
                    >
                        Agregar
                    </button>
                </form>
            )}
            <ul className="space-y-2">
                {sites.map(s => (
                    <li key={s.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors font-medium flex justify-between items-center">
                        {editId === s.id ? (
                            <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onEdit(s.id, editName); setEditId(null); } finally { setSubmitting(false); } }} className="flex gap-2 w-full">
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="p-2 border border-gray-300 rounded flex-grow" required />
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
                                <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                            </form>
                        ) : (
                            <>
                                <span>{s.name}</span>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditId(s.id); setEditName(s.name); }} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ServiceManager: React.FC<{ services: Service[]; sites: Site[]; onAdd: (name: string, siteId: number) => Promise<any> | void; onEdit: (id: number, name: string, siteId: number) => Promise<any> | void; onDelete: (id: number) => Promise<any> | void; isAdmin: boolean }> = ({ services, sites, onAdd, onEdit, onDelete, isAdmin }) => {
    const [name, setName] = useState('');
    const [siteId, setSiteId] = useState<number>(0);
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editSiteId, setEditSiteId] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    return (
        <div>
            {isAdmin && (
                <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onAdd(name, siteId); setName(''); setSiteId(0); } finally { setSubmitting(false); } }} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del nuevo servicio" className="p-3 border border-gray-300 rounded-lg flex-grow bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" required/>
                    <select value={siteId} onChange={e => setSiteId(parseInt(e.target.value))} className="p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" required>
                        <option value={0}>Seleccione Sede</option>
                        {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button 
                        type="submit" 
                        aria-label="Agregar nuevo elemento"
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={submitting}
                    >
                        Agregar
                    </button>
                </form>
            )}
            <ul className="space-y-2">
                {services.map(s => (
                    <li key={s.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors font-medium flex justify-between items-center">
                        {editId === s.id ? (
                            <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onEdit(s.id, editName, editSiteId); setEditId(null); } finally { setSubmitting(false); } }} className="flex gap-2 w-full">
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="p-2 border border-gray-300 rounded flex-grow" required />
                                <select value={editSiteId} onChange={e => setEditSiteId(parseInt(e.target.value))} className="p-2 border border-gray-300 rounded">
                                    <option value={0}>Seleccione Sede</option>
                                    {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
                                </select>
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
                                <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                            </form>
                        ) : (
                            <>
                                <span>{s.name} <span className="text-xs text-gray-400">({sites.find(site => site.id === s.siteId)?.name || 'Sin sede'})</span></span>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditId(s.id); setEditName(s.name); setEditSiteId(s.siteId); }} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ResponsibleManager: React.FC<{ responsibles: Responsible[]; onAdd: (name: string, role: string) => Promise<any> | void; onEdit: (id: number, name: string, role: string) => Promise<any> | void; onDelete: (id: number) => Promise<any> | void; isAdmin: boolean }> = ({ responsibles, onAdd, onEdit, onDelete, isAdmin }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [submitting, setSubmitting] = useState(false);
    return (
        <div>
            {isAdmin && (
                <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onAdd(name, role); setName(''); setRole(''); } finally { setSubmitting(false); } }} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del responsable" className="p-3 border border-gray-300 rounded-lg flex-grow bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" required/>
                    <input value={role} onChange={e => setRole(e.target.value)} placeholder="Cargo" className="p-3 border border-gray-300 rounded-lg flex-grow bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" required/>
                    <button 
                        type="submit" 
                        aria-label="Agregar nuevo elemento"
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={submitting}
                    >
                        Agregar
                    </button>
                </form>
            )}
            <ul className="space-y-2">
                {responsibles.map(r => (
                    <li key={r.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors font-medium flex justify-between items-center">
                        {editId === r.id ? (
                            <form onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await onEdit(r.id, editName, editRole); setEditId(null); } finally { setSubmitting(false); } }} className="flex gap-2 w-full">
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="p-2 border border-gray-300 rounded flex-grow" required />
                                <input value={editRole} onChange={e => setEditRole(e.target.value)} className="p-2 border border-gray-300 rounded flex-grow" required />
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
                                <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                            </form>
                        ) : (
                            <>
                                <span>{r.name} <span className="text-xs text-gray-400">({r.role})</span></span>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditId(r.id); setEditName(r.name); setEditRole(r.role); }} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(r.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const AdminPanel: React.FC<{
  sites: Site[]; services: Service[]; responsibles: Responsible[];
  userData?: any;
}> = ({ sites, services, responsibles, userData }) => {
    const isAdmin = userData?.role === 'admin';
    const [activeTab, setActiveTab] = useState<AdminTab>('sites');
    const [siteList, setSiteList] = useState<Site[]>(sites);
    const [serviceList, setServiceList] = useState<Service[]>(services);
    const [responsibleList, setResponsibleList] = useState<Responsible[]>(responsibles);

    // CRUD handlers conectados al backend
    const fetchSites = async () => {
        const res = await api.get('/api/sedes/');
        setSiteList(res.data);
    };
    const fetchServices = async () => {
        const res = await api.get('/api/servicios/');
        setServiceList(res.data);
    };
    const fetchResponsibles = async () => {
        const res = await api.get('/api/responsables/');
        setResponsibleList(res.data);
    };

    // SEDES
    const handleAddSite = async (name: string) => {
        await api.post('/api/sedes/', { name });
        await fetchSites();
    };
    const handleEditSite = async (id: number, name: string) => {
        await api.patch(`/api/sedes/${id}/`, { name });
        await fetchSites();
    };
    const handleDeleteSite = async (id: number) => {
        await api.delete(`/api/sedes/${id}/`);
        await fetchSites();
    };

    // SERVICIOS
    const handleAddService = async (name: string, siteId: number) => {
        await api.post('/api/servicios/', { name, siteId });
        await fetchServices();
    };
    const handleEditService = async (id: number, name: string, siteId: number) => {
        await api.patch(`/api/servicios/${id}/`, { name, siteId });
        await fetchServices();
    };
    const handleDeleteService = async (id: number) => {
        await api.delete(`/api/servicios/${id}/`);
        await fetchServices();
    };

    // RESPONSABLES
    const handleAddResponsible = async (name: string, role: string) => {
        await api.post('/api/responsables/', { name, role });
        await fetchResponsibles();
    };
    const handleEditResponsible = async (id: number, name: string, role: string) => {
        await api.patch(`/api/responsables/${id}/`, { name, role });
        await fetchResponsibles();
    };
    const handleDeleteResponsible = async (id: number) => {
        await api.delete(`/api/responsables/${id}/`);
        await fetchResponsibles();
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
            <Breadcrumbs 
                items={[
                    { label: 'Panel de Administración', onClick: undefined }
                ]}
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">Panel de Administración</h1>
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-2 sm:space-x-4 min-w-max sm:min-w-0" aria-label="Tabs">
                    <TabButton label="Sedes" isActive={activeTab === 'sites'} onClick={() => setActiveTab('sites')} />
                    <TabButton label="Servicios" isActive={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                    <TabButton label="Responsables" isActive={activeTab === 'responsibles'} onClick={() => setActiveTab('responsibles')} />
                </nav>
            </div>
            <div className="pt-4 sm:pt-6">
                {activeTab === 'sites' && <SiteManager sites={siteList} onAdd={handleAddSite} onEdit={handleEditSite} onDelete={handleDeleteSite} isAdmin={isAdmin} />}
                {activeTab === 'services' && <ServiceManager services={serviceList} sites={siteList} onAdd={handleAddService} onEdit={handleEditService} onDelete={handleDeleteService} isAdmin={isAdmin} />}
                {activeTab === 'responsibles' && <ResponsibleManager responsibles={responsibleList} onAdd={handleAddResponsible} onEdit={handleEditResponsible} onDelete={handleDeleteResponsible} isAdmin={isAdmin} />}
            </div>
        </div>
    );
};
