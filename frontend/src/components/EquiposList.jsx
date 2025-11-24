import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { mapEquipmentFromBackend } from '../utils/mapEquipment';
import EquiposForm from './EquiposForm';

export default function EquiposList() {
  const [equipos, setEquipos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/equipos/');
      setEquipos(r.data.map(mapEquipmentFromBackend));
    } catch (err) {
      console.error(err);
      alert('Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let mounted = true;

  const fetchEquipos = async () => {
    try {
      const listResp = await api.get('/api/equipos/');
      const equiposFull = await Promise.all(
        listResp.data.map(async (e) => {
          const fullResp = await api.get(`/api/equipos/${e.id}/`);
          return mapEquipmentFromBackend(fullResp.data);
        })
      );
      if (mounted) setEquipos(equiposFull);
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchEquipos();

  return () => { mounted = false; };
}, []);


  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Equipos</h2>
      <button 
        onClick={() => setEditing(mapEquipmentFromBackend({}))} 
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Nuevo equipo
      </button>

      <ul className="space-y-4">
        {equipos.map(e => (
          <li key={e.id} className="p-4 border rounded shadow-sm">
            <strong>{e.display}</strong>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => setEditing(e)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button 
                onClick={async () => {
                  if (!confirm('Eliminar equipo?')) return;
                  try {
                    await api.delete(`/api/equipos/${e.id}/`);
                    setEquipos(prev => prev.filter(x => x.id !== e.id));
                  } catch(err) {
                    console.error(err);
                    alert('Error al eliminar');
                  }
                }}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
            <pre className="mt-2 whitespace-pre-wrap bg-gray-50 p-2 rounded">
              {JSON.stringify(e.full, null, 2)}
            </pre>
          </li>
        ))}
      </ul>

      {editing !== null && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            {editing.id ? 'Editar' : 'Crear'} equipo
          </h3>
          <EquiposForm
            initial={editing.id ? mapEquipmentFromBackend(editing) : editing}
            onSaved={() => {
              setEditing(null);
              fetchEquipos();
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
    </div>
  );
}
