import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { incidentTypes, routes } from '../data/mock';
import { useApp } from '../context/AppContext';

const iconEmoji = { traffic: '🚦', fork: '🔀', users: '👥', cone: '🚧', alert: '🚨', clock: '🕐' };

export default function ReportarIncidencia() {
  const navigate = useNavigate();
  const { selectedRoute, sendReport } = useApp();
  const route = selectedRoute || routes[2];
  const [selected, setSelected] = useState(null);
  const [detalle, setDetalle] = useState('');
  const [useLocation, setUseLocation] = useState(true);
  const [sent, setSent] = useState(false);

  async function enviar() {
    if (!selected) return;
    await sendReport({ routeCode: route.code, incidentType: selected, details: detalle });
    setSent(true);
    setTimeout(() => navigate(-1), 1400);
  }

  if (sent) {
    return (
      <div className="screen bg-white items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-4">✓</div>
        <h2 className="font-display font-extrabold text-xl text-navy-900">¡Reporte enviado!</h2>
        <p className="text-slate-400 text-sm mt-2">Gracias por ayudar a mejorar RutaYa para toda la comunidad.</p>
      </div>
    );
  }

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Reportar incidencia" showBack />

      <div className="px-4 pt-4">
        <p className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
          VEHÍCULO O RUTA
          <span className="text-amber-500 flex items-center gap-1">● EN RUTA</span>
        </p>
        <div className="bg-white rounded-2xl shadow-card p-3.5 flex items-center gap-3">
          <span className="bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded-lg">{route.code}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">{route.name}</p>
            <p className="text-xs text-slate-400">Vía: {route.hacia}</p>
          </div>
          <span className="text-slate-300">⌄</span>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-3.5 flex items-center justify-between mt-3">
          <span className="text-sm font-semibold text-navy-900 flex items-center gap-2">📍 Usar ubicación actual</span>
          <button
            onClick={() => setUseLocation((v) => !v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${useLocation ? 'bg-amber-500' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${useLocation ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        <p className="text-[11px] font-bold text-slate-400 mt-5 mb-2">TIPO DE INCIDENCIA</p>
        <div className="grid grid-cols-2 gap-3">
          {incidentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-colors ${
                selected === t.id ? 'border-amber-400 bg-amber-50' : 'border-slate-100 bg-white'
              }`}
            >
              <span className="text-2xl">{iconEmoji[t.icon]}</span>
              <span className="text-xs font-semibold text-navy-900 text-center">{t.label}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] font-bold text-slate-400 mt-5 mb-2">DETALLES ADICIONALES (OPCIONAL)</p>
        <textarea
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Describe brevemente lo ocurrido..."
          rows={3}
          className="w-full bg-white rounded-2xl shadow-card p-3.5 text-sm outline-none resize-none placeholder:text-slate-400"
        />

        <button
          onClick={enviar}
          disabled={!selected}
          className={`w-full font-display font-bold py-3.5 rounded-2xl mt-5 flex items-center justify-center gap-2 transition-colors ${
            selected ? 'bg-navy-900 text-white active:scale-[0.98]' : 'bg-slate-200 text-slate-400'
          }`}
        >
          ➤ Enviar reporte
        </button>
      </div>
    </div>
  );
}
