import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { trujilloPlaces } from '../data/mock';
import { geocodeTrujillo } from '../lib/geocode';
import { useApp } from '../context/AppContext';

const iconMap = { home: '🏠', briefcase: '💼', cap: '🎓', bag: '🛍️', pin: '📍' };

export default function Guardados() {
  const navigate = useNavigate();
  const {
    placesList, removePlace, addPlace, canAddPlace, addedPlacesCount, FREE_PLACE_LIMIT, isPremium,
    savedRoutesList, removeSavedRoute,
  } = useApp();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  function handleAddClick() {
    if (!canAddPlace) {
      setShowAdd('limit');
      return;
    }
    setShowAdd('search');
  }

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Transporte Trujillo" showBack />

      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-2">
          <span className="text-slate-400">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en mis guardados"
            className="flex-1 text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-between mt-5 mb-1">
          <h3 className="font-display font-bold text-navy-900">Mis lugares favoritos</h3>
          <button onClick={handleAddClick} className="text-xs font-bold text-amber-500">+ AGREGAR</button>
        </div>
        {!isPremium && (
          <p className="text-[11px] text-slate-400 mb-2">
            {addedPlacesCount}/{FREE_PLACE_LIMIT} lugar agregado en el plan gratis · <button onClick={() => navigate('/perfil/premium')} className="text-amber-500 font-semibold">hazte Gold para ilimitados</button>
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {placesList
            .filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-2 relative">
                {p.custom && (
                  <button
                    onClick={() => removePlace(p.id)}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                )}
                <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center">{iconMap[p.icon] || '📍'}</div>
                <div>
                  <p className="text-sm font-semibold text-navy-900 pr-4">{p.label}</p>
                  <p className="text-xs text-slate-400 truncate">{p.address}</p>
                </div>
              </div>
            ))}
        </div>

        <h3 className="font-display font-bold text-navy-900 mt-6 mb-2">Rutas guardadas</h3>
        <div className="flex flex-col gap-4">
          {savedRoutesList.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-[#DCEBFA] to-[#EAF2FB] flex items-center justify-center text-slate-400 text-xs">
                mapa de la ruta
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-lg">{r.badge}</span>
                  <span className={`text-[10px] font-bold ${r.live ? 'text-amber-500' : 'text-slate-400'}`}>
                    {r.live && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-1 pulse-dot" />}
                    {r.savedLabel}
                  </span>
                </div>
                <p className="font-display font-bold text-navy-900">{r.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">🕐 {r.avgTime} min de viaje promedio</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => removeSavedRoute(r.id)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">🗑</button>
                  <button onClick={() => navigate('/mapa-en-vivo')} className="flex-1 bg-navy-900 text-white text-sm font-semibold py-2.5 rounded-xl">Ver ruta</button>
                </div>
              </div>
            </div>
          ))}
          {savedRoutesList.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">No tienes rutas guardadas todavía.</p>
          )}
        </div>
      </div>

      {showAdd === 'search' && <AddPlaceModal onClose={() => setShowAdd(false)} onAdd={addPlace} />}
      {showAdd === 'limit' && <LimitModal onClose={() => setShowAdd(false)} onUpgrade={() => navigate('/perfil/premium')} />}

      <BottomNav />
    </div>
  );
}

function AddPlaceModal({ onClose, onAdd }) {
  const [q, setQ] = useState('');
  const [geoResults, setGeoResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = q.trim().toLowerCase();

  const localMatches =
    query.length === 0
      ? []
      : trujilloPlaces.filter((p) => p.label.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)).slice(0, 6);

  useEffect(() => {
    if (query.length < 3) {
      setGeoResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      setGeoResults(await geocodeTrujillo(query));
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  function pick(place) {
    onAdd({ label: place.label, address: place.address, coords: place.coords });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-30 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-3xl p-5 max-h-[75vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
        <h3 className="font-display font-bold text-navy-900 mb-3">Agregar lugar favorito</h3>
        <div className="bg-slate-50 rounded-xl px-3.5 py-3 flex items-center gap-2 mb-3">
          <span className="text-slate-400">🔍</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre del lugar, distrito o dirección"
            className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent"
          />
          {loading && <span className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin shrink-0" />}
        </div>
        <div className="overflow-y-auto flex-1">
          {[...localMatches, ...geoResults]
            .filter((p, i, arr) => arr.findIndex((x) => x.label === p.label) === i)
            .map((p) => (
              <button key={p.id} onClick={() => pick(p)} className="w-full flex items-center gap-3 py-3 border-b border-slate-100 text-left">
                <span className="text-amber-500">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{p.label}</p>
                  <p className="text-xs text-slate-400 truncate">{p.address}</p>
                </div>
              </button>
            ))}
          {query.length > 0 && !loading && localMatches.length === 0 && geoResults.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-6">No encontramos "{q}" en Trujillo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LimitModal({ onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-30 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-3xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mx-auto mb-3">💎</div>
        <h3 className="font-display font-bold text-navy-900 mb-1">Ya usaste tu lugar favorito gratis</h3>
        <p className="text-sm text-slate-500 mb-5">El plan gratis permite guardar 1 lugar favorito. Hazte RutaYa Gold para guardar lugares ilimitados.</p>
        <button onClick={onUpgrade} className="w-full bg-navy-900 text-white font-display font-bold py-3.5 rounded-2xl mb-2">
          💎 Ver RutaYa Gold
        </button>
        <button onClick={onClose} className="w-full text-slate-400 text-sm font-semibold py-2">
          Ahora no
        </button>
      </div>
    </div>
  );
}
