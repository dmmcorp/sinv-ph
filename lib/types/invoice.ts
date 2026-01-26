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

export type FontSizeToken = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
export type FontWeightToken =
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold";

export type TextAlignToken = "left" | "center" | "right";
export type ColorToken = "default" | "muted" | "primary" | "accent";

/* ----------------------------------- */
export interface TemplateSettings {
  templateKey: TemplateKey;
  headerSection: HeaderSettings;
  customerSection: CustomerInfoSettings;
  lineItemsSection: LineItemsSettings;
  totalsSection: TotalsSettings;
}

/* ----------------------------------- */
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

/* ----------------------------------- */
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

/* ----------------------------------- */
export interface LineItemsSettings {
  layout: "table" | "stacked" | "card"; // how items are presented
  density: Density; // row spacing
  padding: PaddingToken; // container padding

  header: {
    // show/hide column headers
    backgroundColor: ColorToken;
    textColor: ColorToken;
    fontSize: FontSizeToken;
    fontWeight: FontWeightToken;
    textAlign?: TextAlignToken;
  };

  visibility: {
    lineNumber: boolean;
  };

  row: {
    style: "plain" | "striped" | "bordered";
    styleTokens: {
      fontSize: FontSizeToken;
      fontWeight: FontWeightToken;
      textAlign?: TextAlignToken;
    };
  };

  data: {
    fontSize: FontSizeToken;
    fontWeight: FontWeightToken;
    textAlign?: TextAlignToken;
    textColor: string;
  };
}

/* ----------------------------------- */
export interface TotalsSettings {
  // Container
  layout: "table" | "stacked" | "card";
  density: Density;
  padding: PaddingToken;
  backgroundColor?: ColorToken;
  border?: "none" | "light" | "strong";
  radius?: RadiusToken;

  // Rows
  subtotal: TotalsTextStyle;
  taxBreakdown: TotalsTextStyle;
  discount: TotalsTextStyle;
  grandTotal: TotalsTextStyle;
}

export interface TotalsTextStyle {
  fontSize: FontSizeToken;
  fontWeight: FontWeightToken;
  textColor: string;
  textAlign: TextAlignToken;
  backgroundColor?: ColorToken;
}
/* ----------------------------------- */
