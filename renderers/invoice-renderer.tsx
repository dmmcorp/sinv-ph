import React from "react";
import { invoiceTemplates } from "@/templates/registry";
import { TemplateSettings } from "@/lib/types/invoice";
import { FallbackInvoiceTemplate } from "@/templates/fallback/fallback-invoice-template";

interface InvoiceRendererProps {
  templateSettings: TemplateSettings;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({
  templateSettings,
}) => {
  const entry = invoiceTemplates[templateSettings.templateKey];

  if (!entry) {
    return <div>Unsupported template</div>; // fallback UI
  }

  const Template = entry?.component ?? FallbackInvoiceTemplate;

  return <Template templateSettings={templateSettings} />;
};
