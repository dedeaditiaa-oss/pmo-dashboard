"use client";

import { Users, CheckCircle2, Clock, Gauge, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/types";

type StatKey = "totalEmployees" | "available" | "busy" | "fullLoad" | "overloaded";

const cards: { key: StatKey; label: string; icon: typeof Users; color: string }[] = [
  { key: "totalEmployees", label: "Total Employee", icon: Users, color: "text-foreground" },
  { key: "available", label: "Available", icon: CheckCircle2, color: "text-green-600" },
  { key: "busy", label: "Busy", icon: Clock, color: "text-yellow-600" },
  { key: "fullLoad", label: "Full Load", icon: Gauge, color: "text-orange-600" },
  { key: "overloaded", label: "Overloaded", icon: AlertTriangle, color: "text-red-600" },
];

export function DashboardStats({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-3 px-4">
            <div className={`rounded-lg bg-muted p-2.5 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold leading-tight">{data[key]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
