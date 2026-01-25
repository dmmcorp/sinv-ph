import React from "react";
import { useGetInvoiceNo } from "@/hooks/use-get-invoice-no";

interface InvoiceMetaProps {
  textColor: string;
  invoice: Invoice;
  visibility: Visibility;
}

interface Visibility {
  invoiceNumber: boolean;
  issueDate: boolean;
  dueDate: boolean;
}
interface Invoice {
  invoiceTitle: string;
  invoiceMeta: string;
}
function InvoiceMeta({ textColor, invoice, visibility }: InvoiceMetaProps) {
  const { invoiceNo } = useGetInvoiceNo();
  return (
    <div className="">
      <h1 className={`${invoice.invoiceTitle} ${textColor} text-right`}>
        INVOICE
      </h1>
      <div>
        {visibility.invoiceNumber && (
          <div className="grid grid-cols-2 items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
            <h3 className={`${invoice.invoiceMeta} ${textColor}`}>
              Invoice No.
            </h3>
            <h3 className={`${invoice.invoiceMeta} ${textColor}`}>
              {invoiceNo}
            </h3>
          </div>
        )}
        {visibility.issueDate && (
          <div className="grid grid-cols-2 items-center gap-x-2 invoice-text font-normal">
            <h3 className={`${invoice.invoiceMeta} ${textColor}`}>
              Date Issued:
            </h3>
            <h3 className={`${invoice.invoiceMeta} ${textColor}`}>
              {new Date().toISOString().split("T")[0]}
            </h3>
          </div>
        )}
        {visibility.dueDate && <>{/* to be implemented */}</>}
      </div>
    </div>
  );
}

export default InvoiceMeta;
