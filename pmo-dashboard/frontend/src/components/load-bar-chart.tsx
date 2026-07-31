"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { LoadPerRole } from "@/types";

export function LoadBarChart({ data }: { data: LoadPerRole[] }) {
  const sorted = [...data].sort((a, b) => b.avgLoad - a.avgLoad);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Load per Role</CardTitle>
        <CardDescription>Rata-rata total load per role</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="role"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="avgLoad" name="Avg Load" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
