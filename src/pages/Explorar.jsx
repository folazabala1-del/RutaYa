import { useNavigate } from 'react-router-dom';
import AppMap from '../components/AppMap';
import BottomNav from '../components/BottomNav';
import { TRUJILLO_CENTER } from '../data/mock';

export default function Explorar() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 relative">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur border-b border-slate-100">
        <button className="text-navy-900" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="font-display font-bold text-[15px] text-navy-900">Transporte Trujillo</h1>
        <button className="text-navy-900" onClick={() => navigate('/perfil')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <circle cx="12" cy="8" r="3.3" />
            <path d="M5 20c1.4-3.7 4.7-5 7-5s5.6 1.3 7 5" />
          </svg>
        </button>
      </header>

      <div className="absolute inset-0 z-0">
        <AppMap center={TRUJILLO_CENTER} zoom={15} userPos={TRUJILLO_CENTER} className="w-full h-full" />
      </div>

      <button
        onClick={() => navigate('/buscar')}
        className="absolute top-[68px] left-4 right-4 z-20 bg-white rounded-2xl shadow-card px-4 py-3.5 flex items-center gap-3 text-left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="w-5 h-5 shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span className="text-slate-400 text-sm flex-1">¿A dónde vas hoy?</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="w-5 h-5 shrink-0">
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M9 2v6M15 2v6" />
        </svg>
      </button>

      <div className="absolute bottom-24 left-4 right-4 z-20 flex gap-2">
        <QuickChip icon="💼" label="Trabajo" onClick={() => navigate('/buscar')} />
        <QuickChip icon="🏠" label="Casa" onClick={() => navigate('/buscar')} />
        <QuickChip icon="🕐" label="Recientes" onClick={() => navigate('/buscar')} />
      </div>

      <button
        className="absolute bottom-[104px] right-4 z-20 w-12 h-12 bg-navy-900 rounded-full shadow-card flex items-center justify-center text-white"
        aria-label="Centrar ubicación"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
}

function QuickChip({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-full px-3.5 py-2 text-xs font-semibold text-navy-900 shadow flex items-center gap-1.5 whitespace-nowrap">
      <span>{icon}</span> {label}
    </button>
  );
}
