"use client";

import Box from "@/app/subscriber/invoices/new/_components/skeleton/box";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import TotalInvoices from "./total-invoices";
import { MetricsCards } from "./metric-cards";
import { RevenueChart } from "./revenue-chart";
import { RecentActivity } from "./recent-activity";
import AddNewInvoiceBtn from "./add-new-invoice-btn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Dashboard() {
  const d = new Date();
  const currentYear = d.getUTCFullYear();
  const [year, setYear] = useState(currentYear.toString());

  return (
    <div className="relative w-full space-y-6 py-5 lg:py-10">
      <div className="flex items-center justify-between">
        <Select defaultValue={year} onValueChange={(e) => setYear(e)}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent className="max-h-45">
            {Array.from({ length: 27 }, (_, i) => 2026 - i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AddNewInvoiceBtn />
      </div>
      {/* <div className="flex-1 grid grid-cols-1 lggrid-cols-2 xl:grid-cols-4 w-full gap-10">
        <TotalInvoices />
        <div className="col-span-1 h-60  bg-white rounded-lg shadow-md">
          <Box />
        </div>
        <div className="col-span-1 h-60  bg-white rounded-lg shadow-md">
          <Box />
        </div>
        <div className="col-span-1 h-60  bg-white rounded-lg shadow-md">
          <Box />
        </div>
      </div>
      <div className="w-full    grid grid-cols-12 gap-6 ">
        <div className="col-span-8 h-90 bg-white shadow-md rounded-lg">
          <Box />
        </div>
        <div className="col-span-4 h-90 bg-white shadow-md rounded-lg">
          <Box />
        </div>
      </div> */}
      <main className=" ">
        <MetricsCards year={year} />
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart year={year} />
          </div>
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
