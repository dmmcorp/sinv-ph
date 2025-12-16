import { Id } from "@/convex/_generated/dataModel";
import { VATTYPE } from "@/lib/types";
import { create } from "zustand";

export type SelectedItemType = {
  _id: Id<"itemCatalog">;
  description: string;
  quantity: number;
  price: number;
  vatType?: VATTYPE;
};

//  id: number;
//   description: string;
//   quantity: number;
//   price: number;

interface InvoiceStoreType {
  selectedCurrency: string;
  includeTax: boolean;
  includeDiscount: boolean;
  step: number;
  discountValue: string;
  isPercentage: boolean;

  selectedItems: SelectedItemType[];

  // ACTIONS

  setCurrency: (value: string) => void;
  toggleTax: () => void;
  toggleDiscount: () => void;

  setStep: (value: number) => void;
  setDiscountValue: (value: string) => void;
  setIsPercentage: (value: boolean) => void;

  addItem: (item: SelectedItemType) => void;
  updateItemQuantity: (id: Id<"itemCatalog">, quantity: number) => void;
  removeItem: (id: Id<"itemCatalog">) => void;

  clearInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStoreType>((set) => ({
  selectedCurrency: "PHP",
  includeTax: true,
  includeDiscount: false,
  step: 0,
  discountValue: "",
  isPercentage: false,

  selectedItems: [],

  // ACTIONS

  setCurrency: (value) => set({ selectedCurrency: value }),
  toggleTax: () => set((state) => ({ includeTax: !state.includeTax })),
  toggleDiscount: () =>
    set((state) => ({ includeDiscount: !state.includeDiscount })),

  setStep: (value) => set({ step: value }),
  setDiscountValue: (value) => set({ discountValue: value }),
  setIsPercentage: (value) => set({ isPercentage: value }),

  addItem: (item) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, item],
    })),

  updateItemQuantity: (id, quantity) =>
    set((state) => ({
      selectedItems: state.selectedItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + quantity } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((i) => i._id !== id),
    })),

  clearInvoice: () =>
    set({
      selectedCurrency: "PHP",
      includeTax: false,
      includeDiscount: false,
      discountValue: "",
      isPercentage: false,
      selectedItems: [],
    }),
}));
