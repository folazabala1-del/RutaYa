import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(sql);
console.log('✅ Migración aplicada: tablas users e incident_reports listas.');
