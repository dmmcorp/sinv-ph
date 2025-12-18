import { api } from "@/convex/_generated/api";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useQuery } from "convex/react";

export const useGetInvoice = () => {
  const invoice = useInvoiceStore();
  const getUniqueInvoice = useQuery(api.invoices.getInvoiceById, {
    invoiceId: invoice.createdInvoiceId,
  });

  const isLoading = getUniqueInvoice === undefined;

  return {
    invoice: getUniqueInvoice,
    isLoading,
  };
};
