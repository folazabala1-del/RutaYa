const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving/';
const CACHE_KEY = 'rutaya_osrm_cache_v2';

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage lleno o no disponible: seguimos funcionando sin cache persistente.
  }
}

// Pide a OSRM (motor de rutas real sobre calles de OpenStreetMap, servidor público
// gratuito) el trazo que sigue las calles reales entre los puntos de una ruta, en vez
// de líneas rectas que cruzan manzanas y casas.
export async function fetchStreetPath(waypoints) {
  const coords = waypoints.map(([lat, lon]) => `${lon},${lat}`).join(';');
  const url = `${OSRM_BASE}${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('OSRM no respondió');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('OSRM no encontró ruta');
  // GeoJSON viene como [lon, lat]; Leaflet necesita [lat, lon].
  return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
}

// Resuelve el trazo real (sobre calles) de varias rutas, una por una — el servidor
// público de OSRM pide no exceder 1 solicitud por segundo. Usa localStorage como cache
// para no volver a pedirlas en la próxima visita. onUpdate(routeId, path) se llama cada
// vez que una ruta queda lista, para poder pintarla en el mapa apenas llega.
export async function resolveAllRoutePaths(routes, onUpdate) {
  const cache = loadCache();

  for (const route of routes) {
    if (cache[route.id]) {
      onUpdate(route.id, cache[route.id]);
      continue;
    }
    try {
      const path = await fetchStreetPath(route.path);
      cache[route.id] = path;
      saveCache(cache);
      onUpdate(route.id, path);
    } catch {
      // Sin red, límite de uso alcanzado, o el servicio caído: esa ruta se queda con
      // la curva aproximada (ver densifyPath) — no rompe la app.
    }
    await new Promise((r) => setTimeout(r, 1100));
  }
}
