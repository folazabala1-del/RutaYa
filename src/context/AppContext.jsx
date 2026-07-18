import { createContext, useContext, useEffect, useState } from 'react';
import { savedPlaces as initialSaved, savedRoutes as initialRoutes } from '../data/mock';
import { registerUser, loginUser, createReport } from '../lib/api';

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

  return (
    <AppContext.Provider
      value={{
        user, token, authLoading, login, register, logout,
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
