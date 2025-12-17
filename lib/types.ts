import { Doc } from "@/convex/_generated/dataModel";

export type VATTYPE_UNDEFINED = "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED" | undefined; // FOR CREATION OF ITEMS
export type VATTYPE = "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED" // FOR SELECTING OF ALREADY CREATED ITEMS
export type TAXTYPE = "NON_VAT" | "VAT" | "VAT_EXEMPT" | "ZERO_RATED" | "MIXED" | "PAYMENT_RECEIPT"

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
