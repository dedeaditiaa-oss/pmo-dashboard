import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const employees = db.prepare('SELECT * FROM employees ORDER BY name ASC').all();
  res.json(employees);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  const totalLoad = db.prepare(
    'SELECT COALESCE(SUM(allocated_hours), 0) as total FROM allocations WHERE employee_id = ?'
  ).get(req.params.id).total;

  const load = totalLoad;
  let status = 'Available';
  if (load >= 40) status = 'Overloaded';
  else if (load === 40) status = 'Full Load';
  else if (load >= 20) status = 'Busy';

  const projects = db.prepare(`
    SELECT p.name as project, a.allocated_hours, a.notes, pm.name as pm_name
    FROM allocations a
    JOIN projects p ON p.id = a.project_id
    JOIN employees pm ON pm.id = a.pm_id
    WHERE a.employee_id = ?
    ORDER BY a.updated_at DESC
  `).all(req.params.id);

  res.json({ ...employee, totalLoad: load, status, projects });
});

export default router;
