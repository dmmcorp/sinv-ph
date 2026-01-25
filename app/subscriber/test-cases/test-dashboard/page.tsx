"use client";

import { FileText, FilePen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const TestDashboardPage = () => {
  const metrics = [
    {
      label: "Total Vatable Sales",
      value: 1,
      icon: FileText,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
    {
      label: "Total Value Added Tax (VAT)",
      value: 3,
      icon: FilePen,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Total Zero Rated Sales",
      value: 5,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Total VAT-Exempt Sales",
      value: 7,
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
};

export default TestDashboardPage;
