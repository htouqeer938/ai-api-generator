"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  LayoutTemplate,
  History,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Upsell() {
  return (
    <div className="m-3 rounded-xl border border-primary/20 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-4">
      <Badge className="mb-2">Pro</Badge>
      <p className="text-sm font-medium">Unlock full AI generation</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Add an OpenAI key or upgrade for unlimited Codex-powered builds.
      </p>
      <Button size="sm" variant="gradient" className="mt-3 w-full" asChild>
        <Link href="/dashboard/settings">Configure</Link>
      </Button>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed left-4 top-4 z-40 lg:hidden">
        <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <NavLinks />
        <Upsell />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-card">
            <div className="flex h-16 items-center justify-between px-6">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <Upsell />
          </aside>
        </div>
      )}
    </>
  );
}
