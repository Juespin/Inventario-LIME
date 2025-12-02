
import React, { useState } from 'react';

interface DecommissionFormProps {
    equipmentName: string;
    onConfirm: (date: string, reason: string) => void;
    onCancel: () => void;
}

export const DecommissionForm: React.FC<DecommissionFormProps> = ({ equipmentName, onConfirm, onCancel }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && reason) {
            onConfirm(date, reason);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p>Por favor, confirme los detalles para dar de baja el equipo: <strong>{equipmentName}</strong>.</p>
            <div>
                <label htmlFor="decommissionDate" className="block text-sm font-medium text-gray-700">Fecha de Baja</label>
                <input
                    type="date"
                    id="decommissionDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="decommissionReason" className="block text-sm font-medium text-gray-700">Motivo</label>
                <textarea
                    id="decommissionReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describa el motivo de la baja del equipo..."
                    required
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button 
                    type="button" 
                    onClick={onCancel}
                    aria-label="Cancelar operación de baja"
                    className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    aria-label={`Confirmar baja del equipo ${equipmentName}`}
                    className="bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Confirmar Baja
                </button>
            </div>
        </form>
    );
};
