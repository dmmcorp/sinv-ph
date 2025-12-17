"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useItemsCatalog } from "@/hooks/use-items-catalog";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export type Item = {
  _id: Id<"itemCatalog">;
  unitPrice: number;
  description: string;
  vatType: "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED" | undefined;
};

export function AddItemsDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [item, setItem] = useState<Item | undefined>();
  const { itemsCatalog, loading, addItemToDB } = useItemsCatalog();
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState(0);
  const { selectedItems, addItem, updateItemQuantity } = useInvoiceStore();

  const onAddNewItem = async () => {
    // get the item
    if (step === 1 && item) {
      console.log(item);
      const curItem = {
        _id: item._id,
        description: item.description,
        price: item.unitPrice,
        quantity: 1,
        vatType: item.vatType,
      };
      console.log("Current Item:", curItem);

      //check if the item is already been added
      const existingItem = selectedItems.find(
        (item) => item._id === curItem._id
      );

      console.log("Existing Item:", existingItem);
      // just add quantity if yes
      if (existingItem) {
        updateItemQuantity(existingItem._id, 1);
      } else {
        //add the whole item to the array if no
        addItem(curItem);
      }
    }

    if (step === 2) {
      //step 1 - add the item to the items list db
      //step 2 -after the it adds to db and have an convex id
      //step 3 - display it to the list in the ui

      //add item to the db
      const result = await addItemToDB(description, price);

      if (!result) {
        toast.error("Error: result not found");
        return;
      }
      if (result && result.newItem === null) {
        toast.error("Error: " + result.newItem);
        return;
      }
      console.log("result:", result.newItem);
      const curItem = {
        _id: result.newItem._id,
        description: result.newItem.description,
        price: result.newItem.unitPrice,
        quantity: 1,
        vatType: result.newItem.vatType,
      };

      console.log(curItem);
      const existingItem = selectedItems.find(
        (item) => item._id === curItem._id
      );
      // just add quantity if yes
      if (existingItem) {
        updateItemQuantity(existingItem._id, 1);
      } else {
        addItem(curItem);
      }
    }
    setError("");
    onStepChange(0);
    dialogClose();
  };

  const onStepChange = (step: number) => {
    setItem(undefined);
    setValue("");
    setError("");
    setStep(step);
  };

  const dialogClose = () => {
    setDialogOpen(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value || "0"));
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <span className="hidden lg:block ">Select items/services</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add items/services</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => onStepChange(1)} className="h-full">
                <Card className="h-full p-6 hover:bg-accent cursor-pointer transition-colors">
                  <div className="text-sm font-medium">
                    Select Existing Items
                  </div>
                </Card>
              </button>
              <button onClick={() => onStepChange(2)} className="h-full">
                <Card className="h-full p-6 hover:bg-accent cursor-pointer transition-colors">
                  <div className="text-sm font-medium">
                    Manually input new item or service
                  </div>
                </Card>
              </button>
            </div>
          )}

          {step === 1 && itemsCatalog && !loading && (
            <div className="grid gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? itemsCatalog.find(
                          (framework) => framework.description === value
                        )?.description
                      : "Select Item/service..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                      <CommandEmpty>No Items found.</CommandEmpty>
                      <CommandGroup>
                        {itemsCatalog.map((item) => (
                          <CommandItem
                            key={item._id}
                            value={item.description}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setItem({
                                _id: item._id,
                                unitPrice: item.unitPrice,
                                description: item.description,
                                vatType: item.vatType,
                              });
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === item.description
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.description}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {error && (
                <>
                  <p className="text-red-600">{error}</p>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Enter custom description"
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  type="number"
                  onChange={handlePriceChange}
                  placeholder="Enter custom price"
                />
              </div>
              {/* <div className="space-y-2 mb-2">
                <Label className="text-sm text-muted-foreground">
                  Vat
                </Label>
                <Select
                  defaultValue={vatType}
                  onValueChange={(value) => setVatType(value as VATTYPE)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{vatType}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <span>{type}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </>
          )}
        </div>
        {step !== 0 && (
          <DialogFooter>
            <Button
              onClick={() => {
                onStepChange(0);
              }}
              variant={"outline"}
              type="button"
            >
              Back
            </Button>

            <Button onClick={onAddNewItem} type="submit">
              Add
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
