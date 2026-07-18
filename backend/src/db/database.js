import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// IMPORTANTE: antes esto usaba SQLite guardado como archivo local (backend/data/rutaya.db).
// En el plan gratis de Render el disco NO es persistente entre deploys: cada vez que se
// vuelve a desplegar, ese archivo se reiniciaba vacío y se perdían todos los usuarios.
// Por eso ahora usamos Postgres (Render Postgres, gratis) a través de DATABASE_URL, que sí
// sobrevive entre deploys y reinicios del servicio.
if (!process.env.DATABASE_URL) {
  console.warn(
    '⚠️  Falta la variable de entorno DATABASE_URL. Crea una base de datos Postgres en ' +
    'Render y copia su "Internal Database URL" en las variables de entorno de este servicio.'
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});
