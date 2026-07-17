import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';

const iconMap = { home: '🏠', briefcase: '💼', cap: '🎓', bag: '🛍️' };

export default function Guardados() {
  const navigate = useNavigate();
  const { placesList, savedRoutesList, removeSavedRoute } = useApp();
  const [query, setQuery] = useState('');

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

        <div className="flex items-center justify-between mt-5 mb-2">
          <h3 className="font-display font-bold text-navy-900">Mis lugares favoritos</h3>
          <button className="text-xs font-bold text-amber-500">+ AGREGAR</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {placesList
            .filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center">{iconMap[p.icon]}</div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">{p.label}</p>
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

      <BottomNav />
    </div>
  );
}
