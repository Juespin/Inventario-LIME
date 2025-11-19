
import React from 'react';
import { Search, UserCircle, Bell } from 'lucide-react';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10 flex-shrink-0" style={{ backgroundColor: '#DCE7F3' }}>
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar equipo por nombre, marca, modelo, código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-lime-blue-500 focus:border-lime-blue-500 sm:text-sm"
                />
            </div>
            <div className="flex items-center space-x-4">
                 <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <Bell className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <UserCircle className="h-8 w-8 text-gray-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Usuario Administrador</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
