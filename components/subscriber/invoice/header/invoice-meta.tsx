import React from "react";
import { DUMMY_HEADER_LEFT } from "./invoice-business-header";
import InvoiceNumber from "../../form/invoice/invoice-no";
import { useGetInvoiceNo } from "@/hooks/use-get-invoice-no";

interface InvoiceMetaProps {
  config: typeof DUMMY_HEADER_LEFT;
}
function InvoiceMeta({ config }: InvoiceMetaProps) {
  const { invoiceNo } = useGetInvoiceNo();
  return (
    <div className="">
      <h1
        className=""
        style={{
          fontSize: config.invoiceTitle.style.fontSize,
          fontWeight: config.invoiceTitle.style.fontWeight,
        }}
      >
        INVOICE
      </h1>
      <div>
        <div className="grid grid-cols-2 items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
          <h3
            className="text-nowrap invoice-text font-normal"
            style={{
              fontSize: config.invoiceMeta.style.fontSize,
            }}
          >
            Invoice No.
          </h3>
          <h3 style={{ fontSize: config.invoiceMeta.style.fontSize }}>
            {invoiceNo}
          </h3>
        </div>
        <div className="grid grid-cols-2 items-center gap-x-2 invoice-text font-normal">
          <h3 style={{ fontSize: config.invoiceMeta.style.fontSize }}>
            Date Issued:
          </h3>
          <h3 style={{ fontSize: config.invoiceMeta.style.fontSize }}>
            {new Date().toISOString().split("T")[0]}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default InvoiceMeta;
