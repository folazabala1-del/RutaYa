import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { TRUJILLO_CENTER } from '../data/mock';

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:22px;height:22px;border-radius:9999px;background:#2563EB;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const busIcon = (color = '#EE9315', size = 30) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;font-size:${Math.round(size * 0.47)}px;">🚌</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#0F1B3D;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const stopIcon = (color = '#0F1B3D') =>
  L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:9999px;background:white;border:3px solid ${color};box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

function FitView({ center, bounds }) {
  const map = useMap();

  useEffect(() => {
    // Corrige el problema de Leaflet donde el mapa se muestra gris o incompleto
    // al cargarse en contenedores dinámicos/transiciones de página.
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      // Ajusta la vista para que se vean tu ubicación, el destino y los paraderos.
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 16 });
    } else if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(bounds), center && center[0], center && center[1], map]);

  return null;
}

export default function AppMap({
  center = TRUJILLO_CENTER,
  zoom = 15,
  userPos,
  destPos,
  routePath,
  routeColor = '#EE9315',
  busPos,
  bounds,
  walkLines, // [{ from: [lat,lng], to: [lat,lng] }] — tramos a pie (punteados)
  stopMarkers, // [{ pos: [lat,lng], color }] — paradero de subida/bajada
  otherRoutes, // [{ path, color, busPos }] — otros micros circulando de fondo
  className = '',
  interactive = true,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />

      {otherRoutes?.map((r, i) => (
        <Polyline key={`bg-line-${i}`} positions={r.path} pathOptions={{ color: r.color, weight: 3, opacity: 0.35 }} />
      ))}
      {otherRoutes?.map((r, i) =>
        r.busPos ? <Marker key={`bg-bus-${i}`} position={r.busPos} icon={busIcon(r.color, 22)} /> : null
      )}

      {walkLines?.map((w, i) => (
        <Polyline key={`walk-${i}`} positions={[w.from, w.to]} pathOptions={{ color: '#64748B', weight: 3, dashArray: '2, 9', lineCap: 'round' }} />
      ))}

      {routePath && <Polyline positions={routePath} pathOptions={{ color: routeColor, weight: 5, lineCap: 'round', lineJoin: 'round' }} />}

      {stopMarkers?.map((s, i) => <Marker key={`stop-${i}`} position={s.pos} icon={stopIcon(s.color || routeColor)} />)}

      {userPos && <Marker position={userPos} icon={userIcon} />}
      {destPos && <Marker position={destPos} icon={pinIcon} />}
      {busPos && <Marker position={busPos} icon={busIcon(routeColor)} />}

      <FitView center={center} bounds={bounds} />
    </MapContainer>
  );
}
