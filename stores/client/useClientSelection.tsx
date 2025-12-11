import { Client } from "@/app/subscriber/invoices/_components/client-selector";
import { ClientConvexType } from "@/lib/types";
import { create } from "zustand";

interface SelectedClientType {
  /// change to convex type
  selectedClient: ClientConvexType | null;
  setSelectedClient: (value: ClientConvexType | null) => void;
}

const useClientSelection = create<SelectedClientType>((set) => ({
  selectedClient: null,
  setSelectedClient: (selectedClient) => set(() => ({ selectedClient })),
}));

export default useClientSelection;
