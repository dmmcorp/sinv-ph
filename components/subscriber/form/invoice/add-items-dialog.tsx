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
import { CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { SelectedItemType } from "./new-invoice-form";

export type Item = {
  id: number;
  description: string;
  price: number;
};

const ItemsDummy: Item[] = [
  { id: 1, description: "Web Development Services", price: 5000 },
  { id: 2, description: "UI/UX Design", price: 3000 },
  { id: 3, description: "Mobile App Development", price: 8000 },
  { id: 4, description: "Consulting", price: 2000 },
  { id: 5, description: "Maintenance & Support", price: 1500 },
];
interface AddItemsDialogProps {
  currentItems: SelectedItemType[];
  setSelectedItems: (items: SelectedItemType[]) => void;
}

export function AddItemsDialog({
  currentItems,
  setSelectedItems,
}: AddItemsDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [item, setItem] = useState<Item | undefined>();

  const onAddNewItem = () => {
    // get the item
    // Loop through ItemsDummy and find value === ItemsDummy.description then put the value of that data to item
    if (step === 1 && item) {
      const curItem = {
        ...item,
        quantity: 1,
      };

      //check if the item is already been added
      const existingItem = currentItems.find((item) => item.id === curItem.id);
      // just add quantity if yes
      if (existingItem) {
        setSelectedItems(
          currentItems.map((item) =>
            item.id === curItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        //add the whole item to the array if no
        setSelectedItems([...currentItems, curItem]);
      }
    }

    if (step === 2 && item) {
      //step 1 - add the item to the items list db
      //step 2 -after the it adds to db and have an convex id
      //step 3 - display it to the list in the ui

      //for now just create a dummy id
      const nextId = ItemsDummy.sort((a, b) => b.id - a.id)[0]?.id + 1;

      const curItem = {
        ...item,
        id: nextId,
        quantity: 1,
      };

      console.log(curItem);
      const existingItem = currentItems.find((item) => item.id === curItem.id);
      // just add quantity if yes
      if (existingItem) {
        setSelectedItems(
          currentItems.map((item) =>
            item.id === curItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        //add the whole item to the array if no
        setSelectedItems([...currentItems, curItem]);
      }

      //simulation of step 1
      ItemsDummy.push({
        ...item,
        id: nextId,
      });
    }

    // if (!item) {
    //   setError("*select an item first.");
    //   return;
    // }

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
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> <span className="hidden lg:block">Add</span>
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

          {step === 1 && (
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
                      ? ItemsDummy.find(
                          (framework) => framework.description === value
                        )?.description
                      : "Select Item/service..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {ItemsDummy.map((framework) => (
                          <CommandItem
                            key={framework.id}
                            value={framework.description}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setItem(framework);
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.description
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {framework.description}
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
                  onChange={(e) =>
                    setItem({
                      id: Date.now(),
                      description: e.target.value,
                      price: parseFloat(
                        (document.getElementById("price") as HTMLInputElement)
                          ?.value || "0"
                      ),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  type="number"
                  onChange={(e) =>
                    setItem({
                      id: Date.now(),
                      description:
                        (
                          document.getElementById(
                            "description"
                          ) as HTMLInputElement
                        )?.value || "",
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter custom price"
                />
              </div>
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
