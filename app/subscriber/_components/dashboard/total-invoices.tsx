"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

function TotalInvoices() {
  const getAllInvoice = useQuery(api.invoices.getAllInvoices);
  return (
    <div className="col-span-1 h-60  bg-white rounded-lg flex flex-col items-center justify-center shadow-md">
      <h3 className="capitalize">Total Generated Invoices</h3>
      <h1>{getAllInvoice?.length ?? 0}</h1>
    </div>
  );
}

export default TotalInvoices;
