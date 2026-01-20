"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { yearMonthToShortMonth } from "@/lib/utils";
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

export function RevenueChart() {
  const data = useQuery(api.dashboard.getMonthlyRevenueForUser, {
    year: 2026,
  });
  if (!data) return null;

  const chartData = data.map((d) => ({
    month: yearMonthToShortMonth(d.month),
    revenue: d.revenue,
  }));

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
        <div className="h-[300px]">
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
                tickFormatter={(value) => `₱${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white px-3 py-2 shadow-md">
                        <p className="text-sm font-medium">
                          ₱{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
