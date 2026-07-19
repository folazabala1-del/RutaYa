import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import LocationPermission from './pages/LocationPermission';
import Login from './pages/Login';
import Explorar from './pages/Explorar';
import Buscar from './pages/Buscar';
import Rutas from './pages/Rutas';
import MapaEnVivo from './pages/MapaEnVivo';
import ReportarIncidencia from './pages/ReportarIncidencia';
import Guardados from './pages/Guardados';
import Perfil from './pages/Perfil';
import EditarPerfil from './pages/EditarPerfil';
import Privacidad from './pages/Privacidad';
import Notificaciones from './pages/Notificaciones';
import CentroAyuda from './pages/CentroAyuda';

function RequireAuth({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/permisos" element={<LocationPermission />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explorar" element={<RequireAuth><Explorar /></RequireAuth>} />
      <Route path="/buscar" element={<RequireAuth><Buscar /></RequireAuth>} />
      <Route path="/rutas" element={<RequireAuth><Rutas /></RequireAuth>} />
      <Route path="/mapa-en-vivo" element={<RequireAuth><MapaEnVivo /></RequireAuth>} />
      <Route path="/reportar" element={<RequireAuth><ReportarIncidencia /></RequireAuth>} />
      <Route path="/guardados" element={<RequireAuth><Guardados /></RequireAuth>} />
      <Route path="/perfil" element={<RequireAuth><Perfil /></RequireAuth>} />
      <Route path="/perfil/editar" element={<RequireAuth><EditarPerfil /></RequireAuth>} />
      <Route path="/perfil/privacidad" element={<RequireAuth><Privacidad /></RequireAuth>} />
      <Route path="/perfil/notificaciones" element={<RequireAuth><Notificaciones /></RequireAuth>} />
      <Route path="/perfil/ayuda" element={<RequireAuth><CentroAyuda /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="app-shell">
          <AppRoutes />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
