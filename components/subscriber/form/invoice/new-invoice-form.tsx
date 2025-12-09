"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddItemsDialog, Item } from "./add-items-dialog";
import { useState } from "react";

const nvoiceFormSchema = z.object({
  clientName: z.string().min(2).max(50),
  clientAddress: z.string().min(2).max(50),
  clientTIN: z.string().optional(),
  date: z.string(),
  invoiceNo: z.string().min(1),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0),
      total: z.number().min(0),
    })
  ),
  subTotal: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
});

export interface SelectedItemType {
  id: number;
  description: string;
  price: number;
  quantity: number;
}

function NewInvoiceForm() {
  //client name(billed to)
  //client address(billed to)
  //tin(optional)
  //Date of transaction
  // invoice no
  //items or services - it can be selected from the list of items or services
  //quantity
  //price
  // total
  const [selectedCurrency, setSelectedCurrency] = useState("php");
  const [selectedItems, setSelectedItems] = useState<SelectedItemType[] | []>(
    []
  );
  const form = useForm<z.infer<typeof nvoiceFormSchema>>({
    resolver: zodResolver(nvoiceFormSchema),
    defaultValues: {
      clientName: "",
      clientAddress: "",
      clientTIN: "",
      date: new Date().toISOString().split("T")[0],
      invoiceNo: "",
      items: selectedItems,
      subTotal: 0,
      discount: 0,
      total: 0,
    },
  });

  const onSetQuantity = (process: "add" | "sub", itemId: number) => {
    const itemToModify = selectedItems.find((i) => i.id === itemId);

    if (process === "add" && itemToModify) {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.id === itemToModify.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    }
    if (process === "sub" && itemToModify) {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.id === itemToModify.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof nvoiceFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="invoiceNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter invoice number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientTIN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter TIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card>
            <CardHeader className="">
              <div className="flex items-center justify-between w-full">
                <CardTitle>List of items/Services</CardTitle>
                <div className="flex items-center">
                  <Select onValueChange={(value) => setSelectedCurrency(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        defaultValue={selectedCurrency}
                        placeholder="Select a currency"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        <SelectItem value="php">₱PHP</SelectItem>
                        <SelectItem value="usd">$USD</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <AddItemsDialog
                    currentItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-x-1 text-xs lg:text-lg font-semibold">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">QTY</div>
                <div className="col-span-2">Total</div>
              </div>
              {selectedItems.map((selectedItem) => (
                <div
                  key={selectedItem.description}
                  className="grid grid-cols-12  gap-x-1 text-xs items-center border-t border-t-black/70 py-2"
                >
                  <div className="col-span-6">{selectedItem.description}</div>
                  <div className="col-span-2">{selectedItem.price}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Button
                      onClick={() => onSetQuantity("sub", selectedItem.id)}
                      disabled={selectedItem.quantity > 0 ? false : true}
                      type="button"
                      size={"icon-sm"}
                      variant={"outline"}
                    >
                      -
                    </Button>
                    {selectedItem.quantity}

                    <Button
                      onClick={() => onSetQuantity("add", selectedItem.id)}
                      type="button"
                      size={"icon-sm"}
                      variant={"outline"}
                    >
                      +
                    </Button>
                  </div>
                  <div className="col-span-2">
                    {selectedItem.quantity * selectedItem.price}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default NewInvoiceForm;
