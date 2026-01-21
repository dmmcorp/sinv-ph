import { useGetInvoiceNo } from "@/hooks/use-get-invoice-no";
import { InvoiceFormValues } from "@/lib/types";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

function InvoiceNumber({
  form,
  style,
}: {
  form: UseFormReturn<InvoiceFormValues>;
  style?: React.CSSProperties;
}) {
  const { invoiceNo } = useGetInvoiceNo();

  useEffect(() => {
    form.setValue("invoiceNo", invoiceNo || "");
  }, [invoiceNo, form]);

  return (
    <h3 className="invoice-text" style={style}>
      {invoiceNo}
    </h3>
  );
}

export default InvoiceNumber;
