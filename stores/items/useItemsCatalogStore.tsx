import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type ItemCatalogConvexType = Doc<"itemCatalog">;

interface ItemCatalogType {
  itemsCatalog: ItemCatalogConvexType[] | null;
  setItemCatalog: (value: ItemCatalogConvexType[] | null) => void;
}

const useItemCatalogStore = create<ItemCatalogType>((set) => ({
  itemsCatalog: null,
  setItemCatalog: (itemsCatalog) => set(() => ({ itemsCatalog })),
}));

export default useItemCatalogStore;
