import { Doc } from "@/convex/_generated/dataModel";

export type VATTYPE = "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED";

export type InvoiceFormValues = {
  clientName: string;
  clientAddress: string;
  date: string;
  invoiceNo: string;
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subTotal: number;
  discount: number;
  total: number;
  clientTIN?: string;
};

export type ClientConvexType = Doc<"clients">;
