import { Doc, Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

export type SelectedItemType = {
  _id: Id<"itemCatalog">;
  description: string;
  quantity: number;
  price: number;
};

//  id: number;
//   description: string;
//   quantity: number;
//   price: number;

interface InvoiceStoreType {
  selectedCurrency: string;
  includeTax: boolean;
  includeDiscount: boolean;

  discountValue: string;
  isPercentage: boolean;

  selectedItems: SelectedItemType[];

  // ACTIONS

  setCurrency: (value: string) => void;
  toggleTax: () => void;
  toggleDiscount: () => void;

  setDiscountValue: (value: string) => void;
  setIsPercentage: (value: boolean) => void;

  addItem: (item: SelectedItemType) => void;
  updateItemQuantity: (id: Id<"itemCatalog">, quantity: number) => void;
  removeItem: (id: Id<"itemCatalog">) => void;

  clearInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStoreType>((set) => ({
  selectedCurrency: "PHP",
  includeTax: false,
  includeDiscount: false,

  discountValue: "",
  isPercentage: false,

  selectedItems: [],

  // ACTIONS

  setCurrency: (value) => set({ selectedCurrency: value }),
  toggleTax: () => set((state) => ({ includeTax: !state.includeTax })),
  toggleDiscount: () =>
    set((state) => ({ includeDiscount: !state.includeDiscount })),

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
