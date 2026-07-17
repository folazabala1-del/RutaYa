import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, logout, reportCount, savedRoutesList } = useApp();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Transporte Trujillo" showBack />

      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-[#DCEBFA] via-[#EDE3F5] to-[#FBE9D6] rounded-3xl p-5 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-3xl relative">
            🧑
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs">✎</span>
          </div>
          <h2 className="font-display font-extrabold text-lg text-navy-900 mt-3">{user?.name || 'Usuario RutaYa'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">DNI: {user?.dni || '74218903'}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">📍 Trujillo, Perú</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className="text-amber-500 text-xl">⚠</p>
            <p className="font-display font-extrabold text-xl text-navy-900">{reportCount}</p>
            <p className="text-xs text-slate-400">Reportes enviados</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className="text-navy-900 text-xl">🔖</p>
            <p className="font-display font-extrabold text-xl text-navy-900">{savedRoutesList.length}</p>
            <p className="text-xs text-slate-400">Rutas guardadas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card mt-4 divide-y divide-slate-100 overflow-hidden">
          <MenuRow icon="✎" label="Editar perfil" />
          <MenuRow icon="🔒" label="Privacidad" />
          <MenuRow icon="🔔" label="Notificaciones" badge={3} />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-500 font-semibold text-sm">
            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">⎋</span>
            Cerrar sesión
          </button>
        </div>

        <p className="text-[11px] font-bold text-slate-400 mt-5 mb-2 tracking-wide">SOPORTE Y AYUDA</p>
        <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">❓</span>
          <div>
            <p className="text-sm font-semibold text-navy-900">Centro de Ayuda</p>
            <p className="text-xs text-slate-400">Preguntas frecuentes y soporte técnico</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function MenuRow({ icon, label, badge }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-navy-900">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-navy-900">{label}</span>
      {badge && <span className="bg-amber-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>}
      <span className="text-slate-300">›</span>
    </button>
  );
}
