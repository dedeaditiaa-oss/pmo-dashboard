import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT a.*, e.name as employee_name, e.role, p.name as project_name, pm.name as pm_name
    FROM allocations a
    JOIN employees e ON e.id = a.employee_id
    JOIN projects p ON p.id = a.project_id
    JOIN employees pm ON pm.id = a.pm_id
    ORDER BY a.updated_at DESC
  `).all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const db = getDb();
  const { employee_id, project_id, allocated_hours, notes, pm_id } = req.body;

  if (!employee_id || !project_id || allocated_hours == null || !pm_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (typeof allocated_hours !== 'number' || allocated_hours < 0) {
    return res.status(400).json({ error: 'allocated_hours must be a non-negative number' });
  }

  const stmt = db.prepare(`
    INSERT INTO allocations (employee_id, project_id, allocated_hours, notes, pm_id, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(employee_id, project_id) DO UPDATE SET
      allocated_hours = excluded.allocated_hours,
      notes = excluded.notes,
      pm_id = excluded.pm_id,
      updated_at = excluded.updated_at
  `);

  stmt.run(employee_id, project_id, allocated_hours, notes || '', pm_id);

  const updated = db.prepare(`
    SELECT a.*, e.name as employee_name, e.role, p.name as project_name, pm.name as pm_name
    FROM allocations a
    JOIN employees e ON e.id = a.employee_id
    JOIN projects p ON p.id = a.project_id
    JOIN employees pm ON pm.id = a.pm_id
    WHERE a.employee_id = ? AND a.project_id = ?
  `).get(employee_id, project_id);

  res.status(201).json(updated);
});

export default router;
