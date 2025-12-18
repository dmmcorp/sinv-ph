import { Client } from "@/app/subscriber/invoices/_components/client-selector";
import { ClientConvexType } from "@/lib/types";
import { create } from "zustand";

interface SelectedClientType {
  /// change to convex type
  newClientDialogOpen: boolean;
  selectedClient: ClientConvexType | null;
  setSelectedClient: (value: ClientConvexType | null) => void;
  setNewClientDialogOpen: (value: boolean) => void;
}

const useClientSelection = create<SelectedClientType>((set) => ({
  newClientDialogOpen: false,
  selectedClient: null,
  setSelectedClient: (selectedClient) => set(() => ({ selectedClient })),
  setNewClientDialogOpen: (newClientDialogOpen) =>
    set(() => ({ newClientDialogOpen })),
}));

export default useClientSelection;
