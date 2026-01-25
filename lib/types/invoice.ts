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

export type HeaderLayout = "left" | "right" | "split";
export type Density = "compact" | "normal" | "spacious";

export type PaddingToken = "none" | "sm" | "md" | "lg" | "xl";
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl";

export type FontSizeToken = "xs" | "sm" | "md" | "lg" | "xl";
export type FontWeightToken = "normal" | "medium" | "semibold" | "bold";

export type TextAlignToken = "left" | "center" | "right";
export type ColorToken = "default" | "muted" | "primary" | "accent";

// Visual / layout settings per template
export interface TemplateSettings {
  templateKey: TemplateKey;
  headerSection: HeaderSettings;
  customerSection: CustomerInfoSettings;
}
export interface HeaderSettings {
  layout: HeaderLayout;
  density: Density;
  padding: PaddingToken;
  radius: RadiusToken;
  background: ColorToken;
  border: "none" | "light" | "strong";
  textColor: string;
  businessInfo: {
    visibility: {
      logo: boolean;
      businessName: boolean;
      address: boolean;
      contactDetails: boolean;
    };
    styleTokens: {
      logoSize: "sm" | "md" | "lg" | "xl";
      businessNameSize: FontSizeToken;
      businessNameWeight: FontWeightToken;
      businessMetaSize: FontSizeToken;
      businessMetaWeight: FontWeightToken;
      textAlign?: TextAlignToken;
    };
  };

  invoiceMeta: {
    visibility: {
      invoiceNumber: boolean;
      issueDate: boolean;
      dueDate: boolean;
    };
    styleTokens: {
      invoiceTitleSize: FontSizeToken;
      invoiceTitleWeight: FontWeightToken;
      metaSize: FontSizeToken;
      metaWeight: FontWeightToken;
      textAlign: TextAlignToken;
    };
  };
}

export interface CustomerInfoSettings {
  layout: "left" | "right" | "split";
  density: Density;
  padding: PaddingToken;

  visibility: {
    name: boolean;
    address: boolean;
    email: boolean;
    phone?: boolean;
  };

  styleTokens: {
    nameSize: FontSizeToken;
    nameWeight: FontWeightToken;
    metaSize: FontSizeToken;
    metaWeight: FontWeightToken;
    textAlign: TextAlignToken;
  };
}
