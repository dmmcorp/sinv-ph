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
