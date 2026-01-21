import React from "react";
import { invoiceTemplates } from "@/templates/registry";
import { Invoice } from "@/lib/types/invoice";
import { FallbackInvoiceTemplate } from "@/templates/fallback/fallback-invoice-template";

interface InvoiceRendererProps {
  invoice: Invoice;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({
  invoice,
}) => {
  const entry = invoiceTemplates[invoice.templateKey];

  if (!entry) {
    return <div>Unsupported template</div>; // fallback UI
  }

  const Template = entry?.component ?? FallbackInvoiceTemplate;

  return (
    <Template
      invoice={invoice}
      metadata={invoice.metadata}
      settings={invoice.templateSettings}
    />
  );
};
