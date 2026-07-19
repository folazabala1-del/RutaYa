import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { user, updateProfile, profileLoading } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaved(false);
    if (!name.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    const res = await updateProfile(name);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => navigate('/perfil'), 800);
    } else {
      setError(res.error || 'No se pudo guardar. Intenta de nuevo.');
    }
  }

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Editar perfil" showBack />

      <form onSubmit={handleSave} className="px-4 pt-5 flex flex-col gap-4">
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-3xl">
            🧑
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white rounded-xl shadow-card px-4 py-3.5 text-sm font-semibold text-navy-900 outline-none"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">DNI</label>
          <div className="w-full bg-slate-100 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-400">
            {user?.dni || '—'} <span className="font-normal text-[11px]">(no editable)</span>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-semibold text-center">{error}</p>}
        {saved && <p className="text-xs text-emerald-600 font-semibold text-center">✓ Guardado</p>}

        <button
          type="submit"
          disabled={profileLoading}
          className="mt-2 w-full bg-navy-900 text-white font-display font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {profileLoading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
