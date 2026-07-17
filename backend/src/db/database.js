import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

// La base de datos vive como un archivo dentro del propio servicio (backend/data/rutaya.db).
// Nota importante: en el plan gratis de Render el disco NO es persistente entre deploys —
// cada vez que se vuelve a desplegar (push a GitHub), este archivo se reinicia vacío.
// Para un prototipo/demo está perfecto; si más adelante necesitan que los datos sobrevivan
// entre deploys, ahí sí conviene un "Persistent Disk" de Render (de pago) o una base de
// datos gestionada aparte.
const dataDir = process.env.DB_PATH ? dirname(process.env.DB_PATH) : join(__dirname, '..', '..', 'data');
mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || join(dataDir, 'rutaya.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
