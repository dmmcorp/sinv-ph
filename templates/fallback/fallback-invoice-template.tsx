// templates/fallback/fallback-invoice-template.tsx
import { InvoiceTemplateProps } from "@/lib/types/invoice";
import React from "react";

export const FallbackInvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  metadata,
  settings,
}) => {
  return (
    <div style={{ color: settings?.accentColor ?? "#000" }}>
      <h2>Unsupported Template</h2>
      <p>Invoice #{invoice.number ?? "—"}</p>
    </div>
  );
};
