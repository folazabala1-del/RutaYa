import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, showBack = false, onMenu }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-slate-100 sticky top-0 z-20">
      <button
        onClick={() => (showBack ? navigate(-1) : onMenu?.())}
        className="p-1 -ml-1 text-navy-900"
        aria-label={showBack ? 'Volver' : 'Menú'}
      >
        {showBack ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <h1 className="font-display font-bold text-[15px] text-navy-900">{title}</h1>
      <button className="p-1 -mr-1 text-navy-900" aria-label="Perfil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <circle cx="12" cy="8" r="3.3" />
          <path d="M5 20c1.4-3.7 4.7-5 7-5s5.6 1.3 7 5" />
        </svg>
      </button>
    </header>
  );
}
