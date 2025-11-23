import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getAccessToken } from '../services/auth';

export default function EquiposForm({ initial = null, onSaved, onCancel }) {
  const [form, setForm] = useState({
    codigo_udea: '', nombre_equipo: '', marca: '', modelo: '', serie: '',
    sede: '', servicio: '', responsable_proceso: '', ubicacion: '', codigo_ips: '', codigo_ecri: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('Not authenticated');
      if (form.id) {
        await api.put(`/api/equipos/${form.id}/`, form);
      } else {
        await api.post('/api/equipos/', form);
      }
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert('Error saving equipo: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Código UDEA</label>
        <input name="codigo_udea" value={form.codigo_udea} onChange={handleChange} required />
      </div>
      <div>
        <label>Nombre</label>
        <input name="nombre_equipo" value={form.nombre_equipo} onChange={handleChange} required />
      </div>
      <div>
        <label>Marca</label>
        <input name="marca" value={form.marca} onChange={handleChange} />
      </div>
      <div>
        <label>Modelo</label>
        <input name="modelo" value={form.modelo} onChange={handleChange} />
      </div>
      <div>
        <label>Serie</label>
        <input name="serie" value={form.serie} onChange={handleChange} />
      </div>
      <div>
        <label>Código IPS</label>
        <input name="codigo_ips" value={form.codigo_ips} onChange={handleChange} />
      </div>
      <div>
        <label>Código ECRI</label>
        <input name="codigo_ecri" value={form.codigo_ecri} onChange={handleChange} />
      </div>
      <div>
        <label>Sede (id)</label>
        <input name="sede" value={form.sede} onChange={handleChange} />
      </div>
      <div>
        <label>Servicio (id)</label>
        <input name="servicio" value={form.servicio} onChange={handleChange} />
      </div>
      <div>
        <label>Responsable (id)</label>
        <input name="responsable_proceso" value={form.responsable_proceso} onChange={handleChange} />
      </div>
      <div>
        <label>Ubicación</label>
        <input name="ubicacion" value={form.ubicacion} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</button>
      </div>
    </form>
  );
}
