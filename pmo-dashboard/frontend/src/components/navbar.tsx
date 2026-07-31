"use client";

import Link from "next/link";
import { BarChart3, ClipboardPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/pm-input", label: "PM Input", icon: ClipboardPlus },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5" />
          PMO Dashboard
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === href && "bg-muted text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
