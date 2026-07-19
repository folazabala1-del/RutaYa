import { useState } from 'react';
import TopBar from '../components/TopBar';

const faqs = [
  {
    q: '¿Cómo elijo un destino?',
    a: 'Toca "¿A dónde vas hoy?" en la pantalla principal, escribe el nombre del lugar o distrito, y elige un resultado. También puedes tocar "Trabajo" o "Casa" para ir directo a esos lugares guardados.',
  },
  {
    q: '¿Por qué no aparece mi ubicación en el mapa?',
    a: 'Tu navegador necesita permiso de ubicación. Revisa el ícono de candado 🔒 junto a la barra de direcciones y activa la ubicación para este sitio. En laptops sin GPS, la ubicación puede ser imprecisa.',
  },
  {
    q: '¿Cómo reporto una incidencia?',
    a: 'Desde el mapa de una ruta, toca "Reportar incidencia" y elige el tipo (tráfico, desvío, micro lleno, etc). Tu reporte ayuda a otros usuarios de esa ruta.',
  },
  {
    q: '¿Los reportes son anónimos?',
    a: 'Sí. Otros usuarios solo ven la ruta y el tipo de incidente, nunca quién lo reportó.',
  },
];

export default function CentroAyuda() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Centro de Ayuda" showBack />

      <div className="px-4 pt-4">
        <h2 className="font-display font-bold text-navy-900 text-sm mb-2">Preguntas frecuentes</h2>
        <div className="bg-white rounded-2xl shadow-card divide-y divide-slate-100 overflow-hidden mb-4">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-navy-900 pr-3">{f.q}</span>
                <span className="text-slate-300 shrink-0">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <p className="px-4 pb-3.5 text-xs text-slate-500 leading-relaxed">{f.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4">
          <h3 className="font-display font-bold text-navy-900 text-sm mb-1">¿No encontraste tu respuesta?</h3>
          <p className="text-xs text-slate-500 mb-3">Escríbenos y te ayudamos.</p>
          <a
            href="mailto:soporte@rutaya.pe"
            className="block w-full bg-navy-900 text-white text-center font-semibold text-sm py-3 rounded-xl"
          >
            ✉ Contactar soporte
          </a>
        </div>
      </div>
    </div>
  );
}
