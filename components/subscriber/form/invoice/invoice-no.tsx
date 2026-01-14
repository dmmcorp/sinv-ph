import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetInvoiceNo } from "@/hooks/use-get-invoice-no";
import { InvoiceFormValues } from "@/lib/types";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

function InvoiceNumber({ form }: { form: UseFormReturn<InvoiceFormValues> }) {
  const { invoiceNo } = useGetInvoiceNo();

  useEffect(() => {
    form.setValue("invoiceNo", invoiceNo || "");
  }, [invoiceNo, form]);

  return (
   <h3 className="invoice-text">{invoiceNo}</h3>
  );
}

export default InvoiceNumber;
