import React from 'react';
import { View } from '../types';
import { Home, Settings, HardDrive } from 'lucide-react';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            style={isActive ? { backgroundColor: '#3b82f6', color: 'white' } : { color: 'black' }}
            className={`flex items-center p-3 my-1 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-300`}
        >
            {icon}
            <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
        </button>
    </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div style={{ backgroundColor: '#DCE7F3' }} className="overflow-y-auto py-4 px-3 h-full flex flex-col">
                <div className="flex items-center pl-2.5 mb-5">
                    <img src="/assets/logo.png" alt="Logo de la base de datos   " className="h-15" />
                </div>
                <ul className="space-y-2 flex-1">
                    <NavItem 
                        icon={<Home className="w-6 h-6" />}
                        label="Dashboard"
                        isActive={currentView === 'dashboard'}
                        onClick={() => setView('dashboard')}
                    />
                    <NavItem 
                        icon={<Settings className="w-6 h-6" />}
                        label="Administración"
                        isActive={currentView === 'administration'}
                        onClick={() => setView('administration')}
                    />
                </ul>
                <div className="mt-auto p-4 text-center text-xs" style={{ color: '#369041' }}>
                   <div className="flex justify-around items-center mt-4">
                        <img src="/assets/lime.png" alt="Logo LIME" className="h-10" />
                        <img src="/assets/hama.png" alt="Logo HAMA" className="h-10" />
                   </div>
                   <div className="flex justify-around items-center mt-4">
                        <img src="/assets/udea.png" alt="Logo UdeA" className="h-15" />
                   </div>
                   <p className="mt-4">&copy; 2025 Facultad de Ingeniería de la UdeA </p>
                   <p>Creado por:</p>
                   <p>Melina Villada Lopez</p>
                   <p>Alejandra Ortega Andrade</p>
                   <p>Juan Esteban Pineda Lopera</p>
                </div>
            </div>
        </aside>
    );
};
