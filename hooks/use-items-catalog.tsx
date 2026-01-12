/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { api } from "@/convex/_generated/api";
import { VATTYPE_UNDEFINED } from "@/lib/types";
import useItemCatalogStore from "@/stores/items/useItemsCatalogStore";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useEffect } from "react";
import { toast } from "sonner";

export const useItemsCatalog = () => {
  const { itemsCatalog } = useItemCatalogStore();
  const createItem = useMutation(api.item_catalog.createItem);
  const items = useQuery(api.item_catalog.getAllItems);
  const setItemCatalog = useItemCatalogStore((s) => s.setItemCatalog);

  useEffect(() => {
    if (items) setItemCatalog(items);
  }, [items, setItemCatalog]);

  const addItemToDB = async (
    description: string,
    unitPrice: number,
    vatType?: VATTYPE_UNDEFINED,
    legalFlags?: {
      scPwdEligible: boolean;
      naacEligible: boolean;
      movEligible: boolean;
      soloParentEligible: boolean;
    }
  ) => {
    try {
      const item = await createItem({
        unitPrice,
        description,
        vatType,
        legalFlags,
      });

      toast.success("Successfully added new item/service");
      return item;
    } catch (error: any) {
        if (error instanceof ConvexError) {
            toast.error(error.data);
          } else {
            toast.error("Something went wrong.");
          }
    
    }
  };

  return { itemsCatalog, addItemToDB, loading: items === undefined };
};
