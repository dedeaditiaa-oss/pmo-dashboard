export type Role =
  | "Project Manager"
  | "Backend Developer"
  | "Frontend Developer"
  | "Mobile Developer"
  | "QA"
  | "DevOps"
  | "Designer"
  | "Intern"
  | "Outsource";

export type Status = "Available" | "Busy" | "Full Load" | "Overloaded";

export interface StatusDistribution {
  name: Status;
  value: number;
  color: string;
}

export interface Employee {
  id: number;
  name: string;
  role: Role;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
}

export interface LoadPerRole {
  role: string;
  avgLoad: number;
}

export interface DashboardEmployee {
  id: number;
  name: string;
  role: Role;
  totalLoad: number;
  status: Status;
  currentProject: string;
  lastUpdated: string | null;
}

export interface DashboardData {
  totalEmployees: number;
  available: number;
  busy: number;
  fullLoad: number;
  overloaded: number;
  statusDistribution: StatusDistribution[];
  loadPerRole: LoadPerRole[];
  employees: DashboardEmployee[];
}
