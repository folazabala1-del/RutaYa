import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

async function run() {
  await pool.query(sql);
  console.log('✅ Migración aplicada: tablas users e incident_reports listas.');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Error al migrar la base de datos:', err.message);
  process.exit(1);
});
