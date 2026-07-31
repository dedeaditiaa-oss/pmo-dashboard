import { fileURLToPath } from 'url';
import { getDb } from './db.js';

const employees = [
  { name: 'Andi Pratama', role: 'Project Manager' },
  { name: 'Budi Santoso', role: 'Project Manager' },
  { name: 'Citra Dewi', role: 'Project Manager' },
  { name: 'Dimas Saputra', role: 'Backend Developer' },
  { name: 'Eka Wijaya', role: 'Backend Developer' },
  { name: 'Fajar Ramadhan', role: 'Backend Developer' },
  { name: 'Gilang Permadi', role: 'Backend Developer' },
  { name: 'Hadi Nugroho', role: 'Backend Developer' },
  { name: 'Indra Lesmana', role: 'Backend Developer' },
  { name: 'Joko Susilo', role: 'Frontend Developer' },
  { name: 'Karina Ayu', role: 'Frontend Developer' },
  { name: 'Lestari Putri', role: 'Frontend Developer' },
  { name: 'Maman Suryadi', role: 'Frontend Developer' },
  { name: 'Nia Kurniawati', role: 'Frontend Developer' },
  { name: 'Oki Ferdiansyah', role: 'Mobile Developer' },
  { name: 'Putri Wulandari', role: 'Mobile Developer' },
  { name: 'Qori Azizah', role: 'Mobile Developer' },
  { name: 'Rizky Aditya', role: 'Mobile Developer' },
  { name: 'Sari Indah', role: 'QA' },
  { name: 'Taufik Hidayat', role: 'QA' },
  { name: 'Umar Wibisono', role: 'QA' },
  { name: 'Vina Marlina', role: 'QA' },
  { name: 'Wawan Hermawan', role: 'DevOps' },
  { name: 'Yoga Pratama', role: 'DevOps' },
  { name: 'Zainal Abidin', role: 'DevOps' },
  { name: 'Adinda Kusuma', role: 'Designer' },
  { name: 'Bayu Aji', role: 'Designer' },
  { name: 'Cici Permata', role: 'Designer' },
  { name: 'Dea Ananda', role: 'Intern' },
  { name: 'Eko Prasetyo', role: 'Intern' },
  { name: 'Fitri Handayani', role: 'Intern' },
  { name: 'Galih Saputro', role: 'Intern' },
  { name: 'Hendra Gunawan', role: 'Outsource' },
  { name: 'Ira Safitri', role: 'Outsource' },
  { name: 'Jeni Ratnasari', role: 'Outsource' },
];

const projects = [
  'Sales', 'Product', 'CMSLMSN', 'ANBK', 'MOSBUS',
  'ACPBUS', 'INFRET', 'KUSCN', 'ESWRET', 'ERP',
];

function getStatus(load) {
  if (load < 20) return 'Available';
  if (load <= 39) return 'Busy';
  if (load === 40) return 'Full Load';
  return 'Overloaded';
}

export function seed() {
  const db = getDb();

  const existingCount = db.prepare('SELECT COUNT(*) as cnt FROM employees').get().cnt;
  if (existingCount > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const insertEmployee = db.prepare('INSERT INTO employees (name, role) VALUES (?, ?)');
  const insertProject = db.prepare('INSERT INTO projects (name) VALUES (?)');
  const insertAllocation = db.prepare(
    'INSERT INTO allocations (employee_id, project_id, allocated_hours, notes, pm_id) VALUES (?, ?, ?, ?, ?)'
  );

  const tx = db.transaction(() => {
    const pmIds = [];
    const devIds = [];

    for (const emp of employees) {
      const result = insertEmployee.run(emp.name, emp.role);
      if (emp.role === 'Project Manager') {
        pmIds.push(result.lastInsertRowid);
      } else {
        devIds.push(result.lastInsertRowid);
      }
    }

    const projectIds = [];
    for (const proj of projects) {
      const result = insertProject.run(proj);
      projectIds.push(result.lastInsertRowid);
    }

    const allocations = [
      [4, 0, 20], [4, 3, 20],
      [5, 1, 25], [5, 4, 15],
      [6, 2, 30], [6, 5, 10],
      [7, 0, 40],
      [8, 1, 35], [8, 6, 10],
      [9, 7, 50],
      [10, 0, 15], [10, 2, 10],
      [11, 1, 20],
      [12, 3, 25], [12, 8, 15],
      [13, 4, 30], [13, 9, 10],
      [14, 5, 40],
      [15, 0, 10], [15, 6, 10],
      [16, 2, 20], [16, 7, 20],
      [17, 4, 45],
      [18, 8, 30], [18, 9, 10],
      [19, 1, 15], [19, 3, 5],
      [20, 5, 20], [20, 6, 20],
      [21, 9, 40],
      [22, 0, 35], [22, 2, 15],
      [23, 4, 10], [23, 7, 10],
      [24, 1, 20],
      [25, 3, 25], [25, 8, 25],
      [26, 5, 15], [26, 9, 10],
      [27, 0, 10], [27, 2, 10],
      [28, 6, 20], [28, 7, 20],
      [29, 4, 10],
      [30, 1, 10],
      [31, 3, 5], [31, 8, 5],
      [32, 9, 10],
      [33, 0, 30],
      [34, 2, 20], [34, 5, 20],
      [35, 7, 25],
    ];

    for (const [empIdx, projIdx, hours] of allocations) {
      const pm = pmIds[Math.floor(Math.random() * pmIds.length)];
      insertAllocation.run(devIds[empIdx - 4], projectIds[projIdx], hours, '', pm);
    }
  });

  tx();

  const rows = db.prepare(`
    SELECT e.name, e.role, COALESCE(SUM(a.allocated_hours), 0) as total_load
    FROM employees e
    LEFT JOIN allocations a ON a.employee_id = e.id
    WHERE e.role != 'Project Manager'
    GROUP BY e.id
    ORDER BY e.name
  `).all();

  const statusCounts = { Available: 0, Busy: 0, 'Full Load': 0, Overloaded: 0 };
  for (const row of rows) {
    statusCounts[getStatus(row.total_load)]++;
  }

  console.log('Seed complete! 35 employees, 10 projects, and allocations created.\n');
  console.log('Load distribution:');
  for (const [s, c] of Object.entries(statusCounts)) {
    console.log(`  ${s}: ${c}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed();
}
