import React, { useState } from 'react';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import { login } from '../src/services/auth';

interface LoginProps {
    onLoginSuccess: (userData: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            // El token personalizado incluye información del usuario
            const userData = response.user || {
                username: response.username || username,
                role: response.role || 'reader'
            };
            onLoginSuccess(userData);
        } catch (err: any) {
            console.error('Error de login:', err);
            setError(
                err?.response?.data?.detail || 
                err?.response?.data?.message || 
                err?.message || 
                'Error al iniciar sesión. Verifica tus credenciales.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                {/* Logo/Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Inventario LIME
                    </h2>
                    <p className="text-gray-600">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Ingresa tu usuario"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Ingresa tu contraseña"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Iniciando sesión...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Iniciar sesión
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Usuarios de prueba */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center mb-3">
                        Usuarios de prueba:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-semibold text-gray-700">angelower</div>
                            <div className="text-gray-500">Admin</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-semibold text-gray-700">aleja</div>
                            <div className="text-gray-500">Lector</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-semibold text-gray-700">juanes</div>
                            <div className="text-gray-500">Lector</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-semibold text-gray-700">meli</div>
                            <div className="text-gray-500">Lector</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

