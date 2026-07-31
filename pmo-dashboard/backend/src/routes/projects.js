import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY name ASC').all();
  res.json(projects);
});

export default router;
