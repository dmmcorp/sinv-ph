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
    <FormField
      control={form.control}
      name="invoiceNo"
      render={({ field }) => (
        <FormItem>
          {/* <FormLabel>Invoice Number</FormLabel> */}
          <FormControl>
            <Input
              className="border-none max-w-14 sm:max-w-fit  text-[0.5rem] sm:text-xs lg:text-lg shadow-none focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
              placeholder="0001"
              disabled
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InvoiceNumber;
