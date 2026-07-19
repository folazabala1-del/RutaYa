import TopBar from '../components/TopBar';
import { useApp } from '../context/AppContext';

export default function Notificaciones() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="screen bg-slate-50">
      <TopBar title="Notificaciones" showBack />

      <div className="px-4 pt-4">
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-amber-600 mb-3">
            Marcar todas como leídas
          </button>
        )}

        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`w-full text-left bg-white rounded-2xl shadow-card p-4 flex gap-3 items-start ${n.read ? 'opacity-60' : ''}`}
            >
              {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />}
              <div className={n.read ? '' : 'flex-1'}>
                <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
              </div>
            </button>
          ))}

          {notifications.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-10">No tienes notificaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
}
