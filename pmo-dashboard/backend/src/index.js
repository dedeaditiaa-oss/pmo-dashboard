import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';
import { seed } from './seed.js';
import employeesRouter from './routes/employees.js';
import projectsRouter from './routes/projects.js';
import allocationsRouter from './routes/allocations.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

getDb();
seed();

app.use('/api/employees', employeesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/allocations', allocationsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`PMO Dashboard API running on http://localhost:${PORT}`);
});
