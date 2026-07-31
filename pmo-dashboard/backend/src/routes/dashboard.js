import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

function getStatus(load) {
  if (load < 20) return 'Available';
  if (load <= 39) return 'Busy';
  if (load === 40) return 'Full Load';
  return 'Overloaded';
}

const STATUS_COLORS = {
  Available: '#22c55e',
  Busy: '#eab308',
  'Full Load': '#f97316',
  Overloaded: '#ef4444',
};

router.get('/', (req, res) => {
  const db = getDb();

  const employeeLoads = db.prepare(`
    SELECT e.id, e.name, e.role, COALESCE(SUM(a.allocated_hours), 0) as total_load,
           MAX(a.updated_at) as last_updated
    FROM employees e
    LEFT JOIN allocations a ON a.employee_id = e.id
    WHERE e.role != 'Project Manager'
    GROUP BY e.id
    ORDER BY e.name ASC
  `).all();

  const allAllocations = db.prepare(`
    SELECT a.employee_id, a.allocated_hours, p.name as project_name,
           a.updated_at as last_updated
    FROM allocations a
    JOIN projects p ON p.id = a.project_id
    ORDER BY a.allocated_hours DESC
  `).all();

  const empProjectMap = {};
  for (const alloc of allAllocations) {
    if (!empProjectMap[alloc.employee_id]) {
      empProjectMap[alloc.employee_id] = { project: alloc.project_name, lastUpdated: alloc.last_updated };
    }
  }

  let totalEmployees = 0;
  let available = 0;
  let busy = 0;
  let fullLoad = 0;
  let overloaded = 0;
  const roleLoadMap = {};
  const employees = [];

  for (const emp of employeeLoads) {
    totalEmployees++;
    const status = getStatus(emp.total_load);

    if (status === 'Available') available++;
    else if (status === 'Busy') busy++;
    else if (status === 'Full Load') fullLoad++;
    else overloaded++;

    if (!roleLoadMap[emp.role]) roleLoadMap[emp.role] = { total: 0, count: 0 };
    roleLoadMap[emp.role].total += emp.total_load;
    roleLoadMap[emp.role].count++;

    employees.push({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      totalLoad: emp.total_load,
      status,
      currentProject: empProjectMap[emp.id]?.project || '-',
      lastUpdated: empProjectMap[emp.id]?.lastUpdated || null,
    });
  }

  const statusDistribution = [
    { name: 'Available', value: available, color: STATUS_COLORS.Available },
    { name: 'Busy', value: busy, color: STATUS_COLORS.Busy },
    { name: 'Full Load', value: fullLoad, color: STATUS_COLORS['Full Load'] },
    { name: 'Overloaded', value: overloaded, color: STATUS_COLORS.Overloaded },
  ];

  const loadPerRole = Object.entries(roleLoadMap).map(([role, data]) => ({
    role,
    avgLoad: Math.round(data.total / data.count),
  }));

  res.json({
    totalEmployees,
    available,
    busy,
    fullLoad,
    overloaded,
    statusDistribution,
    loadPerRole,
    employees,
  });
});

export default router;
