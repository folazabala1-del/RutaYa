import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppMap from '../components/AppMap';
import { routes, TRUJILLO_CENTER } from '../data/mock';
import { useApp } from '../context/AppContext';

// Interpola posición a lo largo de un path de coordenadas según progreso 0-1
function interpolate(path, t) {
  const segs = path.length - 1;
  const pos = t * segs;
  const i = Math.min(Math.floor(pos), segs - 1);
  const localT = pos - i;
  const [lat1, lng1] = path[i];
  const [lat2, lng2] = path[i + 1];
  return [lat1 + (lat2 - lat1) * localT, lng1 + (lng2 - lng1) * localT];
}

export default function MapaEnVivo() {
  const navigate = useNavigate();
  const { selectedRoute } = useApp();
  const route = selectedRoute || routes[0];
  const [progress, setProgress] = useState(0.15);
  const [etaMin, setEtaMin] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 0.95 ? 0.15 : p + 0.02));
      setEtaMin((m) => (m <= 1 ? 12 : m - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const busPos = useMemo(() => interpolate(route.path, progress), [route, progress]);

  return (
    <div className="flex-1 relative">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="text-navy-900">
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
          center={TRUJILLO_CENTER}
          zoom={15}
          routePath={route.path}
          routeColor={route.color}
          busPos={busPos}
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-[68px] right-4 z-20 bg-white rounded-full shadow-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" /> GPS LIVE
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(15,27,61,0.12)] px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="bg-amber-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">RUTA {route.code}</span>
          <span className="text-xs text-slate-400 text-right">
            Próxima parada<br />
            <b className="text-navy-900">{route.hacia.length > 22 ? route.hacia.slice(0, 22) + '…' : route.hacia}</b>
          </span>
        </div>
        <p className="font-display font-extrabold text-2xl text-navy-900 mt-1">Llegada en {etaMin} min</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate('/explorar')}
            className="flex-1 bg-navy-900 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
          >
            👁 Ver detalle
          </button>
          <button
            onClick={() => navigate('/reportar')}
            className="flex-1 border border-amber-300 text-amber-600 text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
          >
            ⚠ Reportar incidencia
          </button>
        </div>
      </div>
    </div>
  );
}
