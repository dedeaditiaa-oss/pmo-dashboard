"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee, Project } from "@/types";

export default function PMInputPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pmId, setPmId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/employees").then((res) => res.json()),
      fetch("/api/projects").then((res) => res.json()),
    ])
      .then(([emps, projs]: [Employee[], Project[]]) => {
        setEmployees(emps);
        setProjects(projs);
      })
      .catch(() => setLoadError("Gagal memuat data. Pastikan backend berjalan di port 3001."));
  }, []);

  const pmList = useMemo(
    () => employees.filter((e) => e.role === "Project Manager"),
    [employees]
  );

  const workerList = useMemo(
    () => employees.filter((e) => e.role !== "Project Manager"),
    [employees]
  );

  const selectedEmployee = employees.find((e) => String(e.id) === employeeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const hoursNum = Number(hours);
    if (!pmId || !employeeId || !projectId || !hours || hoursNum <= 0) {
      setError("Mohon lengkapi semua field dan isi allocated hours lebih dari 0.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(employeeId),
          project_id: Number(projectId),
          allocated_hours: hoursNum,
          notes: notes.trim(),
          pm_id: Number(pmId),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal menyimpan allocation.");
      }

      setMessage("Allocation berhasil disimpan.");
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">PM Input</h1>

        {loadError && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg border border-green-600/40 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Alokasi Resource</CardTitle>
            <CardDescription>Isi alokasi jam employee ke project</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pm">Project Manager</Label>
                <Select value={pmId} onValueChange={setPmId}>
                  <SelectTrigger id="pm" className="w-full">
                    <SelectValue placeholder="Pilih Project Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {pmList.map((pm) => (
                      <SelectItem key={pm.id} value={String(pm.id)}>
                        {pm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger id="employee" className="w-full">
                    <SelectValue placeholder="Pilih Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerList.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={selectedEmployee?.role ?? ""}
                  placeholder="Pilih employee terlebih dahulu"
                  readOnly
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="project">Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project" className="w-full">
                    <SelectValue placeholder="Pilih Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="hours">Allocated Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Contoh: 20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes (opsional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={saving || !employees.length} className="mt-2">
                {saving ? "Menyimpan..." : "Save Allocation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
