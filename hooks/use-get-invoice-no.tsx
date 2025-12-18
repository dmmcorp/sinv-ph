import { api } from "@/convex/_generated/api";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useQuery } from "convex/react";

export const useGetInvoiceNo = () => {
  const invoice = useInvoiceStore();
  const getInvoiceNo = useQuery(api.invoices.getNextInvoiceNumber, {
    invoiceType: invoice.invoiceType,
  });

  const isLoading = getInvoiceNo === undefined;

  return {
    invoiceNo: getInvoiceNo,
    isLoading,
  };
};
