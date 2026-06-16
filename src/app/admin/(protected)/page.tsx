import { createClient } from "@/lib/supabase/server";
import { getDashboardMetrics } from "@/features/records/services/record-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Archive } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const metrics = await getDashboardMetrics(supabase);

  const cards = [
    {
      title: "Total Records",
      value: metrics.total,
      icon: FileText,
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: CheckCircle,
    },
    {
      title: "Pending Review",
      value: metrics.pending_review,
      icon: Clock,
    },
    {
      title: "Archived",
      value: metrics.archived,
      icon: Archive,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Registry overview and metrics
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
