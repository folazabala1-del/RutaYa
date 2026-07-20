import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { routes as allRoutes, TRUJILLO_CENTER } from '../data/mock';
import { rankRoutesForDestination, nearestPointOnPath } from '../lib/geo';
import { useApp } from '../context/AppContext';

export default function Rutas() {
  const navigate = useNavigate();
  const { destino, userPos, setSelectedRoute, addSavedRoute, isRouteSaved } = useApp();

  // Si hay un destino real, ordenamos las rutas por cuál conviene más y calculamos,
  // para cada una, dos tramos a pie: de tu ubicación al paradero más cercano de esa
  // ruta (subida), y de la parada más cercana a tu destino hasta la puerta (bajada).
  // El trazo del micro NO se deforma — un micro no se desvía a tu destino exacto,
  // solo sigue su ruta fija; lo que cambia es cuánto tienes que caminar.
  const routes = useMemo(() => {
    if (!destino?.coords) return allRoutes;
    const origin = userPos || TRUJILLO_CENTER;
    const ranked = rankRoutesForDestination(allRoutes, destino);
    return ranked.slice(0, 3).map((r) => {
      const board = nearestPointOnPath(r.path, origin);
      const alight = nearestPointOnPath(r.path, destino.coords);
      return {
        ...r,
        boardPoint: board?.coords,
        walkToBoardM: board ? Math.round(board.distKm * 1000) : null,
        alightPoint: alight?.coords,
        walkFromAlightM: alight ? Math.round(alight.distKm * 1000) : null,
      };
    });
  }, [destino, userPos]);

  function verMapa(route) {
    setSelectedRoute(route);
    navigate('/mapa-en-vivo');
  }

  function guardar(route) {
    addSavedRoute(route, destino?.label);
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
              {typeof r.walkToBoardM === 'number' ? (
                r.walkToBoardM < 5000 ? (
                  <>
                    <span>🚶 {r.walkToBoardM} m hasta el paradero</span>
                    <span>🚶 {r.walkFromAlightM} m desde la bajada</span>
                  </>
                ) : (
                  <span className="text-amber-600">⚠ Tu ubicación es imprecisa (GPS con {(r.walkToBoardM / 1000).toFixed(0)} km de margen)</span>
                )
              ) : (
                <span>🚶 {r.walk} km</span>
              )}
              <span>📍 Paradero: {r.paradero}</span>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => verMapa(r)} className="flex-1 bg-navy-900 text-white text-sm font-semibold py-2.5 rounded-xl">Ver mapa</button>
              <button
                onClick={() => guardar(r)}
                disabled={isRouteSaved(r, destino?.label)}
                className="w-11 border border-slate-200 text-navy-900 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center disabled:text-amber-500 disabled:border-amber-300"
                aria-label="Guardar ruta"
              >
                {isRouteSaved(r, destino?.label) ? '✓' : '🔖'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
