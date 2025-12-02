
import React, { useState } from 'react';
import { Site, Service, Responsible } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

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

const SiteManager: React.FC<{ sites: Site[]; onAdd: (name: string) => Promise<any> | void; isAdmin: boolean }> = ({ sites, onAdd, isAdmin }) => {
    const [name, setName] = useState('');
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
            <ul className="space-y-2">{sites.map(s => <li key={s.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors font-medium">{s.name}</li>)}</ul>
        </div>
    );
};
const ServiceManager: React.FC<{ services: Service[]; sites: Site[]; onAdd: (name: string, siteId: number) => Promise<any> | void; isAdmin: boolean }> = ({ services, sites, onAdd, isAdmin }) => {
    const [name, setName] = useState('');
    const [siteId, setSiteId] = useState<number>(0);
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
            <ul className="space-y-2">{services.map(s => <li key={s.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"><span className="font-medium">{s.name}</span> <span className="text-xs text-gray-500">({sites.find(site => site.id === s.siteId)?.name})</span></li>)}</ul>
        </div>
    );
};
const ResponsibleManager: React.FC<{ responsibles: Responsible[]; onAdd: (name: string, role: string) => Promise<any> | void; isAdmin: boolean }> = ({ responsibles, onAdd, isAdmin }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
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
            <ul className="space-y-2">{responsibles.map(r => <li key={r.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"><span className="font-medium">{r.name}</span> <span className="text-xs text-gray-500">({r.role})</span></li>)}</ul>
        </div>
    );
};


export const AdminPanel: React.FC<{
  sites: Site[]; services: Service[]; responsibles: Responsible[];
  onAddSite: (name: string) => void;
  onAddService: (name: string, siteId: number) => void;
  onAddResponsible: (name: string, role: string) => void;
  userData?: any;
}> = ({ sites, services, responsibles, onAddSite, onAddService, onAddResponsible, userData }) => {
    const isAdmin = userData?.role === 'admin';
    const [activeTab, setActiveTab] = useState<AdminTab>('sites');

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
                {activeTab === 'sites' && <SiteManager sites={sites} onAdd={onAddSite} isAdmin={isAdmin} />}
                {activeTab === 'services' && <ServiceManager services={services} sites={sites} onAdd={onAddService} isAdmin={isAdmin} />}
                {activeTab === 'responsibles' && <ResponsibleManager responsibles={responsibles} onAdd={onAddResponsible} isAdmin={isAdmin} />}
            </div>
        </div>
    );
};
