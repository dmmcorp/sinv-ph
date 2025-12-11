"use client";

import { useEffect } from "react";
import useClientSelection from "@/stores/client/useClientSelection";
import NewInvoice from "@/app/subscriber/invoices/new/_components/new-invoice";

interface CreateNewInvoiceGuardType {
  onSetCurrentStep: (value: number) => void;
}

export default function CreateNewInvoiceGuard({
  onSetCurrentStep,
}: CreateNewInvoiceGuardType) {
  const { selectedClient } = useClientSelection();

  useEffect(() => {
    if (selectedClient === null) {
      onSetCurrentStep(0);
    }
  }, [selectedClient, onSetCurrentStep]);

  // Avoid rendering invoice form before redirect check finishes
  if (selectedClient === null) return null;

  return <NewInvoice />;
}
