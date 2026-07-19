import TopBar from '../components/TopBar';

const sections = [
  {
    title: 'Qué datos guardamos',
    body: 'Tu DNI y nombre para identificar tu cuenta, y los reportes de incidencias que envías (ruta, tipo de incidente y detalles). Tu contraseña nunca se guarda en texto plano: se guarda cifrada.',
  },
  {
    title: 'Tu ubicación',
    body: 'Usamos el GPS de tu navegador solo mientras usas la app, para mostrarte tu posición en el mapa y calcular a qué paradero caminar. No guardamos un historial de tus ubicaciones.',
  },
  {
    title: 'Con quién compartimos datos',
    body: 'No vendemos ni compartimos tus datos con terceros. Los reportes de incidencias son anónimos para otros usuarios: solo se muestra la ruta y el tipo de incidente, no quién lo reportó.',
  },
  {
    title: 'Eliminar tu cuenta',
    body: 'Si quieres eliminar tu cuenta y tus datos, escríbenos desde el Centro de Ayuda y lo procesamos en un plazo de 48 horas.',
  },
];

export default function Privacidad() {
  return (
    <div className="screen bg-slate-50">
      <TopBar title="Privacidad" showBack />

      <div className="px-4 pt-4 flex flex-col gap-3">
        {sections.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl shadow-card p-4">
            <h3 className="font-display font-bold text-navy-900 text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
