"use client";

import { FileText, FilePen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { diff } from "@/lib/utils";

interface MetricsCardsProp {
  year: string;
  compareTo: string | undefined;
}

export const MetricsCards = ({ year, compareTo }: MetricsCardsProp) => {
  const metricsData = useQuery(api.dashboard.getInvoiceMetricsForUser, {
    year,
    compareTo: compareTo ?? undefined,
  });
  if (!metricsData) return null;

  const { current, previous } = metricsData;

  const metrics = [
    {
      label: "Total Generated Invoices",
      value: current.total,
      diff: diff(current.total, previous?.total),
      icon: FileText,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
    {
      label: "Draft Invoices",
      value: current.draft,
      diff: diff(current.draft, previous?.draft),
      icon: FilePen,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Paid Invoices",
      value: current.paid,
      diff: diff(current.paid, previous?.paid),
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Unpaid Invoices",
      value: current.open + current.overdue,
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
                {metric.diff && (
                  <p
                    className={`mt-1 text-sm font-medium ${
                      metric.diff.value > 0
                        ? "text-emerald-600"
                        : metric.diff.value < 0
                          ? "text-rose-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {metric.diff.value > 0 && "+"}
                    {metric.diff.value}
                    {/* {metric.diff.percent !== null &&
                      ` (${metric.diff.percent}%)`} */}
                    <span className="ml-1 text-muted-foreground">
                      {metric.diff.value > 0 ? "more" : "less"} invoices
                      compared to {metricsData.compareTo}
                    </span>
                  </p>
                )}
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
};
