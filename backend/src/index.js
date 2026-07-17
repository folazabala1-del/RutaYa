import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import 'dotenv/config';
import { authRouter } from './routes/auth.js';
import { reportsRouter } from './routes/reports.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const hasFrontendBuild = existsSync(join(publicDir, 'index.html'));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Ruta no encontrada.' });
  }
  next();
});

// Si el frontend fue compilado dentro de backend/public (deploy monolito en un solo
// servicio de Render), lo servimos aquí. Como el frontend usa HashRouter, basta con
// servir el index.html en la raíz; las rutas internas (#/explorar, #/rutas, etc.) las
// resuelve el navegador solo, sin necesitar configuración especial de rutas en el servidor.
if (hasFrontendBuild) {
  app.use(express.static(publicDir));
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'rutaya-backend', note: 'Frontend no compilado en este servicio.' });
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚌 RutaYa backend corriendo en el puerto ${PORT}`);
});
