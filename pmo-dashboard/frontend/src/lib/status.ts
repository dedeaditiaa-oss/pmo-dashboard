import type { Status } from "@/types";

export const STATUS_COLORS: Record<Status, string> = {
  Available: "#22c55e",
  Busy: "#eab308",
  "Full Load": "#f97316",
  Overloaded: "#ef4444",
};

export const STATUS_BADGE_CLASSES: Record<Status, string> = {
  Available: "bg-green-100 text-green-800 hover:bg-green-100",
  Busy: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "Full Load": "bg-orange-100 text-orange-800 hover:bg-orange-100",
  Overloaded: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
