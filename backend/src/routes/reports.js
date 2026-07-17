import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

reportsRouter.post('/', (req, res) => {
  const { routeCode, incidentType, details } = req.body;

  if (!routeCode || !incidentType) {
    return res.status(400).json({ error: 'routeCode e incidentType son obligatorios.' });
  }

  try {
    const info = db
      .prepare('INSERT INTO incident_reports (user_id, route_code, incident_type, details) VALUES (?, ?, ?, ?)')
      .run(req.userId, routeCode, incidentType, details || null);

    const report = db
      .prepare('SELECT id, route_code, incident_type, details, created_at FROM incident_reports WHERE id = ?')
      .get(info.lastInsertRowid);

    res.status(201).json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al guardar el reporte.' });
  }
});

reportsRouter.get('/mine', (req, res) => {
  try {
    const reports = db
      .prepare('SELECT id, route_code, incident_type, details, created_at FROM incident_reports WHERE user_id = ? ORDER BY created_at DESC')
      .all(req.userId);

    res.json({ reports, count: reports.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al listar reportes.' });
  }
});
