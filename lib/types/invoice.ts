import { TemplateKey } from "@/templates/registry";

export interface InvoiceTemplateProps {
  invoice: Invoice;
  metadata: Record<string, string>;
  settings: TemplateSettings;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  name: string;
  address?: string;
  email?: string;
}

export interface Invoice {
  id?: string;
  number?: string;
  status: "draft" | "sent" | "paid";
  issueDate?: string;
  dueDate?: string;
  currency: string;
  customer?: Customer;
  lineItems: LineItem[];
  templateKey: TemplateKey;
  metadata: Record<string, string>;
  templateSettings: TemplateSettings;
}

// Visual / layout settings per template
export interface TemplateSettings {
  accentColor?: string;
  fontSize?: "sm" | "md" | "lg";
  showLogo?: boolean;
  headerAlignment?: "left" | "right" | "center";
}
