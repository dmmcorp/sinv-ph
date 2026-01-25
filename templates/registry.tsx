import { ClassicInvoiceTemplate } from "./classic-invoice-template";

export const invoiceTemplates = {
  classic: {
    component: ClassicInvoiceTemplate,
    defaultSettings: {},
  },
} as const;

export type TemplateKey = keyof typeof invoiceTemplates;
