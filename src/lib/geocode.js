import { TRUJILLO_VIEWBOX } from '../data/mock';

// Busca una dirección o lugar real usando Nominatim (OpenStreetMap), acotado a Trujillo.
// Es un servicio público gratuito — por su política de uso no se debe golpear en cada
// tecla, por eso en Buscar.jsx esta función se llama con debounce (ver useEffect ahí).
export async function geocodeTrujillo(query) {
  const q = (query || '').trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    format: 'jsonv2',
    q: `${q}, Trujillo, La Libertad, Perú`,
    viewbox: TRUJILLO_VIEWBOX,
    bounded: '1',
    countrycodes: 'pe',
    limit: '5',
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: { 'Accept-Language': 'es' },
    });
    if (!res.ok) return [];
    const data = await res.json();

    return data.map((item) => ({
      id: `geo-${item.place_id}`,
      label: (item.name && item.name.trim()) || item.display_name.split(',')[0],
      address: item.display_name,
      coords: [parseFloat(item.lat), parseFloat(item.lon)],
    }));
  } catch {
    // Sin internet o el servicio no respondió: el buscador sigue funcionando
    // con los lugares locales (trujilloPlaces / guardados / recientes).
    return [];
  }
}
