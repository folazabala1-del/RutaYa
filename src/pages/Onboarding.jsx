import { useNavigate } from 'react-router-dom';
import { Logo } from './Splash';

export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col px-7 py-12 bg-white">
      <div className="flex flex-col items-center gap-4 animate-fadeUp">
        <Logo className="w-24 h-24" />
        <div className="text-center">
          <h1 className="font-display font-extrabold text-2xl text-navy-900">
            Ruta<span className="text-amber-500">Ya</span>
          </h1>
          <p className="tracking-[0.3em] text-[10px] font-bold text-navy-900">TRUJILLO</p>
        </div>
      </div>

      <div className="mt-10 text-center animate-fadeUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="font-display font-extrabold text-2xl text-navy-900 leading-snug">
          Encuentra qué micro tomar, cuánto falta y por dónde pasa.
        </h2>
        <p className="text-slate-500 text-sm mt-3">
          Tu guía inteligente para moverte por Trujillo con rapidez y precisión.
        </p>
      </div>

      <button
        onClick={() => navigate('/permisos')}
        className="mt-10 w-full bg-navy-900 text-white font-display font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
      >
        Empezar
      </button>

      <div className="flex items-center justify-center gap-4 mt-4 text-[11px] font-semibold text-slate-500">
        <span className="flex items-center gap-1">⚡ TIEMPO REAL</span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">🚌 TODAS LAS RUTAS</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">🗺️</div>
          <p className="font-semibold text-sm text-navy-900">Mapa en vivo</p>
        </div>
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-amber-400">🕐</div>
          <p className="font-semibold text-sm text-navy-900">Horarios precisos</p>
        </div>
      </div>

      <p className="text-center text-[10px] tracking-widest text-slate-400 font-semibold mt-auto pt-8">
        TRUJILLO • MOVILIDAD INTELIGENTE
      </p>
    </div>
  );
}
