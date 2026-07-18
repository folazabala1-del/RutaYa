import { Router } from 'express';
import { pool } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

reportsRouter.post('/', async (req, res) => {
  const { routeCode, incidentType, details } = req.body;

  if (!routeCode || !incidentType) {
    return res.status(400).json({ error: 'routeCode e incidentType son obligatorios.' });
  }

  try {
    const inserted = await pool.query(
      `INSERT INTO incident_reports (user_id, route_code, incident_type, details)
       VALUES ($1, $2, $3, $4)
       RETURNING id, route_code, incident_type, details, created_at`,
      [req.userId, routeCode, incidentType, details || null]
    );

    res.status(201).json({ report: inserted.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al guardar el reporte.' });
  }
});

reportsRouter.get('/mine', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, route_code, incident_type, details, created_at
       FROM incident_reports WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json({ reports: result.rows, count: result.rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al listar reportes.' });
  }
});
