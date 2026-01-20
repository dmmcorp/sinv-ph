"use client";
import { Button } from "@/components/ui/button";
import { Package, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useItemsCatalog } from "@/hooks/use-items-catalog";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { VATTYPE } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchItem from "./search-item";
import CreateNewItem from "./create-new-item";

export type Item = {
  _id: Id<"itemCatalog">;
  unitPrice: number;
  description: string;
  vatType: "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED";
  legalFlags?: {
    scPwdEligible?: boolean | undefined;
    naacEligible?: boolean | undefined;
    movEligible?: boolean | undefined;
    soloParentEligible?: boolean | undefined;
  };
};

export type NewItemValues = {
  description: string;
  price: number;
  vatType: VATTYPE;
  legalFlags: {
    scPwdEligible: boolean;
    naacEligible: boolean;
    movEligible: boolean;
    soloParentEligible: boolean;
  };
};
export function AddItemsDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { addItemToDB } = useItemsCatalog();
  const [newItemValues, setNewItemValues] = useState<NewItemValues>({
    description: "",
    price: 0,
    vatType: "VATABLE" as VATTYPE,
    legalFlags: {
      scPwdEligible: false,
      naacEligible: false,
      movEligible: false,
      soloParentEligible: false,
    },
  });
  const { selectedItems, addItem, updateItemQuantity } = useInvoiceStore();

  const onAddNewItem = async (selectedItem?: Item) => {
    // get the item
    if (step === 0 && selectedItem) {
      const curItem = {
        _id: selectedItem._id,
        description: selectedItem.description,
        price: selectedItem.unitPrice,
        quantity: 1,
        vatType: selectedItem.vatType,
        legalFlags: selectedItem.legalFlags,
      };
      //check if the item is already been added
      const existingItem = selectedItems.find(
        (item) => item._id === curItem._id,
      );

      // just add quantity if yes
      if (existingItem) {
        updateItemQuantity(existingItem._id, 1, "increment");
      } else {
        //add the whole item to the array if no
        addItem(curItem);
      }
    }

    if (step === 1) {
      //step 1 - add the item to the items list db
      //step 2 -after the it adds to db and have an convex id
      //step 3 - display it to the list in the ui

      //add item to the db
      const result = await addItemToDB(
        newItemValues.description,
        newItemValues.price,
        newItemValues.vatType,
        newItemValues.legalFlags,
      );

      if (!result) {
        return;
      }
      if (result && result.newItem === null) {
        toast.error("Error: " + result.newItem);
        return;
      }

      const curItem = {
        _id: result.newItem._id,
        description: result.newItem.description,
        price: result.newItem.unitPrice,
        quantity: 1,
        vatType: result.newItem.vatType,
      };

      const existingItem = selectedItems.find(
        (item) => item._id === curItem._id,
      );
      // just add quantity if yes
      if (existingItem) {
        updateItemQuantity(existingItem._id, 1, "increment");
      } else {
        addItem(curItem);
      }
    }
    onStepChange(0);
  };

  const onStepChange = (step: number) => {
    setStep(step);
    setNewItemValues({
      description: "",
      price: 0,
      vatType: "VATABLE",
      legalFlags: {
        scPwdEligible: false,
        naacEligible: false,
        movEligible: false,
        soloParentEligible: false,
      },
    });
  };

  useEffect(() => {
    if (!dialogOpen) {
      onStepChange(0);
    }
  }, [dialogOpen]);

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full px-4 py-2.5 text-sm font-medium border bg-white hover:bg-white hover:text-black hover:border-black rounded-lg transition-all duration-200 text-left flex items-center justify-between group "
        >
          <span className="hidden lg:block "> Add Line Items</span>
          <svg
            className="w-4 h-4 opacity-50 group-hover:opacity-75 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-1/2  sm:max-w-2xl max-h-dvh overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base sm:text-lg lg:text-2xl font-semibold">
            Add Line Items
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Choose an item or enter a custom service to add it as a line item on
            this invoice.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Items */}
              <button
                onClick={() => onStepChange(0)}
                className="group w-full focus:outline-none"
              >
                <Card
                  className={`${step === 0 ? "border-4 border-accent" : "border border-border"} relative h-full p-6 lg:p-8 rounded-2xl  flex flex-col items-start justify-between transition-all duration-200 hover:border-primary hover:shadow-lg hover:bg-primary/5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition">
                      <Package className="w-6 h-6" />
                    </div>

                    <div className="text-left">
                      <h2 className="text-base lg:text-xl font-semibold">
                        Select Existing Items
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choose from your saved products or services
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-primary font-medium group-hover:underline">
                    Browse your item list →
                  </div>
                </Card>
              </button>

              {/* Manual Entry */}
              <button
                onClick={() => onStepChange(1)}
                className="group w-full focus:outline-none"
              >
                <Card
                  className={`${step === 1 ? "border-4 border-accent" : "border border-border"} relative h-full p-6 lg:p-8 rounded-2xl  flex flex-col items-start justify-between transition-all duration-200 hover:border-primary hover:shadow-lg hover:bg-primary/5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition">
                      <PencilLine className="w-6 h-6" />
                    </div>

                    <div className="text-left">
                      <h2 className="text-base lg:text-xl font-semibold">
                        Add a New Item
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manually enter a custom product or service
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-primary font-medium group-hover:underline">
                    Create a new line item →
                  </div>
                </Card>
              </button>
            </div>

            {step === 0 && (
              <>
                <SearchItem
                  onAddNewItem={onAddNewItem}
                  onStepChange={onStepChange}
                />
              </>
            )}
            {/* creating new item */}
            {step === 1 && (
              <CreateNewItem
                onAddNewItem={onAddNewItem}
                newItemValues={newItemValues}
                onSetNewItemValues={setNewItemValues}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
