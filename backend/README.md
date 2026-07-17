# RutaYa Backend

API mínima en Node/Express + **SQLite** para login/registro real y reportes de incidencia.
No necesitas crear ninguna base de datos externa — SQLite crea un archivo (`data/rutaya.db`)
dentro del propio backend automáticamente.

## Correr en local

1. Copia `.env.example` a `.env` (no necesitas tocar nada, ya funciona así).
2. Instala dependencias, migra y arranca:
   ```bash
   npm install
   npm run db:migrate
   npm run dev
   ```
3. El backend queda en `http://localhost:4000`.

## Endpoints

- `POST /api/auth/register` — body: `{ dni, password, name }` → devuelve `{ user, token }`
- `POST /api/auth/login` — body: `{ dni, password }` → devuelve `{ user, token }`
- `POST /api/reports` — requiere header `Authorization: Bearer <token>`, body: `{ routeCode, incidentType, details }`
- `GET /api/reports/mine` — requiere token, devuelve los reportes del usuario logueado

## Deploy en Render — un solo Web Service (recomendado, así de simple)

1. Render → "New" → "Web Service" → conecta tu repo de GitHub.
   - Root Directory: vacío (raíz del repo, no `backend`, porque el build compila ambas partes)
   - Build Command: `bash scripts/render-build.sh`
   - Start Command: `cd backend && npm run db:migrate && npm start`
   - Variable de entorno: `JWT_SECRET` (cualquier texto largo aleatorio)
2. Listo — un solo servicio sirve la API y el frontend ya compilado.

**Importante sobre los datos:** en el plan gratis de Render el disco no es persistente entre
deploys. Cada vez que hagan `git push` y Render vuelva a desplegar, el archivo `rutaya.db` se
reinicia vacío (los usuarios registrados se pierden). Para un prototipo/demo de CustDev esto
no debería ser un problema — regístrate de nuevo si hace falta. Si más adelante necesitan que
los datos sobrevivan entre deploys, ahí sí conviene activar un "Persistent Disk" de Render
(tiene costo) o migrar a una base de datos gestionada aparte (Postgres, por ejemplo).

