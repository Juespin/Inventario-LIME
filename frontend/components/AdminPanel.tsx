
import React, { useState } from 'react';
import { Site, Service, Responsible } from '../types';

type AdminTab = 'sites' | 'services' | 'responsibles';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 ${
      isActive ? 'border-lime-blue-600 text-lime-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

const SiteManager: React.FC<{ sites: Site[]; onAdd: (name: string) => void }> = ({ sites, onAdd }) => {
    const [name, setName] = useState('');
    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); onAdd(name); setName(''); }} className="flex gap-2 mb-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la nueva sede" className="p-2 border rounded-md flex-grow" required/>
                <button type="submit" className="bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg">Agregar</button>
            </form>
            <ul className="space-y-2">{sites.map(s => <li key={s.id} className="p-3 bg-white border rounded-md">{s.name}</li>)}</ul>
        </div>
    );
};
const ServiceManager: React.FC<{ services: Service[]; sites: Site[]; onAdd: (name: string, siteId: number) => void }> = ({ services, sites, onAdd }) => {
    const [name, setName] = useState('');
    const [siteId, setSiteId] = useState<number>(0);
    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); onAdd(name, siteId); setName(''); setSiteId(0); }} className="flex gap-2 mb-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del nuevo servicio" className="p-2 border rounded-md flex-grow" required/>
                <select value={siteId} onChange={e => setSiteId(parseInt(e.target.value))} className="p-2 border rounded-md" required>
                    <option value={0}>Seleccione Sede</option>
                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button type="submit" className="bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg">Agregar</button>
            </form>
            <ul className="space-y-2">{services.map(s => <li key={s.id} className="p-3 bg-white border rounded-md">{s.name} <span className="text-xs text-gray-500">({sites.find(site => site.id === s.siteId)?.name})</span></li>)}</ul>
        </div>
    );
};
const ResponsibleManager: React.FC<{ responsibles: Responsible[]; onAdd: (name: string, role: string) => void }> = ({ responsibles, onAdd }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); onAdd(name, role); setName(''); setRole(''); }} className="flex gap-2 mb-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del responsable" className="p-2 border rounded-md flex-grow" required/>
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="Cargo" className="p-2 border rounded-md flex-grow" required/>
                <button type="submit" className="bg-lime-green-600 text-white font-bold py-2 px-4 rounded-lg">Agregar</button>
            </form>
            <ul className="space-y-2">{responsibles.map(r => <li key={r.id} className="p-3 bg-white border rounded-md">{r.name} <span className="text-xs text-gray-500">({r.role})</span></li>)}</ul>
        </div>
    );
};


export const AdminPanel: React.FC<{
  sites: Site[]; services: Service[]; responsibles: Responsible[];
  onAddSite: (name: string) => void;
  onAddService: (name: string, siteId: number) => void;
  onAddResponsible: (name: string, role: string) => void;
}> = ({ sites, services, responsibles, onAddSite, onAddService, onAddResponsible }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('sites');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Panel de Administración</h1>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton label="Sedes" isActive={activeTab === 'sites'} onClick={() => setActiveTab('sites')} />
                    <TabButton label="Servicios" isActive={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                    <TabButton label="Responsables" isActive={activeTab === 'responsibles'} onClick={() => setActiveTab('responsibles')} />
                </nav>
            </div>
            <div className="pt-6">
                {activeTab === 'sites' && <SiteManager sites={sites} onAdd={onAddSite} />}
                {activeTab === 'services' && <ServiceManager services={services} sites={sites} onAdd={onAddService} />}
                {activeTab === 'responsibles' && <ResponsibleManager responsibles={responsibles} onAdd={onAddResponsible} />}
            </div>
        </div>
    );
};
