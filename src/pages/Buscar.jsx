import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { savedPlaces, recentPlaces, trujilloPlaces } from '../data/mock';
import { geocodeTrujillo } from '../lib/geocode';
import { useApp } from '../context/AppContext';

const iconMap = { home: '🏠', briefcase: '💼', cap: '🎓', bag: '🛍️' };

export default function Buscar() {
  const [query, setQuery] = useState('');
  const [geoResults, setGeoResults] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const navigate = useNavigate();
  const { setDestino } = useApp();

  function pick(place) {
    setDestino(place);
    navigate('/rutas');
  }

  const q = query.trim().toLowerCase();

  // Coincidencias locales (lugares guardados, recientes y frecuentes de Trujillo) —
  // aparecen al instante mientras el usuario escribe, sin depender de la red.
  const localMatches =
    q.length === 0
      ? []
      : [...savedPlaces, ...recentPlaces, ...trujilloPlaces]
          .filter((p) => p.label.toLowerCase().includes(q) || p.address.toLowerCase().includes(q))
          .filter((p, i, arr) => arr.findIndex((x) => x.label === p.label) === i)
          .slice(0, 6);

  // Búsqueda real (geocodificación) con debounce: si lo que escribió el usuario no
  // aparece en la lista local, buscamos la dirección real en Trujillo vía OpenStreetMap.
  useEffect(() => {
    if (q.length < 3) {
      setGeoResults([]);
      return;
    }
    setLoadingGeo(true);
    const timer = setTimeout(async () => {
      const results = await geocodeTrujillo(q);
      setGeoResults(results);
      setLoadingGeo(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  const showResults = q.length > 0;
  const noResults = showResults && !loadingGeo && localMatches.length === 0 && geoResults.length === 0;

  const filteredRecents = recentPlaces.filter((p) => p.label.toLowerCase().includes(q));

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Transporte Trujillo" showBack />

      <div className="px-4 pt-5 pb-2">
        <h2 className="font-display font-extrabold text-2xl text-navy-900">¿A dónde vas?</h2>
        <p className="text-slate-400 text-sm mt-1">Encuentra la mejor ruta para tu viaje.</p>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Origen</p>
            <p className="text-sm font-semibold text-blue-600">Tu ubicación actual</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-500 shrink-0">📍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Hacia dónde te diriges? (ej. Huanchaco, El Porvenir...)"
            className="flex-1 text-sm font-semibold text-navy-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
            autoFocus
          />
          {loadingGeo && <span className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin shrink-0" />}
        </div>
      </div>

      {showResults ? (
        <div className="px-4 mt-4">
          <h3 className="mb-2 font-display font-bold text-navy-900">Resultados</h3>
          {[...localMatches, ...geoResults]
            .filter((p, i, arr) => arr.findIndex((x) => x.label === p.label) === i)
            .map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className="w-full mt-2 bg-white rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left"
              >
                <span className="text-amber-500 shrink-0">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{p.label}</p>
                  <p className="text-xs text-slate-400 truncate">{p.address}</p>
                </div>
                <span className="text-slate-300">›</span>
              </button>
            ))}
          {noResults && (
            <p className="text-sm text-slate-400 text-center mt-6">
              No encontramos "{query}" en Trujillo. Prueba con el nombre de una calle, distrito o lugar conocido.
            </p>
          )}
        </div>
      ) : (
        <>
          <h3 className="px-4 mt-6 mb-2 font-display font-bold text-navy-900">Lugares guardados</h3>
          <div className="px-4 grid grid-cols-2 gap-3">
            {savedPlaces.slice(0, 2).map((p) => (
              <button key={p.id} onClick={() => pick(p)} className="bg-white rounded-2xl shadow-card p-4 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center text-lg">{iconMap[p.icon]}</div>
                <span className="text-sm font-semibold text-navy-900">{p.label}</span>
              </button>
            ))}
          </div>

          {savedPlaces.slice(2).map((p) => (
            <button key={p.id} onClick={() => pick(p)} className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">{iconMap[p.icon]}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">{p.label}</p>
                <p className="text-xs text-slate-400">{p.address}</p>
              </div>
            </button>
          ))}

          <h3 className="px-4 mt-6 mb-2 font-display font-bold text-navy-900">Lugares recientes</h3>
          {filteredRecents.map((p) => (
            <button key={p.id} onClick={() => pick(p)} className="mx-4 mt-2 bg-white rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left">
              <span className="text-slate-400">🕐</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">{p.label}</p>
                <p className="text-xs text-slate-400">{p.address}</p>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
