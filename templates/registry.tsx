import { InvoiceTemplateProps } from "@/lib/types/invoice";
import { FallbackInvoiceTemplate } from "./fallback/fallback-invoice-template";
import { ClassicInvoiceTemplate } from "./classic-invoice-template";

export const invoiceTemplates = {
  classic: {
    component: ClassicInvoiceTemplate as React.FC<InvoiceTemplateProps>,
    defaultSettings: {},
  },
} as const;

export type TemplateKey = keyof typeof invoiceTemplates;
