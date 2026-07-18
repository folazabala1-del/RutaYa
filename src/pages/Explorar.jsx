import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppMap from '../components/AppMap';
import BottomNav from '../components/BottomNav';
import { TRUJILLO_CENTER } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Explorar() {
  const navigate = useNavigate();
  const { userPos, setUserPos, locationAccuracy, setLocationAccuracy, destino } = useApp();
  const [locating, setLocating] = useState(false);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationAccuracy(pos.coords.accuracy);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setUserPos, setLocationAccuracy]);

  // Si por alguna razón no se capturó la ubicación en la pantalla de permisos
  // (p. ej. una sesión ya guardada que saltó ese paso), la pedimos aquí también.
  useEffect(() => {
    if (!userPos) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const center = userPos || TRUJILLO_CENTER;

  // Cuando hay destino, ajustamos la vista para que se vean tú y el destino a la vez.
  const bounds = useMemo(() => {
    if (!destino?.coords) return null;
    return [center, destino.coords];
  }, [center, destino]);

  return (
    <div className="flex-1 relative">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur border-b border-slate-100">
        <button className="text-navy-900" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="font-display font-bold text-[15px] text-navy-900">Transporte Trujillo</h1>
        <button className="text-navy-900" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <circle cx="12" cy="8" r="3.3" />
            <path d="M5 20c1.4-3.7 4.7-5 7-5s5.6 1.3 7 5" />
          </svg>
        </button>
      </header>

      <div className="absolute inset-0 z-0">
        <AppMap
          center={destino?.coords || center}
          zoom={destino ? 14 : 15}
          userPos={userPos}
          destPos={destino?.coords}
          bounds={bounds}
          className="w-full h-full"
        />
      </div>

      {!userPos && (
        <div className="absolute top-[68px] left-4 right-4 z-20 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl px-3 py-2 text-center">
          {locating ? 'Obteniendo tu ubicación…' : 'No pudimos obtener tu ubicación. Actívala desde el navegador.'}
        </div>
      )}
      {userPos && locationAccuracy > 1500 && (
        <div className="absolute top-[68px] left-4 right-4 z-20 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl px-3 py-2 text-center">
          ⚠ Tu ubicación es poco precisa (margen de {Math.round(locationAccuracy / 1000)} km). En una laptop sin GPS esto es normal — usa el celular para mejor precisión.
        </div>
      )}

      <button
        onClick={() => navigate('/buscar')}
        className="absolute top-[112px] left-4 right-4 z-20 bg-white rounded-2xl shadow-card px-4 py-3.5 flex items-center gap-3 text-left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="w-5 h-5 shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span className="text-slate-400 text-sm flex-1">¿A dónde vas hoy?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="w-5 h-5 shrink-0">
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M9 2v6M15 2v6" />
        </svg>
      </button>

      <div className="absolute bottom-24 left-4 right-4 z-20 flex gap-2">
        <QuickChip icon="💼" label="Trabajo" onClick={() => navigate('/buscar')} />
        <QuickChip icon="🏠" label="Casa" onClick={() => navigate('/buscar')} />
        <QuickChip icon="🕐" label="Recientes" onClick={() => navigate('/buscar')} />
      </div>

      <button
        onClick={locate}
        className="absolute bottom-[104px] right-4 z-20 w-12 h-12 bg-navy-900 rounded-full shadow-card flex items-center justify-center text-white disabled:opacity-60"
        aria-label="Centrar ubicación"
        disabled={locating}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
}

function QuickChip({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-full px-3.5 py-2 text-xs font-semibold text-navy-900 shadow flex items-center gap-1.5 whitespace-nowrap">
      <span>{icon}</span> {label}
    </button>
  );
}
