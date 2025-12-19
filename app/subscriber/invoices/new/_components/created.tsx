"use client";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useGetInvoice } from "@/hooks/use-get-invoice";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

function Created() {
  const invoiceState = useInvoiceStore();
  const client = useClientSelection();
  const { invoice: createdInvoice } = useGetInvoice();

  const createNewInvoice = () => {
    invoiceState.clearInvoice();
  };
  const goToDashboard = () => {};
  const viewInvoice = () => {};
  const sendInvoice = () => {};
  return (
    <motion.div
      initial={{
        y: 10,
        scaleX: 0.7,
        opacity: 0.5,
      }}
      animate={{
        y: 0,
        scaleX: 1,
        opacity: 1,
      }}
      className="flex flex-col items-center justify-center py-10 px-4 space-y-6"
    >
      {/* Success Animation */}
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="text-green-600 w-12 h-12" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl lg:text-4xl font-bold text-center">
        Invoice Created!
      </h1>
      <p className="text-center text-gray-600">
        Your invoice has been saved successfully.
      </p>

      {/* Invoice Summary */}
      {/* <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 space-y-2">
        <p>
          <strong>Client:</strong> {client.selectedClient?.name}
        </p>
        <p>
          <strong>Invoice #:</strong> {invoice.invoiceNo}
        </p>
        <p>
          <strong>Total:</strong> ${invoice.}
        </p>
        <p>
          <strong>Due Date:</strong> {invoice.dueDate}
        </p>
      </div> */}

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button className="flex-1" onClick={viewInvoice}>
          View Invoice
        </Button>
        <Button className="flex-1" variant="outline" onClick={() => {}}>
          Send Invoice
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-2">
        <Button className="flex-1" variant="ghost" onClick={createNewInvoice}>
          Create Another Invoice
        </Button>
        <Button className="flex-1" variant="ghost" onClick={goToDashboard}>
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}

export default Created;
