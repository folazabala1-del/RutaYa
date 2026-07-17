import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LocationPermission() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setLocationEnabled } = useApp();

  function handleAllow() {
    if (step === 1) {
      setStep(2);
      return;
    }
    setLocationEnabled(true);
    navigate('/login');
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {step === 1 ? (
        <div className="flex-1 flex flex-col px-7 pt-14 pb-10 animate-fadeUp">
          <div className="rounded-3xl bg-gradient-to-b from-[#E3ECFB] to-[#F3F6FC] h-40 relative flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-navy-900 flex items-center justify-center text-white">
              <PinIcon className="w-7 h-7" />
            </div>
            <span className="absolute top-3 right-4 w-9 h-9 rounded-2xl bg-amber-400 flex items-center justify-center">📍</span>
            <span className="absolute bottom-3 left-4 w-9 h-9 rounded-2xl bg-white shadow flex items-center justify-center">〰️</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-navy-900 text-center">Activa tu ubicación</h2>
          <p className="text-slate-500 text-sm text-center mt-3 leading-relaxed">
            Necesitamos acceder a tu ubicación en tiempo real para encontrar rutas <b className="text-navy-900">cercanas</b> y rastrear el bus exacto hacia tu destino.
          </p>
          <button
            onClick={handleAllow}
            className="mt-8 w-full bg-navy-900 text-white font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            Permitir ubicación <span>→</span>
          </button>
          <div className="mt-4 bg-slate-50 rounded-2xl p-3 flex items-center gap-2 text-xs text-slate-500">
            🛡️ Tus datos están cifrados y solo se usan mientras la app esté activa.
          </div>
          <button onClick={handleAllow} className="text-center text-xs font-bold text-slate-500 tracking-wide mt-5">
            CONFIGURAR MANUALMENTE
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-end animate-fadeUp">
          <div className="flex-1 bg-slate-200" />
          <div className="bg-white rounded-t-3xl px-6 pt-6 pb-8 -mt-6 relative z-10">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-white mb-2 pulse-dot">
                <TargetIcon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold bg-amber-900/10 text-amber-600 px-2 py-1 rounded-full">⚠ REQUERIDO</span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-navy-900 text-center">Mejorar precisión</h2>
            <p className="text-slate-500 text-sm text-center mt-2">
              Para continuar, el dispositivo necesita usar la ubicación y la precisión de ubicación.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-3 mt-4 text-xs text-slate-600 flex gap-2">
              <span>ℹ️</span>
              <span>Esta aplicación requiere acceso preciso al GPS para calcular rutas de transporte en tiempo real y mostrar paraderos cercanos.</span>
            </div>
            <button
              onClick={handleAllow}
              className="mt-5 w-full bg-navy-900 text-white font-display font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
            >
              Activar →
            </button>
            <button onClick={handleAllow} className="w-full border border-slate-200 text-navy-900 font-semibold py-3.5 rounded-2xl mt-2.5">
              Abrir configuración
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">¿Por qué es necesario?</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  );
}
function TargetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
