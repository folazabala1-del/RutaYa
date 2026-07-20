import { createContext, useContext, useEffect, useState } from 'react';
import { savedPlaces as initialSaved, savedRoutes as initialRoutes, routes as allBusRoutes } from '../data/mock';
import { registerUser, loginUser, createReport, getMyReports, updateProfile as apiUpdateProfile } from '../lib/api';
import { resolveAllRoutePaths } from '../lib/osrm';

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
  const [placesList, setPlacesList] = useState(initialSaved);
  const FREE_PLACE_LIMIT = 1;
  const [reportCount, setReportCount] = useState(12);
  const [profileLoading, setProfileLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: "Micro 'Libertad' reportó tráfico", body: 'Congestión fuerte en Av. América Sur — considera otra ruta.', read: false, time: 'Hace 10 min' },
    { id: 'n2', title: 'Nueva ruta disponible', body: "Agregamos la ruta 'Nuevo California' cerca de tu zona.", read: false, time: 'Hace 2 h' },
    { id: 'n3', title: 'Tu reporte fue confirmado', body: "Gracias por reportar \"Micro lleno\" en Ruta AG.", read: true, time: 'Ayer' },
  ]);

  const [streetPaths, setStreetPaths] = useState({}); // { routeId: [[lat,lng], ...] } — trazo real por calles
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('rutaya_premium') === '1');

  useEffect(() => {
    resolveAllRoutePaths(allBusRoutes, (id, path) => {
      setStreetPaths((prev) => ({ ...prev, [id]: path }));
    });
  }, []);

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

  useEffect(() => {
    if (!token) return;
    getMyReports(token)
      .then((data) => setReportCount(data.count))
      .catch(() => {
        // Si falla (backend caído, sin red), dejamos el contador local tal cual.
      });
  }, [token]);

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

  function addSavedRoute(route, destinoLabel) {
    const alreadySaved = savedRoutesList.some((r) => r.routeId === route.id && r.destinoLabel === destinoLabel);
    if (alreadySaved) return { ok: false, error: 'Ya guardaste esta ruta.' };
    const entry = {
      id: `saved-${Date.now()}`,
      routeId: route.id,
      destinoLabel,
      badge: route.code,
      title: destinoLabel ? `${route.name.replace(/^Micro |^Combi /, '')} → ${destinoLabel}` : route.hacia,
      avgTime: route.time,
      live: route.live,
      savedLabel: 'GUARDADO AHORA',
    };
    setSavedRoutesList((prev) => [entry, ...prev]);
    return { ok: true };
  }

  function isRouteSaved(route, destinoLabel) {
    return savedRoutesList.some((r) => r.routeId === route.id && r.destinoLabel === destinoLabel);
  }

  // Los lugares de ejemplo (Casa, Trabajo, etc.) no cuentan contra el límite — solo
  // los que el usuario agrega él mismo desde "+ Agregar" en Guardados.
  const addedPlacesCount = placesList.filter((p) => p.custom).length;
  const canAddPlace = isPremium || addedPlacesCount < FREE_PLACE_LIMIT;

  function addPlace(place) {
    if (!canAddPlace) {
      return { ok: false, error: 'Alcanzaste el límite de lugares favoritos del plan gratis.' };
    }
    const newPlace = { ...place, id: `custom-${Date.now()}`, icon: 'pin', custom: true };
    setPlacesList((prev) => [...prev, newPlace]);
    return { ok: true };
  }

  function removePlace(id) {
    setPlacesList((prev) => prev.filter((p) => p.id !== id));
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

  // NOTA: esto es una simulación para el prototipo. No hay pasarela de pago real
  // conectada (Yape/Plin/tarjeta) — solo marca la cuenta como Premium localmente.
  function activatePremium() {
    setIsPremium(true);
    localStorage.setItem('rutaya_premium', '1');
  }

  function cancelPremium() {
    setIsPremium(false);
    localStorage.removeItem('rutaya_premium');
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
        savedRoutesList, removeSavedRoute, addSavedRoute, isRouteSaved,
        placesList, addPlace, removePlace, canAddPlace, addedPlacesCount, FREE_PLACE_LIMIT,
        reportCount, sendReport,
        streetPaths,
        isPremium, activatePremium, cancelPremium,
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
