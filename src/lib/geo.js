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

// Dado un destino [lat, lng] y la lista de rutas (con .endpoint y .destinations),
// devuelve las rutas ordenadas de más a menos relevantes para llegar a ese destino.
// Prioriza coincidencia de texto (p.ej. el usuario buscó "Huanchaco" y la ruta va a Huanchaco)
// y usa la distancia al punto final de la ruta como criterio de desempate/orden general.
export function rankRoutesForDestination(routes, destino) {
  if (!destino?.coords) return routes;

  const query = (destino.label || '').toLowerCase();

  const scored = routes.map((route) => {
    const distKm = haversineKm(destino.coords, route.endpoint || route.path[route.path.length - 1]);
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
