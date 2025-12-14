/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { api } from "@/convex/_generated/api";
import { VATTYPE } from "@/lib/types";
import useItemCatalogStore from "@/stores/items/useItemsCatalogStore";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const useItemsCatalog = () => {
  const { itemsCatalog } = useItemCatalogStore();
  const createItem = useMutation(api.item_catalog.createItem);
  const items = useQuery(api.item_catalog.getAllItem);
  const setItemCatalog = useItemCatalogStore((s) => s.setItemCatalog);

  useEffect(() => {
    if (items) setItemCatalog(items);
  }, [items, setItemCatalog]);

  const addItemToDB = async (
    description: string,
    unitPrice: number,
    vatType: VATTYPE
  ) => {
    try {
      const item = await createItem({
        unitPrice,
        description,
        vatType,
      });

      toast.success("Successfully added new item/service");
      return item;
    } catch (error: any) {
      toast.error("Error:" + error);
      console.log(error);
    }
  };

  return { itemsCatalog, addItemToDB, loading: items === undefined };
};
