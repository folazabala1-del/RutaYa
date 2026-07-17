import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { routes as allRoutes } from '../data/mock';
import { rankRoutesForDestination } from '../lib/geo';
import { useApp } from '../context/AppContext';

export default function Rutas() {
  const navigate = useNavigate();
  const { destino, setSelectedRoute } = useApp();

  // Si hay un destino real (buscado por el usuario), ordenamos las rutas por cuál
  // llega más cerca de ese destino (por nombre de distrito/lugar y por distancia).
  // Además, "estiramos" el último tramo del recorrido hasta el destino real, para
  // que el mapa muestre la ruta llegando al lugar que el usuario buscó.
  const routes = useMemo(() => {
    if (!destino?.coords) return allRoutes;
    const ranked = rankRoutesForDestination(allRoutes, destino);
    return ranked.slice(0, 3).map((r) => ({
      ...r,
      path: [...r.path.slice(0, -1), destino.coords],
    }));
  }, [destino]);

  function verMapa(route) {
    setSelectedRoute(route);
    navigate('/mapa-en-vivo');
  }

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Transporte Trujillo" showBack />

      <div className="px-4 pt-5 pb-2">
        <h2 className="font-display font-extrabold text-2xl text-navy-900">Rutas recomendadas</h2>
        <p className="text-slate-400 text-sm mt-1">
          Desde tu ubicación hasta {destino ? destino.label : 'tu destino'}
        </p>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-2">
        {routes.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-2xl p-4 shadow-card relative ${r.fastest ? 'border-2 border-amber-400' : 'border border-slate-100'}`}
          >
            <div className="flex items-center justify-between mb-2">
              {r.fastest ? (
                <span className="bg-amber-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">✓ Más rápida</span>
              ) : <span />}
              {r.live && (
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" /> EN VIVO
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">🚌</div>
                <div>
                  <p className="font-display font-bold text-navy-900 leading-tight">{r.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Hacia: {r.hacia}</p>
                  {r.company && <p className="text-[10px] text-slate-300 mt-0.5">{r.company}</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-extrabold text-navy-900 text-xl leading-none">{r.time}<span className="text-xs font-semibold"> min</span></p>
                <p className="text-xs text-amber-500 font-semibold mt-1">Costo: S/ {r.cost.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 flex-wrap">
              <span>🚶 {r.walk} km</span>
              <span>📍 Paradero: {r.paradero}</span>
              {typeof r.distKm === 'number' && <span>🎯 {r.distKm} km del destino</span>}
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => verMapa(r)} className="flex-1 bg-navy-900 text-white text-sm font-semibold py-2.5 rounded-xl">Ver detalle</button>
              <button onClick={() => verMapa(r)} className="flex-1 border border-slate-200 text-navy-900 text-sm font-semibold py-2.5 rounded-xl">Ver mapa</button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
