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

const busIcon = (color = '#EE9315') =>
  L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:9999px;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;font-size:14px;">🚌</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#0F1B3D;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

function Recenter({ center }) {
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
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

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
      {userPos && <Marker position={userPos} icon={userIcon} />}
      {destPos && <Marker position={destPos} icon={pinIcon} />}
      {routePath && <Polyline positions={routePath} pathOptions={{ color: routeColor, weight: 4, dashArray: '1, 10', lineCap: 'round' }} />}
      {busPos && <Marker position={busPos} icon={busIcon(routeColor)} />}
      <Recenter center={busPos || center} />
    </MapContainer>
  );
}
