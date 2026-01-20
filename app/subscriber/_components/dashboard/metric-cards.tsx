"use client";

import { FileText, FilePen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MetricsCards() {
  const metricsData = useQuery(api.dashboard.getInvoiceMetricsForUser);
  if (!metricsData) return null;

  const metrics = [
    {
      label: "Total Generated Invoices",
      value: metricsData.total,
      icon: FileText,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
    {
      label: "Draft Invoices",
      value: metricsData.draft,
      icon: FilePen,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Paid Invoices",
      value: metricsData.paid,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Unpaid Invoices",
      value: metricsData.open + metricsData.overdue,
      icon: AlertCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="cursor-pointer transition-shadow hover:shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {metric.value}
                </p>
              </div>
              <div className={`rounded-lg p-2 ${metric.iconBg}`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
