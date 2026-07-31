"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_CLASSES, formatDateTime } from "@/lib/status";
import type { DashboardEmployee } from "@/types";

export function EmployeeTable({ employees }: { employees: DashboardEmployee[] }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Employee Availability</CardTitle>
        <CardDescription>Semua employee dan beban kerjanya saat ini</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Total Load</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Project</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell className="text-muted-foreground">{employee.role}</TableCell>
                <TableCell className="text-right">
                  {employee.totalLoad}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={STATUS_BADGE_CLASSES[employee.status]}
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>{employee.currentProject}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(employee.lastUpdated)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
