# RutaYa Trujillo — Prototipo funcional

Prototipo web mobile-first (PWA) del flujo completo de RutaYa: login, mapa, búsqueda de destino,
rutas recomendadas, seguimiento en vivo (simulado) y reporte de incidencias.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173 — se ve mejor con el DevTools en modo responsive/móvil (F12 → ícono de celular).

## Deploy en Vercel (recomendado, gratis, 2 minutos)

1. Sube esta carpeta a un repo de GitHub.
2. Entra a https://vercel.com → "Add New Project" → importa el repo.
3. Vercel detecta Vite automáticamente. Solo dale "Deploy".
4. Te da un link tipo `rutaya.vercel.app` para compartir con quien evalúe el prototipo.

También puedes arrastrar la carpeta a https://app.netlify.com/drop después de correr `npm run build`
(sube la carpeta `dist/`).

## Deploy: un solo Web Service en Render (lo más simple)

El backend usa **SQLite** (un archivo, sin servicio de base de datos aparte) y sirve también
el frontend ya compilado. Solo necesitas crear **un** recurso en Render.

1. Render → "New" → "Web Service" → conecta el repo de GitHub.
   - Root Directory: (déjalo vacío, la raíz del repo)
   - Build Command: `bash scripts/render-build.sh`
   - Start Command: `cd backend && npm run db:migrate && npm start`
   - Variable de entorno: `JWT_SECRET` (un texto largo aleatorio)
2. Listo. Una sola URL (ej. `https://rutaya.onrender.com`) sirve todo: la app y la API.

`scripts/render-build.sh` compila el frontend (`npm run build`), copia el resultado a `backend/public/`,
e instala las dependencias del backend. El servidor Express detecta que existe `backend/public/index.html`
y sirve esos archivos automáticamente además de responder la API en `/api/...`.

**Nota sobre los datos:** en el plan gratis de Render el disco no persiste entre deploys —
cada `git push` reinicia la base de datos vacía. Para un prototipo de CustDev no debería
importar (solo regístrense de nuevo si hace falta antes de una demo).

## Qué es real y qué es simulado

- **Real:** toda la navegación, componentes, validaciones de formulario, mapa interactivo (Leaflet/OpenStreetMap),
  **login/registro contra una base de datos real (ver carpeta `backend/`)**, y los reportes de incidencia
  se guardan de verdad en PostgreSQL asociados al usuario que los envía.
- **Simulado (mock):** las rutas, paraderos y el movimiento del bus en el mapa en vivo (se anima solo,
  no hay GPS real de combis).
- Para producción real además necesitarían: API de rutas/paraderos reales, y algún dispositivo GPS
  en los micros (o app tipo "Uber" donde los mismos usuarios reportan posición).

## Backend (login/registro y reportes reales)

Está en la carpeta `backend/` — Node/Express + PostgreSQL. Tiene su propio README con instrucciones
para correrlo en local y desplegarlo en Render. El frontend ya está conectado a él vía `src/lib/api.js`
(usa la variable `VITE_API_URL` para saber a qué backend hablarle).

Si el backend no está corriendo o no lo despliegan a tiempo, el resto de la app (mapa, búsqueda,
rutas, reportar incidencia visualmente) sigue funcionando igual — solo el login/registro necesitaría el backend activo.

## Estructura

- `src/pages/` — cada pantalla del flujo
- `src/components/` — mapa, nav inferior, top bar (reutilizables)
- `src/data/mock.js` — toda la data simulada, fácil de editar
- `src/context/AppContext.jsx` — estado global simple (usuario, destino, ruta seleccionada)
