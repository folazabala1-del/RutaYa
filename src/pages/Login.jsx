import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register, authLoading } = useApp();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (dni.trim().length !== 8) {
      setError('Ingresa un DNI válido (8 dígitos)');
      return;
    }
    if (password.trim().length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const result = tab === 'login'
      ? await login(dni, password)
      : await register(dni, password, name || 'Usuario RutaYa');

    if (result.ok) {
      navigate('/explorar');
    } else {
      setError(result.error || 'No se pudo conectar con el servidor. Intenta de nuevo.');
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white px-7 pt-14 pb-8 animate-fadeUp">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
            <rect x="4" y="4" width="16" height="12" rx="2" />
            <path d="M4 10h16M8 16v2M16 16v2" />
          </svg>
        </div>
        <h1 className="font-display font-extrabold text-xl text-navy-900">Transporte Trujillo</h1>
        <p className="text-slate-400 text-sm">Tu conexión rápida por la ciudad</p>
      </div>

      <div className="border border-slate-200 rounded-3xl p-5">
        <div className="flex gap-6 border-b border-slate-100 mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`pb-3 font-display font-bold text-sm ${tab === 'login' ? 'text-navy-900 border-b-2 border-navy-900' : 'text-slate-400'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => { setTab('registro'); setError(''); }}
            className={`pb-3 font-display font-bold text-sm ${tab === 'registro' ? 'text-navy-900 border-b-2 border-navy-900' : 'text-slate-400'}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'registro' && (
            <label className="text-xs font-semibold text-slate-500">
              Nombre
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-navy-900 outline-none focus:border-navy-900"
              />
            </label>
          )}
          <label className="text-xs font-semibold text-slate-500">
            DNI
            <input
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Ingrese su DNI"
              inputMode="numeric"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-navy-900 outline-none focus:border-navy-900"
            />
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Contraseña
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-navy-900 outline-none focus:border-navy-900"
            />
          </label>

          {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

          {tab === 'login' && (
            <p className="text-right text-xs font-semibold text-amber-500 -mt-2">¿Olvidó su contraseña?</p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-navy-900 text-white font-display font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {authLoading ? 'Un momento...' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-semibold text-slate-400">O CONTINUAR CON</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <button
          type="button"
          disabled
          title="Disponible próximamente"
          className="w-full border border-slate-200 rounded-xl py-3 font-semibold text-sm text-slate-300 flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <span>G</span> Google
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Al continuar, aceptas nuestros <span className="text-navy-900 font-semibold">Términos de Servicio</span> y <span className="text-navy-900 font-semibold">Privacidad</span>.
      </p>
    </div>
  );
}
