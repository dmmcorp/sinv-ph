import Box from "@/app/subscriber/invoices/new/_components/skeleton/box";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import TotalInvoices from "./total-invoices";
import { MetricsCards } from "./metric-cards";
import { RevenueChart } from "./revenue-chart";
import { RecentActivity } from "./recent-activity";
import AddNewInvoiceBtn from "./add-new-invoice-btn";

function Dashboard() {
  return (
    <div className="relative w-full space-y-6 py-5 lg:py-10">
      <div className=" w-fit h-fit shadow-2xl ml-auto">
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
        <MetricsCards />
        <div className="mt-6 grid gap-6 lg:grid-cols-5 ">
          <div className="lg:col-span-3">
            <RevenueChart />
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
