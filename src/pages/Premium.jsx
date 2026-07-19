import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';

const features = [
  { icon: '🎯', label: 'Mayor precisión en tiempo real' },
  { icon: '🚌', label: 'Alertas de tu micro antes que nadie' },
  { icon: '📁', label: 'Rutas guardadas ilimitadas' },
  { icon: '🚫', label: 'Experiencia sin anuncios' },
];

export default function Premium() {
  const navigate = useNavigate();
  const { isPremium, activatePremium, cancelPremium } = useApp();
  const [view, setView] = useState('compare'); // compare -> plan -> pay -> done
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  function confirmPayment() {
    setProcessing(true);
    // Simulación: no hay pasarela de pago real conectada, solo activa el estado.
    setTimeout(() => {
      activatePremium();
      setProcessing(false);
      setView('done');
    }, 1200);
  }

  if (isPremium && view === 'compare') {
    return (
      <div className="screen bg-slate-50">
        <TopBar title="RutaYa Gold" showBack />
        <div className="px-4 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-3xl mb-3">💎</div>
          <h2 className="font-display font-extrabold text-xl text-navy-900">Ya eres RutaYa Gold</h2>
          <p className="text-sm text-slate-500 mt-2">Tienes acceso a mayor precisión, rutas ilimitadas y experiencia sin anuncios.</p>
          <button
            onClick={cancelPremium}
            className="mt-8 text-sm font-semibold text-red-500"
          >
            Cancelar suscripción
          </button>
          <p className="text-[11px] text-slate-400 mt-2">(Demo del prototipo — no hay un cobro real que cancelar.)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen bg-navy-900 text-white">
      <div className="flex items-center justify-between px-4 h-14">
        <button onClick={() => (view === 'compare' ? navigate(-1) : setView('compare'))} className="text-white text-xl">
          {view === 'compare' ? '✕' : '‹'}
        </button>
        <span className="flex items-center gap-1.5 font-display font-bold text-sm">
          RUTAYA <span className="bg-amber-400 text-navy-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">GOLD</span>
        </span>
        <span className="w-5" />
      </div>

      {view === 'compare' && (
        <div className="px-5 pt-2 pb-10">
          <h1 className="font-display font-extrabold text-2xl leading-snug">
            Descubre nuevas rutas con RUTAYA <span className="text-amber-400">Gold™</span>.
          </h1>
          <p className="text-slate-300 text-sm mt-3">Más precisión en tiempo real, rutas guardadas sin límite y una experiencia sin anuncios.</p>

          <div className="flex items-center justify-between mt-6 mb-2 px-1">
            <span className="text-sm font-bold">¿Qué incluye?</span>
            <div className="flex gap-6 text-xs font-semibold">
              <span className="text-slate-400 w-14 text-center">Gratis</span>
              <span className="text-amber-400 w-14 text-center">Premium</span>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-t border-white/10">
            {features.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-sm">{f.label}</span>
                </div>
                <div className="flex gap-6">
                  <span className="w-14 flex justify-center text-slate-500">🔒</span>
                  <span className="w-14 flex justify-center">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-navy-900 flex items-center justify-center text-xs font-bold">✓</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setView('plan')}
            className="mt-8 w-full bg-amber-400 text-navy-900 font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            ✨ Ver planes
          </button>
        </div>
      )}

      {view === 'plan' && (
        <div className="px-5 pt-2 pb-10">
          <h1 className="font-display font-extrabold text-2xl leading-snug">
            Descubre nuevas rutas con RUTAYA <span className="text-amber-400">Gold™</span>.
          </h1>
          <p className="text-slate-300 text-sm mt-3">Más precisión en tiempo real, rutas guardadas sin límite y una experiencia sin anuncios.</p>

          <p className="text-sm font-bold mt-6 mb-2">Selecciona un plan</p>
          <button
            onClick={() => setView('pay')}
            className="w-full border-2 border-amber-400 rounded-2xl p-4 text-left relative bg-amber-400/5"
          >
            <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-navy-900 flex items-center justify-center text-xs">✓</span>
            <span className="inline-block bg-amber-400 text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">★ Popular</span>
            <p className="font-display font-extrabold text-xl">1 MES</p>
            <div className="border-t border-white/10 my-2" />
            <p className="font-display font-extrabold text-2xl">S/ 5.00 <span className="text-sm font-normal text-slate-400">/mes</span></p>
            <p className="text-xs text-slate-400 mt-1">📅 Cobro mensual</p>
          </button>

          <p className="text-[11px] text-slate-400 mt-5 leading-relaxed">
            Esta es una simulación para el prototipo: no hay una pasarela de pago real conectada, así que no se te cobrará dinero de verdad.
          </p>

          <button
            onClick={() => setView('pay')}
            className="mt-5 w-full bg-white text-navy-900 font-display font-bold py-4 rounded-2xl"
          >
            Continuar por S/ 5.00 en total
          </button>

          <div className="flex items-center gap-3 mt-5 text-xs text-slate-400">
            <div className="flex-1 border-t border-white/10" />
            Pagarás con
            <div className="flex-1 border-t border-white/10" />
          </div>
          <div className="flex gap-2 mt-3">
            <PayChip label="Tarjeta" icon="💳" />
            <PayChip label="Yape" icon="🟣" />
            <PayChip label="Plin" icon="🔵" />
          </div>
        </div>
      )}

      {view === 'pay' && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-30" onClick={() => setView('plan')}>
          <div className="bg-[#141414] w-full rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
            <h3 className="font-display font-bold text-lg mb-4">Comienza por agregar una forma de pago</h3>

            <div className="flex flex-col gap-2.5">
              <MethodRow label="Yape" icon="🟣" active={method === 'yape'} onClick={() => setMethod('yape')} />
              <MethodRow label="Plin" icon="🔵" active={method === 'plin'} onClick={() => setMethod('plin')} />
              <MethodRow label="Agregar tarjeta" icon="💳" active={method === 'tarjeta'} onClick={() => setMethod('tarjeta')} />
            </div>

            <button
              onClick={confirmPayment}
              disabled={!method || processing}
              className="mt-6 w-full bg-amber-400 text-navy-900 font-display font-bold py-4 rounded-2xl disabled:opacity-40"
            >
              {processing ? 'Procesando…' : 'Confirmar pago de S/ 5.00'}
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-3">Demo del prototipo — ningún método de pago real es cobrado.</p>
          </div>
        </div>
      )}

      {view === 'done' && (
        <div className="px-5 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-3xl mb-3">💎</div>
          <h2 className="font-display font-extrabold text-xl">¡Ya eres RutaYa Gold!</h2>
          <p className="text-sm text-slate-300 mt-2">Disfruta de mayor precisión, rutas ilimitadas y cero anuncios.</p>
          <button onClick={() => navigate('/perfil')} className="mt-8 w-full bg-amber-400 text-navy-900 font-display font-bold py-4 rounded-2xl">
            Volver a mi perfil
          </button>
        </div>
      )}
    </div>
  );
}

function PayChip({ label, icon }) {
  return (
    <span className="flex-1 border border-white/15 rounded-xl py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
      <span>{icon}</span> {label}
    </span>
  );
}

function MethodRow({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border ${active ? 'border-amber-400 bg-amber-400/10' : 'border-white/10'}`}
    >
      <span className="flex items-center gap-3 text-sm font-semibold">
        <span className="text-lg">{icon}</span> {label}
      </span>
      <span className="text-slate-400">›</span>
    </button>
  );
}
