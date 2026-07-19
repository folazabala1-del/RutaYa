import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 1400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between bg-gradient-to-b from-[#EAF1FB] to-white px-8 py-16 relative overflow-hidden">
      <div className="absolute -top-10 -right-16 w-56 h-56 rounded-full bg-[#DCE8FA]" />
      <div className="absolute bottom-24 -left-20 w-64 h-64 rounded-full bg-[#EEF2F9]" />

      <div className="w-full flex justify-end relative z-10">
        <BusBadge />
      </div>

      <div className="flex flex-col items-center gap-4 relative z-10 animate-fadeUp">
        <Logo className="w-36 h-36" />
        <div className="text-center">
          <h1 className="font-display font-extrabold text-3xl text-navy-900 leading-none">
            Ruta<span className="text-amber-500">Ya</span>
          </h1>
          <p className="tracking-[0.3em] text-xs font-bold text-navy-900 mt-1">TRUJILLO</p>
          <p className="text-[10px] text-slate-400 tracking-wide mt-0.5">
            SABER TU RUTA, TE LLEVA <span className="text-amber-500 font-semibold">MÁS LEJOS</span>
          </p>
        </div>
        <p className="text-slate-500 text-sm">Tu ciudad, tus rutas, en tiempo real.</p>
      </div>

      <div className="w-full relative z-10">
        <div className="h-[2px] bg-amber-500 w-full mb-4 rounded-full" />
        <p className="text-center text-[10px] tracking-widest text-slate-400 font-semibold">IMPULSADO POR</p>
        <p className="text-center text-sm font-semibold text-navy-900">Municipalidad Provincial de Trujillo</p>
      </div>
    </div>
  );
}

function BusBadge() {
  return (
    <div className="w-14 h-14 rounded-2xl bg-slate-200/70 flex items-center justify-center text-slate-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M4 10h16M8 16v2M16 16v2" />
      </svg>
    </div>
  );
}

export function Logo({ className }) {
  return (
    <div className={`${className} rounded-full border-[3px] border-navy-900 overflow-hidden bg-white flex items-center justify-center relative`}>
      <img src="/logo.png" alt="RutaYa Trujillo" className="w-full h-full object-cover" />
    </div>
  );
}
