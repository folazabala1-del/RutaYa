import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // Simulación para el prototipo: no hay pasarela de pago real conectada.
    setTimeout(() => {
      activatePremium();
      setProcessing(false);
      setView('done');
    }, 1200);
  }

  if (isPremium && view === 'compare') {
    return (
      <div className="screen bg-black text-white flex flex-col">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="text-white text-2xl leading-none">✕</button>
          <span className="flex items-center gap-1.5 font-display font-extrabold text-sm">
            RUTAYA <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">GOLD</span>
          </span>
          <span className="w-6" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-3xl mb-4">💎</div>
          <h2 className="font-display font-extrabold text-2xl">Ya eres RutaYa Gold</h2>
          <p className="text-sm text-slate-400 mt-2">Tienes acceso a mayor precisión, rutas ilimitadas y experiencia sin anuncios.</p>
          <button onClick={cancelPremium} className="mt-8 text-sm font-semibold text-red-400">
            Cancelar suscripción
          </button>
          <p className="text-[11px] text-slate-600 mt-2">(Demo del prototipo — no hay un cobro real que cancelar.)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen bg-black text-white">
      {view === 'compare' ? (
        <>
          <div className="flex items-center justify-between px-5 pt-6 pb-2">
            <span className="flex items-center gap-1.5 border border-amber-400/50 rounded-full px-3.5 py-1.5 text-amber-400 font-display font-bold text-sm">
              💎 PREMIUM
            </span>
            <button onClick={() => setView('plan')} className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full">
              Actualizar
            </button>
          </div>

          <div className="px-5 mt-6">
            <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-amber-400/10 via-black to-black p-5">
              <h1 className="font-display font-extrabold text-2xl mb-4">¿Qué incluye?</h1>
              <div className="flex justify-end gap-8 text-xs font-semibold text-slate-400 mb-1 pr-1">
                <span className="w-10 text-center">Gratis</span>
                <span className="w-10 text-center text-amber-400">Premium</span>
              </div>
              <div className="border-t border-white/10 mt-2">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-4 border-b border-white/10">
                    <div className="flex items-center gap-3 pr-2">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-sm">{f.label}</span>
                    </div>
                    <div className="flex gap-8 shrink-0">
                      <span className="w-10 flex justify-center text-slate-500">🔒</span>
                      <span className="w-10 flex justify-center">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">✓</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setView('plan')}
              className="mt-6 w-full bg-gradient-to-r from-amber-300 to-amber-500 text-black font-display font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              ✨ Ver todas las funciones <span>›</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between px-5 h-16">
            <button onClick={() => (view === 'plan' ? setView('compare') : setView('plan'))} className="text-white text-2xl leading-none">✕</button>
            <span className="flex items-center gap-1.5 font-display font-extrabold text-sm">
              RUTAYA <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">GOLD</span>
            </span>
            <span className="w-6" />
          </div>

          {(view === 'plan' || view === 'pay') && (
            <div className="px-5 pb-10">
              <h1 className="font-display font-extrabold text-[26px] leading-snug">
                Descubre nuevas rutas con RUTAYA <span className="text-amber-400">Gold™</span>.
              </h1>
              <p className="text-slate-400 text-sm mt-3">Más precisión en tiempo real, rutas guardadas sin límite y una experiencia sin anuncios.</p>

              <p className="text-base font-bold mt-7 mb-3">Selecciona un plan</p>
              <div className="w-full border-2 border-amber-400 rounded-2xl p-4 text-left relative">
                <span className="absolute top-4 right-4 text-amber-400 text-lg">✓</span>
                <span className="inline-block bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded-full mb-3">★ Popular</span>
                <p className="font-display font-extrabold text-2xl">1 MES</p>
                <div className="border-t border-white/15 my-3" />
                <p className="font-display font-extrabold text-3xl">S/ 5.00 <span className="text-base font-normal text-slate-400">/mes</span></p>
                <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-1.5">📅 Cobro mensual</p>
              </div>

              <p className="text-[11px] text-slate-500 mt-5 leading-relaxed">
                Al tocar en Continuar, tu suscripción se renovará automáticamente cada mes al mismo precio hasta que la canceles desde tu perfil.
                <br />
                <span className="text-slate-600">(Demo del prototipo: no hay una pasarela de pago real conectada, no se te cobrará dinero.)</span>
              </p>

              <button
                onClick={() => setView('pay')}
                className="mt-5 w-full bg-white text-black font-display font-extrabold py-4 rounded-full"
              >
                Continuar por S/ 5.00 en total
              </button>

              <div className="flex items-center gap-3 mt-6 text-xs text-slate-500">
                <div className="flex-1 border-t border-white/10" />
                Pagarás con
                <div className="flex-1 border-t border-white/10" />
              </div>
              <div className="flex gap-2.5 mt-3.5">
                <PayChip label="Tarjeta" node={<span className="text-base">💳</span>} />
                <PayChip label="Yape" node={<CircleBadge bg="#7C3AED">Y</CircleBadge>} />
                <PayChip label="Plin" node={<CircleBadge bg="#00BFC1">P</CircleBadge>} />
              </div>
            </div>
          )}

          {view === 'pay' && (
            <div className="fixed inset-0 bg-black/60 flex items-end z-30" onClick={() => setView('plan')}>
              <div className="bg-[#161616] w-full rounded-t-3xl p-6 pb-8" onClick={(e) => e.stopPropagation()}>
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <h3 className="font-display font-extrabold text-xl mb-4 leading-snug">Comienza por agregar una forma de pago</h3>

                <div className="flex flex-col gap-2.5">
                  <MethodRow label="Yape" node={<CircleBadge bg="#7C3AED">Y</CircleBadge>} active={method === 'yape'} onClick={() => setMethod('yape')} />
                  <MethodRow label="Plin" node={<CircleBadge bg="#00BFC1">P</CircleBadge>} active={method === 'plin'} onClick={() => setMethod('plin')} />
                  <MethodRow
                    label="Agregar tarjeta"
                    node={<span className="text-lg">💳</span>}
                    extra="VISA · Mastercard · UnionPay"
                    active={method === 'tarjeta'}
                    onClick={() => setMethod('tarjeta')}
                  />
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={!method || processing}
                  className="mt-6 w-full bg-amber-400 text-black font-display font-extrabold py-4 rounded-full disabled:opacity-40"
                >
                  {processing ? 'Procesando…' : 'Confirmar pago de S/ 5.00'}
                </button>
                <p className="text-[10px] text-slate-500 text-center mt-3">Demo del prototipo — ningún método de pago real es cobrado.</p>
              </div>
            </div>
          )}

          {view === 'done' && (
            <div className="px-6 pt-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-3xl mb-4">💎</div>
              <h2 className="font-display font-extrabold text-2xl">¡Ya eres RutaYa Gold!</h2>
              <p className="text-sm text-slate-400 mt-2">Disfruta de mayor precisión, rutas ilimitadas y cero anuncios.</p>
              <button onClick={() => navigate('/perfil')} className="mt-8 w-full bg-amber-400 text-black font-display font-extrabold py-4 rounded-full">
                Volver a mi perfil
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CircleBadge({ bg, children }) {
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold" style={{ background: bg }}>
      {children}
    </span>
  );
}

function PayChip({ label, node }) {
  return (
    <span className="flex-1 border border-white/15 rounded-xl py-3 text-center text-xs font-semibold flex items-center justify-center gap-1.5">
      {node} {label}
    </span>
  );
}

function MethodRow({ label, node, extra, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border ${active ? 'border-amber-400 bg-amber-400/10' : 'border-white/10'}`}
    >
      <span className="flex items-center gap-3 text-sm font-semibold">
        {node} {label}
      </span>
      <span className="flex items-center gap-2 text-slate-500">
        {extra && <span className="text-[10px] text-slate-500 hidden sm:inline">{extra}</span>}
        <span>›</span>
      </span>
    </button>
  );
}
