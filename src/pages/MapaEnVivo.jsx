import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppMap from '../components/AppMap';
import { routes as allRoutes, TRUJILLO_CENTER } from '../data/mock';
import { densifyPath } from '../lib/geo';
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
  const { selectedRoute, destino, userPos, setUserPos, setLocationAccuracy } = useApp();
  const route = selectedRoute || allRoutes[0];

  // El tramo "camina hasta el paradero" no es confiable si el GPS del dispositivo dio
  // una lectura muy imprecisa (común en laptops sin chip GPS) — evitamos mostrar un
  // número absurdo como "camina 42959 m" y en vez de eso avisamos.
  const walkToBoardReliable = typeof route.walkToBoardM === 'number' && route.walkToBoardM < 5000;

  // Suavizamos el trazo (más puntos + un ligero zigzag) para que se vea como una calle
  // real y no una línea perfectamente recta entre dos paraderos.
  const visualPath = useMemo(() => densifyPath(route.path, route.id), [route]);

  // Otros micros de Trujillo circulando de fondo, para que el mapa se sienta vivo
  // con distintas rutas recorriendo la ciudad (no solo la que elegiste). Con 13 rutas
  // reales disponibles, mostramos varias a la vez sin saturar la pantalla.
  const backgroundRoutes = useMemo(
    () =>
      allRoutes
        .filter((r) => r.id !== route.id)
        .slice(0, 7)
        .map((r) => ({ ...r, visualPath: densifyPath(r.path, r.id) })),
    [route]
  );

  // Si aún no tenemos tu ubicación real (p. ej. se saltó la pantalla de permisos
  // porque ya había una sesión guardada), la pedimos aquí también.
  useEffect(() => {
    if (userPos || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationAccuracy(pos.coords.accuracy);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [userPos, setUserPos, setLocationAccuracy]);

  const [tick, setTick] = useState(0);
  const [etaMin, setEtaMin] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setEtaMin((m) => (m <= 1 ? 12 : m - 1));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Cada micro (el elegido y los de fondo) recorre su propia ruta completa en loop,
  // cada uno con su propia velocidad y punto de partida para que no se vean sincronizados.
  const busPos = useMemo(() => interpolate(visualPath, ((tick * 0.6) % 100) / 100), [visualPath, tick]);
  const bgBuses = useMemo(
    () =>
      backgroundRoutes.map((r, i) => ({
        path: r.visualPath,
        color: r.color,
        busPos: interpolate(r.visualPath, ((tick * (0.35 + i * 0.18) + i * 21) % 100) / 100),
      })),
    [backgroundRoutes, tick]
  );

  // Tramos a pie reales: de tu ubicación al paradero de subida, y de la bajada a tu destino.
  // Si la ubicación no es confiable, no dibujamos ese tramo (evita una línea absurda cruzando
  // media ciudad) y tampoco la usamos para encuadrar el mapa.
  const walkLines = useMemo(() => {
    const lines = [];
    if (userPos && walkToBoardReliable && route.boardPoint) lines.push({ from: userPos, to: route.boardPoint });
    if (route.alightPoint && destino?.coords) lines.push({ from: route.alightPoint, to: destino.coords });
    return lines;
  }, [userPos, destino, route, walkToBoardReliable]);

  const stopMarkers = useMemo(() => {
    const stops = [];
    if (route.boardPoint) stops.push({ pos: route.boardPoint, color: route.color });
    if (route.alightPoint) stops.push({ pos: route.alightPoint, color: route.color });
    return stops;
  }, [route]);

  // Ajustamos la vista para que se vean tu ubicación, el destino y los paraderos a la vez.
  const bounds = useMemo(() => {
    const pts = [walkToBoardReliable ? userPos : null, destino?.coords, route.boardPoint, route.alightPoint].filter(Boolean);
    return pts.length >= 2 ? pts : null;
  }, [userPos, destino, route, walkToBoardReliable]);

  const destinoLabel = destino?.label || route.hacia;

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
          center={(walkToBoardReliable && userPos) || destino?.coords || TRUJILLO_CENTER}
          zoom={14}
          userPos={userPos}
          destPos={destino?.coords}
          bounds={bounds}
          routePath={visualPath}
          routeColor={route.color}
          busPos={busPos}
          walkLines={walkLines}
          stopMarkers={stopMarkers}
          otherRoutes={bgBuses}
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-[68px] right-4 z-20 bg-white rounded-full shadow-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" /> GPS LIVE
      </div>

      {(walkToBoardReliable || typeof route.walkFromAlightM === 'number') && (
        <div className="absolute top-[112px] left-4 z-20 bg-white rounded-xl shadow-card px-3 py-2 text-[11px] text-slate-500 leading-relaxed">
          {walkToBoardReliable && <p>🚶 Camina {route.walkToBoardM} m hasta el paradero</p>}
          {typeof route.walkFromAlightM === 'number' && <p>🚶 Camina {route.walkFromAlightM} m desde la bajada</p>}
        </div>
      )}
      {!walkToBoardReliable && typeof route.walkToBoardM === 'number' && (
        <div className="absolute top-[112px] left-4 right-4 z-20 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-xl px-3 py-2 text-center">
          ⚠ Tu ubicación parece imprecisa para calcular la caminata al paradero. Prueba desde el celular con GPS activado.
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(15,27,61,0.12)] px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="bg-amber-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">RUTA {route.code}</span>
          <span className="text-xs text-slate-400 text-right">
            {destino ? 'Destino' : 'Próxima parada'}<br />
            <b className="text-navy-900">{destinoLabel.length > 22 ? destinoLabel.slice(0, 22) + '…' : destinoLabel}</b>
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
