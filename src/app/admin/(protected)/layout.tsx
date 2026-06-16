import { AdminNav } from "@/components/layout/admin-nav";
import { requireSuperAdmin } from "@/features/auth/guards";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireSuperAdmin();
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
