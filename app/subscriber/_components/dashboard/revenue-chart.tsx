"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { formatCurrencyTick, yearMonthToShortMonth } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// const revenueData = [
//   { month: "Jan", revenue: 12500 },
//   { month: "Feb", revenue: 18200 },
//   { month: "Mar", revenue: 15800 },
//   { month: "Apr", revenue: 22400 },
//   { month: "May", revenue: 19600 },
//   { month: "Jun", revenue: 28900 },
//   { month: "Jul", revenue: 24300 },
//   { month: "Aug", revenue: 31200 },
//   { month: "Sep", revenue: 27800 },
//   { month: "Oct", revenue: 35400 },
//   { month: "Nov", revenue: 32100 },
//   { month: "Dec", revenue: 38500 },
// ];

interface RevenueChartProp {
  year: string;
  compareTo: string | undefined;
}

const RevenueTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md space-y-1">
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm">
          <span className="font-medium">{p.name}:</span> ₱
          {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function RevenueChart({ year, compareTo }: RevenueChartProp) {
  const data = useQuery(api.dashboard.getMonthlyRevenueForUser, {
    year,
    compareTo,
  });
  if (!data) return null;

  const chartData = data.current.map((cur, i) => {
    const prev = data.previous?.[i];

    console.log(prev);

    return {
      month: yearMonthToShortMonth(cur.month),
      current: cur.revenue,
      previous: prev?.revenue ?? null,
    };
  });

  console.log(chartData);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Monthly Revenue
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Revenue collected over the past 12 months
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={formatCurrencyTick} // TODO: what if million na pero k yung dulo m na dapat????
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={RevenueTooltip}
              />

              {compareTo && (
                <Bar
                  dataKey="previous"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  opacity={0.4}
                  name={compareTo}
                />
              )}

              <Bar
                dataKey="current"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                name={year}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
