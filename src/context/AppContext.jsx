import { createContext, useContext, useEffect, useState } from 'react';
import { savedPlaces as initialSaved, savedRoutes as initialRoutes } from '../data/mock';
import { registerUser, loginUser, createReport, updateProfile as apiUpdateProfile } from '../lib/api';

const AppContext = createContext(null);
const STORAGE_KEY = 'rutaya_session';

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userPos, setUserPos] = useState(null); // [lat, lng] real, o null si no se pudo obtener
  const [locationAccuracy, setLocationAccuracy] = useState(null); // metros de margen de error del GPS
  const [destino, setDestino] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [savedRoutesList, setSavedRoutesList] = useState(initialRoutes);
  const [placesList] = useState(initialSaved);
  const [reportCount, setReportCount] = useState(12);
  const [profileLoading, setProfileLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: "Micro 'Libertad' reportó tráfico", body: 'Congestión fuerte en Av. América Sur — considera otra ruta.', read: false, time: 'Hace 10 min' },
    { id: 'n2', title: 'Nueva ruta disponible', body: "Agregamos la ruta 'Nuevo California' cerca de tu zona.", read: false, time: 'Hace 2 h' },
    { id: 'n3', title: 'Tu reporte fue confirmado', body: "Gracias por reportar \"Micro lleno\" en Ruta AG.", read: true, time: 'Ayer' },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const { user: savedUser, token: savedToken } = JSON.parse(raw);
        setUser(savedUser);
        setToken(savedToken);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function persistSession(sessionUser, sessionToken) {
    setUser(sessionUser);
    setToken(sessionToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: sessionUser, token: sessionToken }));
  }

  async function login(dni, password) {
    setAuthLoading(true);
    try {
      const data = await loginUser({ dni, password });
      persistSession(data.user, data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  async function register(dni, password, name) {
    setAuthLoading(true);
    try {
      const data = await registerUser({ dni, password, name });
      persistSession(data.user, data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function removeSavedRoute(id) {
    setSavedRoutesList((prev) => prev.filter((r) => r.id !== id));
  }

  async function sendReport({ routeCode, incidentType, details }) {
    if (token) {
      try {
        await createReport(token, { routeCode, incidentType, details });
      } catch {
        // Si el backend falla, igual dejamos avanzar el flujo en el prototipo
      }
    }
    setReportCount((c) => c + 1);
  }

  async function updateProfile(name) {
    setProfileLoading(true);
    try {
      const data = await apiUpdateProfile(token, { name });
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser, token }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setProfileLoading(false);
    }
  }

  function markNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <AppContext.Provider
      value={{
        user, token, authLoading, login, register, logout,
        profileLoading, updateProfile,
        notifications, markNotificationRead, markAllNotificationsRead,
        locationEnabled, setLocationEnabled,
        userPos, setUserPos,
        locationAccuracy, setLocationAccuracy,
        destino, setDestino,
        selectedRoute, setSelectedRoute,
        savedRoutesList, removeSavedRoute,
        placesList,
        reportCount, sendReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
