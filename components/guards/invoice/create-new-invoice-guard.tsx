"use client";

import { useEffect } from "react";
import useClientSelection from "@/stores/client/useClientSelection";
import NewInvoice from "@/app/subscriber/invoices/new/_components/new-invoice";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateNewInvoiceGuardType {
  onSetCurrentStep: (value: number) => void;
}

export default function CreateNewInvoiceGuard({
  onSetCurrentStep,
}: CreateNewInvoiceGuardType) {
  const { selectedClient } = useClientSelection();
  const getInvoiceNo = useQuery(api.invoices.getNextInvoiceNumber, {
    invoiceType: "SALES",
  });
  useEffect(() => {
    if (selectedClient === null) {
      onSetCurrentStep(0);
    }
  }, [selectedClient, onSetCurrentStep]);

  // Avoid rendering invoice form before redirect check finishes
  if (selectedClient === null) return null;

  if (getInvoiceNo === undefined) return null;

  return <NewInvoice invoiceNo={getInvoiceNo} />;
}
