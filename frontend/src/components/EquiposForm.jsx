import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function EquiposForm({ initial = {}, onSaved, onCancel, sites = [], services = [], responsibles = [] }) {
  const [form, setForm] = useState({
    inventory_code: '', name: '', brand: '', model: '', serial: '',
    site: '', service: '', responsible: '', physical_location: '', ips_code: '', ecri_code: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };

      // Convertir site, service y responsible a número
      ['site', 'service', 'responsible'].forEach(k => {
        if (payload[k] !== '') payload[k] = Number(payload[k]);
      });

      // Limpiar campos vacíos
      const cleaned = {};
      Object.entries(payload).forEach(([k, v]) => {
        if (v === false || v === true) cleaned[k] = v;
        else if (typeof v === 'number') cleaned[k] = v;
        else if (Array.isArray(v) && v.length > 0) cleaned[k] = v;
        else if (v !== undefined && v !== null && String(v).trim() !== '') cleaned[k] = v;
      });

      if (form.id) {
        await api.patch(`/api/equipos/${form.id}/`, cleaned);
      } else {
        await api.post('/api/equipos/', cleaned);
      }

      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      alert('Error al guardar equipo: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">

      {[
        { label: 'Código UDEA', name: 'inventory_code' },
        { label: 'Nombre', name: 'name' },
        { label: 'Marca', name: 'brand' },
        { label: 'Modelo', name: 'model' },
        { label: 'Serie', name: 'serial' },
        { label: 'Código IPS', name: 'ips_code' },
        { label: 'Código ECRI', name: 'ecri_code' },
        { label: 'Ubicación', name: 'physical_location' }
      ].map(f => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-700">{f.label}</label>
          <input
            name={f.name}
            value={form[f.name]}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </div>
      ))}

      {/* Selects para site, service y responsible */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sede</label>
        <select name="site" value={form.site} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1">
          <option value="">Seleccione una sede</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Servicio</label>
        <select name="service" value={form.service} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1">
          <option value="">Seleccione un servicio</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Responsable</label>
        <select name="responsible" value={form.responsible} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1">
          <option value="">Seleccione un responsable</option>
          {responsibles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
