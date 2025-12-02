
import React, { useEffect } from 'react';
import { Search, UserCircle, Bell, Menu, LogOut } from 'lucide-react';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onMenuClick: () => void;
    userData?: any;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onMenuClick, userData, onLogout }) => {
    // Atajo de teclado: Ctrl+K o Cmd+K para enfocar búsqueda
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[aria-label*="Buscar"]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center z-30 flex-shrink-0">
            {/* Primera fila: Menú hamburguesa y búsqueda */}
            <div className="flex items-center gap-3 flex-1 w-full">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative flex-1 max-w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                <input
                    type="text"
                    placeholder="Buscar equipo... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Buscar equipos por nombre, marca, modelo o código. Presiona Ctrl+K o Cmd+K para enfocar"
                    className="block w-full pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                />
                {/* Atajo de teclado visual */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-300 rounded">
                        <span className="text-xs">Ctrl</span>
                        <span className="mx-1">+</span>
                        <span className="text-xs">K</span>
                    </kbd>
                </div>
                </div>
            </div>
            
            {/* Segunda fila: Notificaciones y usuario */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4">
                {/* <button 
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                    aria-label="Notificaciones"
                    aria-describedby="notification-badge"
                >
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    <span id="notification-badge" className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" aria-label="Tienes notificaciones sin leer"></span>
                </button> */}
                <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-gray-200" role="region" aria-label="Perfil de usuario">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">{userData?.username || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{userData?.role === 'admin' ? 'Administrador' : 'Lector'}</p>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors ml-2"
                            aria-label="Cerrar sesión"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
