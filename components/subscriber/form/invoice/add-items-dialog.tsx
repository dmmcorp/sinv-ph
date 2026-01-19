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
import {
  Check,
  CheckIcon,
  ChevronLeft,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  Package,
  PencilLine,
  PhilippinePeso,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useItemsCatalog } from "@/hooks/use-items-catalog";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VATTYPE, VATTYPE_UNDEFINED } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchItem from "./search-item";

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

const VAT = [
  { value: "VATABLE", label: "Vatable" },
  { value: "VAT_EXEMPT", label: "Vat Exempt" },
  { value: "ZERO_RATED", label: "Zero Rated" },
];

const LEGALFLAGSMAP = [
  { label: "Senior Citizen/PWD Eligible", value: "scPwdEligible" },
  { label: "NAAC Eligible", value: "naacEligible" },
  { label: "MOV Eligible", value: "movEligible" },
  { label: "SP Eligible", value: "soloParentEligible" },
];
export function AddItemsDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [item, setItem] = useState<Item | undefined>();
  const [items, setItems] = useState<Item[]>([]);
  const [vatType, setVatType] = useState<VATTYPE_UNDEFINED>("VATABLE");
  const { itemsCatalog, loading, addItemToDB } = useItemsCatalog();
  const [description, setDescription] = useState("");
  const { businessProfile } = useBusinessProfileStore();
  const [legalFlags, setLegalFlags] = useState<{
    scPwdEligible: boolean;
    naacEligible: boolean;
    movEligible: boolean;
    soloParentEligible: boolean;
  }>({
    scPwdEligible: false,
    naacEligible: false,
    movEligible: false,
    soloParentEligible: false,
  });
  const [price, setPrice] = useState(0);
  const { selectedItems, addItem, updateItemQuantity } = useInvoiceStore();

  const onAddNewItem = async () => {
    console.log("clicked");
    // get the item
    if (step === 0 && item) {
      console.log(item);
      const curItem = {
        _id: item._id,
        description: item.description,
        price: item.unitPrice,
        quantity: 1,
        vatType: item.vatType,
        legalFlags: item.legalFlags,
      };
      console.log("Current Item:", curItem);

      //check if the item is already been added
      const existingItem = selectedItems.find(
        (item) => item._id === curItem._id,
      );

      console.log("Existing Item:", existingItem);
      // just add quantity if yes
      if (existingItem) {
        updateItemQuantity(existingItem._id, 1, "increment");
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
      const result = await addItemToDB(description, price, vatType, legalFlags);

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

      console.log(curItem);
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
    setError("");
    onStepChange(0);
  };

  const onStepChange = (step: number) => {
    setItem(undefined);
    setValue("");
    setError("");
    setStep(step);
    setLegalFlags({
      scPwdEligible: false,
      naacEligible: false,
      movEligible: false,
      soloParentEligible: false,
    });
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

  const handleDisabledFlag = (flag: string): boolean => {
    if (
      vatType === "ZERO_RATED" &&
      (flag === "scPwdEligible" || flag === "soloParentEligible")
    ) {
      return true; // disable when vat type is zero rated for SC/PWD and Solo Parent
    }
    return false;
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
            {step === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Existing Items */}
                <button
                  onClick={() => onStepChange(1)}
                  className="group w-full focus:outline-none"
                >
                  <Card
                    className="relative h-full p-6 lg:p-8 rounded-2xl border border-border 
      flex flex-col items-start justify-between
      transition-all duration-200
      hover:border-primary hover:shadow-lg hover:bg-primary/5"
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
                  onClick={() => onStepChange(2)}
                  className="group w-full focus:outline-none"
                >
                  <Card
                    className="relative h-full p-6 lg:p-8 rounded-2xl border border-border 
                    flex flex-col items-start justify-between
                    transition-all duration-200
                    hover:border-primary hover:shadow-lg hover:bg-primary/5"
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
            )}

            {step === 1 && itemsCatalog && !loading && (
              <div className="w-full space-y-2">
                {/* Label */}
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Item or Service
                </label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="
          w-full h-11 sm:h-12
          justify-between
          px-3 sm:px-4
          bg-white
          text-left
          rounded-xl
        "
                    >
                      <span className="truncate">
                        {value
                          ? itemsCatalog.find((i) => i.description === value)
                              ?.description
                          : "Select an item or service"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="
                    w-[95vw] sm:w-105 lg:w-130
                    p-0
                    max-h-[70vh]
                    overflow-hidden
                    rounded-xl
                  "
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search items…"
                        className="h-11"
                      />

                      <CommandList className="max-h-[30vh] overflow-y-auto">
                        <CommandEmpty className="py-6 text-sm text-center text-muted-foreground">
                          No items found
                        </CommandEmpty>

                        <CommandGroup>
                          {itemsCatalog.map((item) => (
                            <CommandItem
                              key={item._id}
                              value={item.description}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue,
                                );
                                setItem({
                                  _id: item._id,
                                  unitPrice: item.unitPrice,
                                  description: item.description,
                                  vatType: item.vatType,
                                  legalFlags: item.legalFlags,
                                });
                                setOpen(false);
                              }}
                              className="flex gap-3 py-3 px-3 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mt-1 h-4 w-4 shrink-0",
                                  value === item.description
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />

                              <div className="flex flex-col flex-1 gap-1">
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                  {/* Left — Description + legal */}
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium leading-tight">
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
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>
            )}

            {step !== 0 && (
              <SheetFooter>
                <Button
                  onClick={() => {
                    onStepChange(0);
                  }}
                  variant={"outline"}
                  type="button"
                  className=""
                >
                  Back
                </Button>

                <Button
                  onClick={() => onAddNewItem}
                  disabled={step === 1 ? (value === "" ? true : false) : false}
                  type="submit"
                  className="lg:w-52 "
                >
                  Add
                </Button>
              </SheetFooter>
            )}
            {step === 0 && (
              <>
                <SearchItem onStepChange={onStepChange} />
                <div className="">
                  {itemsCatalog &&
                    itemsCatalog.map((item) => (
                      <div key={item._id} className="grid grid-cols-12">
                        <button
                          onClick={() => {
                            setItems((prev) => [...prev, item]);
                          }}
                          className="col-span-10 flex flex-col flex-1 gap-1 hover:bg-muted/50 p-3 rounded-lg border cursor-pointer mb-2"
                        >
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-3">
                            {/* Left — Description + legal */}
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium leading-tight">
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
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
            {/* creating new item */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-3 items-center">
                  <button
                    onClick={() => onStepChange(0)}
                    className=" flex items-center gap-2 text-sm text-muted-foreground mb-2 cursor-pointer"
                  >
                    <ChevronLeft /> Go back{" "}
                  </button>
                  <div className="text-center">
                    <p className="font-semibold">Create new item</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <Button
                      onClick={() => {
                        onAddNewItem();
                      }}
                      type="submit"
                      className=" flex items-center gap-2 cursor-pointer"
                    >
                      Save & add
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="description"
                    className="text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter custom description"
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-muted-foreground">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    onChange={handlePriceChange}
                    placeholder="Enter custom price"
                  />
                </div>
                {businessProfile?.businessType ===
                  "VAT-Registered Business" && (
                  <>
                    <div className="space-y-2 mb-2">
                      <Label className="text-sm text-muted-foreground">
                        Vat Classification
                      </Label>
                      <Select
                        defaultValue={vatType}
                        onValueChange={(value) => setVatType(value as VATTYPE)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue
                            placeholder="Select Vat Type"
                            defaultValue={VAT[0].value}
                          >
                            <span className="flex items-center gap-2">
                              <span>{vatType}</span>
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {VAT.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <span className="flex items-center gap-2">
                                <span>{type.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Label className="text-sm text-muted-foreground">
                      Select Legal Eligibility Flags
                    </Label>
                    <div className="space-y-2 mb-2 grid grid-cols-1">
                      {LEGALFLAGSMAP.map((flag) => (
                        <button
                          key={flag.value}
                          onClick={() =>
                            setLegalFlags({
                              ...legalFlags,
                              [flag.value]:
                                !legalFlags[
                                  flag.value as keyof typeof legalFlags
                                ],
                            })
                          }
                          disabled={handleDisabledFlag(flag.value)}
                          className={`bg-white w-full text-left p-3 rounded-lg border transition-all flex flex-col 
                      ${
                        legalFlags[flag.value as keyof typeof legalFlags]
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                      ${handleDisabledFlag(flag.value) && "opacity-50 cursor-not-allowed"}
                      `}
                        >
                          <div className="flex items-start justify-between gap-2 ">
                            <div className="space-y-1 min-w-0">
                              <p className="font-normal text-sm truncate">
                                {flag.label}
                              </p>
                            </div>
                            {legalFlags[
                              flag.value as keyof typeof legalFlags
                            ] && (
                              <div className="shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
