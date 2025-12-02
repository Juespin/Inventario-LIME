import React from 'react';
import { View } from '../types';
import { Home, Settings, X, Calendar, LogOut } from 'lucide-react';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    isOpen: boolean;
    onClose: () => void;
    userData?: any;
    onLogout?: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li role="none">
        <button
            onClick={onClick}
            role="menuitem"
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Ir a ${label}`}
            className={`flex items-center p-3 my-1 w-full text-base font-normal rounded-lg transition duration-75 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-black hover:bg-gray-300'
            }`}
        >
            <span aria-hidden="true">{icon}</span>
            <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
        </button>
    </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose, userData, onLogout }) => {
    const handleNavClick = (view: View) => {
        setView(view);
        onClose(); // Cerrar el menú al hacer clic en móvil
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
                aria-label="Sidebar"
            >
                <div className="bg-blue-50 overflow-y-auto py-4 px-3 h-full flex flex-col">
                    {/* Botón de cerrar para móvil */}
                    <div className="flex items-center justify-between mb-5 pl-2.5 pr-2">
                        <img src="/assets/logo.png" alt="Logo de la base de datos" className="h-15" />
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Cerrar menú de navegación"
                        >
                            <X className="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>
                    
                    <nav role="navigation" aria-label="Navegación principal">
                        <ul className="space-y-2 flex-1" role="menubar">
                            <NavItem 
                                icon={<Home className="w-6 h-6" />}
                                label="Dashboard"
                                isActive={currentView === 'dashboard'}
                                onClick={() => handleNavClick('dashboard')}
                            />
                            <NavItem 
                                icon={<Calendar className="w-6 h-6" />}
                                label="Calendario"
                                isActive={currentView === 'maintenance-calendar'}
                                onClick={() => handleNavClick('maintenance-calendar')}
                            />
                            {userData?.role === 'admin' && (
                                <NavItem 
                                    icon={<Settings className="w-6 h-6" />}
                                    label="Administración"
                                    isActive={currentView === 'administration'}
                                    onClick={() => handleNavClick('administration')}
                                />
                            )}
                        </ul>
                    </nav>
                    
                    {onLogout && (
                        <div className="mt-auto mb-4">
                            <button
                                onClick={onLogout}
                                className="flex items-center w-full p-3 text-base font-normal rounded-lg text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                aria-label="Cerrar sesión"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                <span>Cerrar sesión</span>
                            </button>
                            {userData && (
                                <div className="mt-2 p-2 text-xs text-gray-600 bg-white rounded">
                                    <p className="font-semibold">{userData.username}</p>
                                    <p className="text-gray-500">{userData.role === 'admin' ? 'Administrador' : 'Lector'}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="p-3 sm:p-4 text-center text-xs text-green-600">
                        <div className="flex justify-around items-center mt-4">
                                <img src="/assets/lime.png" alt="Logo LIME" className="sm:h-14" />
                            </div>

                        <div className="flex justify-around items-center mt-4">
                                <img src="/assets/hama.png" alt="Logo HAMA" className="h-8 sm:h-10" /> 
                        </div>
                                    
                        <div className="flex justify-around items-center mt-4">
                                <img src="/assets/udea.png" alt="Logo UdeA" className="h-12 sm:h-15" />
                        </div>
                        <p className="mt-4">&copy; Creado por:</p>
                        <p className="mt-1">Melina Villada Lopez</p>
                        <p className="mt-1">Alejandra Ortega Andrade</p>
                        <p className="mt-1">Juan Esteban Pineda Lopera</p>
                    </div>
                </div>
            </aside>
        </>
    );
};
