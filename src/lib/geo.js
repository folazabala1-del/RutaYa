// Distancia en línea recta (km) entre dos puntos [lat, lng], usando la fórmula de Haversine.
export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Distancia aproximada punto-segmento en km (proyección plana, válida a escala de ciudad).
function pointToSegmentKm(p, a, b) {
  const toXY = ([lat, lon]) => [lon * 111.32 * Math.cos((lat * Math.PI) / 180), lat * 110.57];
  const [px, py] = toXY(p);
  const [ax, ay] = toXY(a);
  const [bx, by] = toXY(b);
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return { t, distKm: Math.hypot(px - cx, py - cy) };
}

// Punto más cercano de una ruta (polilínea) a un punto dado — p. ej. el paradero más
// cercano a tu ubicación para subir, o el punto de la ruta más cercano a tu destino
// para bajarte y caminar el resto. Devuelve { coords, distKm } o null.
export function nearestPointOnPath(path, point) {
  if (!point || !path || path.length < 2) return null;
  let best = null;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const { t, distKm } = pointToSegmentKm(point, a, b);
    if (!best || distKm < best.distKm) {
      best = {
        coords: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
        distKm,
      };
    }
  }
  return best;
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 1000003;
  return h;
}

// Suaviza un trazo (path) agregando puntos intermedios con un ligero zigzag lateral,
// para que se vea como una calle real en vez de una línea perfectamente recta entre
// dos paraderos. Es determinístico (no usa Math.random): la misma ruta siempre se ve
// igual entre renders, solo cambia si cambian sus coordenadas originales.
export function densifyPath(path, seedKey = '', segmentsPerLeg = 4, jitterKm = 0.05) {
  if (!path || path.length < 2) return path;
  const seedBase = hashSeed(seedKey);
  const out = [path[0]];
  for (let i = 0; i < path.length - 1; i++) {
    const [lat1, lon1] = path[i];
    const [lat2, lon2] = path[i + 1];
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const len = Math.hypot(dLat, dLon) || 1;
    const perpLat = -dLon / len;
    const perpLon = dLat / len;
    for (let s = 1; s <= segmentsPerLeg; s++) {
      const t = s / (segmentsPerLeg + 1);
      const seed = seedBase + i * 97 + s * 13.37;
      const rand = seededOffset(seed) * 2 - 1; // -1..1
      // El jitter se va a 0 en los extremos de cada tramo (sin(t*pi)) para que
      // los puntos originales de la ruta sigan conectando sin saltos.
      const jitterDeg = (jitterKm / 110.57) * rand * Math.sin(t * Math.PI);
      out.push([lat1 + dLat * t + perpLat * jitterDeg, lon1 + dLon * t + perpLon * jitterDeg]);
    }
    out.push(path[i + 1]);
  }
  return out;
}

function seededOffset(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Dado un destino [lat, lng] y la lista de rutas (con .endpoint y .destinations),
// devuelve las rutas ordenadas de más a menos relevantes para llegar a ese destino.
// Prioriza coincidencia de texto (p.ej. el usuario buscó "Huanchaco" y la ruta va a Huanchaco)
// y usa la distancia al punto final de la ruta como criterio de desempate/orden general.
export function rankRoutesForDestination(routes, destino) {
  if (!destino?.coords) return routes;

  const query = (destino.label || '').toLowerCase();

  const scored = routes.map((route) => {
    // Como ahora las rutas son recorridos largos (de un extremo de la ciudad al otro),
    // lo relevante es qué tan cerca pasa la ruta del destino en CUALQUIER punto de su
    // trazo, no solo en su parada final.
    const nearest = nearestPointOnPath(route.path, destino.coords);
    const distKm = nearest ? nearest.distKm : haversineKm(destino.coords, route.endpoint || route.path[route.path.length - 1]);
    const textMatch = (route.destinations || []).some(
      (d) => query.includes(d) || d.includes(query)
    );
    return { route, distKm, textMatch };
  });

  scored.sort((a, b) => {
    if (a.textMatch !== b.textMatch) return a.textMatch ? -1 : 1;
    return a.distKm - b.distKm;
  });

  return scored.map(({ route, distKm }, i) => ({
    ...route,
    fastest: i === 0,
    distKm: Math.round(distKm * 10) / 10,
  }));
}
