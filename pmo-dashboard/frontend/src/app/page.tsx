"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { DashboardStats } from "@/components/dashboard-stats";
import { StatusPieChart } from "@/components/status-pie-chart";
import { LoadBarChart } from "@/components/load-bar-chart";
import { EmployeeTable } from "@/components/employee-table";
import type { DashboardData } from "@/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Gagal memuat data dashboard. Pastikan backend berjalan di port 3001."));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">PMO Dashboard</h1>
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {data ? (
          <>
            <DashboardStats data={data} />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <StatusPieChart data={data.statusDistribution} />
              <LoadBarChart data={data.loadPerRole} />
            </div>
            <EmployeeTable employees={data.employees} />
          </>
        ) : (
          !error && (
            <p className="text-muted-foreground">Memuat data...</p>
          )
        )}
      </main>
    </div>
  );
}
