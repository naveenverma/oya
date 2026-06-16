import Link from "next/link";
import { Shield } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-5 w-5" aria-hidden />
          <span>Secure Registry Portal</span>
        </Link>
        <nav aria-label="Main">
          <Link
            href="/admin/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
