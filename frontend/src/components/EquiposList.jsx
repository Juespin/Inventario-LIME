import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function EquiposList() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/api/equipos/')
      .then(r => {
        if (mounted) setEquipos(r.data);
      })
      .catch(err => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  if (loading) return <div>Cargando...</div>;
  return (
    <div>
      <h2>Equipos</h2>
      <button onClick={() => setEditing({})}>Nuevo equipo</button>
      <ul>
        {equipos.map(e => (
          <li key={e.id}>
            <strong>{e.display}</strong>
            <div>
              <button onClick={() => setEditing(e)}>Editar</button>
              <button onClick={async () => {
                if (!confirm('Eliminar equipo?')) return;
                try { await api.delete(`/api/equipos/${e.id}/`); setEquipos(prev => prev.filter(x => x.id !== e.id)); }
                catch(err){ console.error(err); alert('Error al eliminar'); }
              }}>Eliminar</button>
            </div>
            <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(e.full, null, 2)}</pre>
          </li>
        ))}
      </ul>
      {editing !== null && (
        <div style={{ marginTop: 16 }}>
          <h3>{editing.id ? 'Editar' : 'Crear'} equipo</h3>
          <EquiposForm initial={editing.id ? editing : null} onSaved={() => { setEditing(null); setLoading(true); api.get('/api/equipos/').then(r=>setEquipos(r.data)).finally(()=>setLoading(false)); }} onCancel={() => setEditing(null)} />
        </div>
      )}
    </div>
  );
}
