import { NavLink } from 'react-router-dom';

const items = [
  { to: '/explorar', label: 'Explorar', icon: ExploreIcon },
  { to: '/rutas', label: 'Rutas', icon: BusIcon },
  { to: '/guardados', label: 'Guardados', icon: BookmarkIcon },
  { to: '/perfil', label: 'Perfil', icon: UserIcon },
];

export default function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-[72px] px-2 z-30">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
              isActive ? 'text-amber-500' : 'text-slate-400'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span className="text-[11px] font-semibold">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function ExploreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5l-2 5-3-2 5-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M4 13h16M8 17v2M16 17v2" />
      <circle cx="8" cy="15" r="0" />
    </svg>
  );
}
function BookmarkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 4h12v16l-6-4-6 4V4z" />
    </svg>
  );
}
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" />
    </svg>
  );
}
