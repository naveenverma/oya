"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/records", label: "Records", icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b bg-muted/30 md:w-56 md:border-b-0 md:border-r md:min-h-screen">
      <div className="flex h-16 items-center border-b px-4 font-semibold">
        Admin Portal
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === href || pathname.startsWith(`${href}/`)
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction} className="border-t p-3">
        <Button type="submit" variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </form>
    </aside>
  );
}
