"use client";
import { Input } from "@/components/ui/input";
import { useItemsCatalog } from "@/hooks/use-items-catalog";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Item } from "./add-items-dialog";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { Button } from "@/components/ui/button";

interface SearchItemProps {
  onAddNewItem: (item: Item) => void;
  onStepChange: (step: number) => void;
}

function SearchItem({ onAddNewItem, onStepChange }: SearchItemProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { itemsCatalog } = useItemsCatalog();
  const { selectedItems, updateItemQuantity, removeItem } = useInvoiceStore();

  const itemExists = (itemId: Id<"itemCatalog">) => {
    const isExisting = selectedItems.some((item) => item._id === itemId);
    const numberOfExists = isExisting
      ? selectedItems.find((item) => item._id === itemId)?.quantity || 0
      : 0;
    return {
      isExisting,
      numberOfExists,
    };
  };

  const filteredItems = itemsCatalog
    ? itemsCatalog.filter((item) =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-12 items-center w-full gap-4">
        <div className="relative col-span-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items or type to create a new one "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-white h-11"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-100 pb-4">
        {filteredItems &&
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-12 transition-all duration-200 ease-in-out"
            >
              <motion.button
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onAddNewItem(item);
                }}
                className={`${itemExists(item._id).isExisting ? "col-span-10 border-accent" : "col-span-12 "} bg-white flex flex-col flex-1 gap-1 hover:bg-muted/50  p-3 rounded-lg border cursor-pointer mb-2 `}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  {/* Left — Description + legal */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight uppercase">
                      {item.description}
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {item.legalFlags?.scPwdEligible && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                          Senior Citizen / PWD
                        </span>
                      )}
                      {item.legalFlags?.naacEligible && (
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-medium">
                          NAAC
                        </span>
                      )}
                      {item.legalFlags?.movEligible && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-medium">
                          MOV
                        </span>
                      )}
                      {item.legalFlags?.soloParentEligible && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium">
                          Solo Parent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right — Price */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                      {/* <PhilippinePeso className="w-3 h-3" /> */}
                      {item.unitPrice.toLocaleString()}
                    </div>
                    <div className="text-[10px] ">per unit</div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between text-[10px]">
                  {item.vatType && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded font-medium",
                        item.vatType === "VATABLE"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {item.vatType}
                    </span>
                  )}

                  {item.vatType === "VATABLE" && (
                    <span className="">12% VAT applied</span>
                  )}
                </div>
              </motion.button>
              {itemExists(item._id).isExisting && (
                <div
                  className={`${itemExists(item._id).isExisting ? "col-span-2 flex flex-col items-center justify-center" : "hidden "}`}
                >
                  <div className="text-primary">Added</div>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        const itemQuantity = itemExists(
                          item._id,
                        ).numberOfExists;
                        const isLastOne = itemQuantity <= 1;
                        if (isLastOne) {
                          // remove the item from the list
                          removeItem(item._id);
                        }
                        updateItemQuantity(
                          item._id,
                          isLastOne ? 0 : itemQuantity - 1,
                          "replace",
                        );
                      }}
                      className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition"
                    >
                      <Minus className="size-4" />
                    </button>

                    <div className="flex flex-col items-center justify-center">
                      <h6 className="text-xs">Qty</h6>
                      <p className="">{itemExists(item._id).numberOfExists}</p>
                    </div>
                    <button
                      onClick={() => {
                        const itemQuantity = itemExists(
                          item._id,
                        ).numberOfExists;

                        updateItemQuantity(
                          item._id,
                          itemQuantity + 1,
                          "replace",
                        );
                      }}
                      className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

        {filteredItems && filteredItems.length === 0 && (
          <div className="text-center space-y-2 text-sm text-muted-foreground mt-6">
            <h5>No items found.</h5>
            <Button onClick={() => onStepChange(1)}>Add a new item</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchItem;
