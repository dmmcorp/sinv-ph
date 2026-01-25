"use client";
import { Id } from "@/convex/_generated/dataModel";
import { INVOiCETYPE, VATTYPE } from "@/lib/types";
import { TemplateSettings } from "@/lib/types/invoice";
import { create } from "zustand";
export type SelectedItemType = {
  _id: Id<"itemCatalog">;
  description: string;
  quantity: number;
  price: number;
  vatType: VATTYPE;
  legalFlags?: {
    scPwdEligible?: boolean;
    naacEligible?: boolean;
    movEligible?: boolean;
    soloParentEligible?: boolean;
  };
};

//  id: number;
//   description: string;
//   quantity: number;
//   price: number;

interface InvoiceStoreType {
  createdInvoiceId: Id<"invoices"> | undefined;

  templateKey?: string;
  templateSettings?: TemplateSettings;

  invoiceType: INVOiCETYPE;
  selectedCurrency: string;
  invoiceNo: string;
  includeTax: boolean;
  includeDiscount: boolean;
  step: number;
  discountValue: string;
  isPercentage: boolean;
  isSpecialDiscount: boolean;
  selectedSpecialDiscounts?: "SC" | "PWD" | "NAAC" | "MOV" | "SP";
  scIdNumber: string; // for senior citizen id number or any government id number

  selectedItems: SelectedItemType[];

  // ACTIONS

  setCreatedInvoiceId: (value: Id<"invoices"> | undefined) => void;
  setCurrency: (value: string) => void;
  toggleTax: () => void;
  toggleDiscount: () => void;

  setStep: (value: number) => void;
  setInvoiceNo: (value: string) => void;
  setInvoiceType: (value: INVOiCETYPE) => void;
  setIsSpecialDiscount: (value: boolean) => void;
  setSelectedSpecialDiscounts: (
    value: "SC" | "PWD" | "NAAC" | "MOV" | "SP" | undefined,
  ) => void;
  setScIdNumber: (value: string) => void;
  setDiscountValue: (value: string) => void;
  setIsPercentage: (value: boolean) => void;
  setSelectedItems: (items: SelectedItemType[]) => void;

  addItem: (item: SelectedItemType) => void;
  updateItemQuantity: (
    id: Id<"itemCatalog">,
    quantity: number,
    type: "increment" | "replace",
  ) => void;
  removeItem: (id: Id<"itemCatalog">) => void;

  clearInvoice: () => void;
}

const initialInvoiceState = {
  createdInvoiceId: undefined,
  invoiceNo: "",
  invoiceType: "SALES" as const,
  selectedCurrency: "PHP",
  includeTax: false,
  includeDiscount: false,
  step: 0,
  discountValue: "",
  isPercentage: false,
  isSpecialDiscount: false,
  scIdNumber: "", // for senior citizen id number or any government id number
  selectedItems: [],
};

export const useInvoiceStore = create<InvoiceStoreType>((set) => ({
  createdInvoiceId: undefined,
  invoiceNo: "",
  invoiceType: "SALES",
  selectedCurrency: "PHP",
  includeTax: false,
  includeDiscount: false,
  step: 0,
  discountValue: "",
  isPercentage: false,
  isSpecialDiscount: false,
  scIdNumber: "", // for senior citizen id number or any government id number
  selectedSpecialDiscounts: undefined,
  selectedItems: [],

  // ACTIONS
  setCreatedInvoiceId: (value) => set({ createdInvoiceId: value }),
  setInvoiceNo: (value) => set({ invoiceNo: value }),
  setInvoiceType: (value) => set({ invoiceType: value }),
  setCurrency: (value) => set({ selectedCurrency: value }),
  toggleTax: () => set((state) => ({ includeTax: !state.includeTax })),
  toggleDiscount: () =>
    set((state) => ({ includeDiscount: !state.includeDiscount })),

  setStep: (value) => set({ step: value }),
  setDiscountValue: (value) => set({ discountValue: value }),
  setIsPercentage: (value) => set({ isPercentage: value }),
  setIsSpecialDiscount: (value) => set({ isSpecialDiscount: value }),
  setScIdNumber: (value) => set({ scIdNumber: value }),
  setSelectedSpecialDiscounts: (value) =>
    set({ selectedSpecialDiscounts: value }),

  addItem: (item) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, item],
    })),

  setSelectedItems: (items) =>
    set(() => ({
      selectedItems: items,
    })),

  updateItemQuantity: (id, quantity, type) =>
    set((state) => ({
      selectedItems: state.selectedItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                type === "increment" ? item.quantity + quantity : quantity,
            }
          : item,
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((i) => i._id !== id),
    })),

  clearInvoice: () => set(initialInvoiceState),
}));
