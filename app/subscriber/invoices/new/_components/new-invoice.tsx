"use client";
import { AddItemsDialog } from "@/components/subscriber/form/invoice/add-items-dialog";
import NewInvoiceForm from "@/components/subscriber/form/invoice/new-invoice-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";

export interface SelectedItemType {
  id: number;
  description: string;
  price: number;
  quantity: number;
}

const currencies = [
  { value: "PHP", label: "Philippine Peso", symbol: "₱" },
  { value: "USD", label: "US Dollar", symbol: "$" },
];

export const BusinessProfile = {
  _id: "123asd1asd",
  userId: "123asd1asd",
  businessName: "123asd1asd",
  tin: "123asd1asd",
  address: "123asd1asd",
  logoUrl: "123asd1asd",
};

const invoiceFormSchema = z.object({
  clientName: z
    .string({ error: "Client name is required" })
    .min(2, "Client name must be at least 2 characters")
    .max(50, "Client name must be at most 50 characters"),

  clientAddress: z
    .string({ error: "Client address is required" })
    .min(2, "Client address must be at least 2 characters")
    .max(50, "Client address must be at most 50 characters"),

  clientTIN: z.string().optional(),

  date: z.string({ error: "Invoice date is required" }),

  invoiceNo: z
    .string({ error: "Invoice number is required" })
    .min(1, "Invoice number cannot be empty"),

  items: z
    .array(
      z.object({
        description: z
          .string({ error: "Item description is required" })
          .min(1, "Item description cannot be empty"),
        quantity: z
          .number({ error: "Quantity is required" })
          .min(1, "Quantity must be at least 1"),
        price: z
          .number({ error: "Price is required" })
          .min(0, "Price cannot be negative"),
        total: z
          .number({ error: "Total is required" })
          .min(0, "Total cannot be negative"),
      })
    )
    .min(1, "At least one item is required"),

  subTotal: z
    .number({ error: "Subtotal is required" })
    .min(0, "Subtotal cannot be negative"),

  discount: z
    .number({ error: "Discount is required" })
    .min(0, "Discount cannot be negative"),

  total: z
    .number({ error: "Total amount is required" })
    .min(0, "Total cannot be negative"),
});

function NewInvoice({ invoiceNo }: { invoiceNo: string }) {
  const { selectedClient } = useClientSelection();
  const {
    selectedCurrency,
    includeTax,
    includeDiscount,
    discountValue,
    isPercentage,
    selectedItems,
    setCurrency,
    toggleTax,
    toggleDiscount,
    setDiscountValue,
    setIsPercentage,
  } = useInvoiceStore();

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: selectedClient?.name ?? "",
      clientAddress: selectedClient?.address ?? "",
      clientTIN: "",
      date: new Date().toISOString().split("T")[0],
      invoiceNo: invoiceNo,
      items: selectedItems,
      subTotal: 0,
      discount: 0,
      total: 0,
    },
  });
  console.log(invoiceNo);

  const handleSaveInvoice = () => {};
  const handlePreviewPDF = () => {};

  function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full gap-10">
          <div className="col-span-1 lg:col-span-9">
            <NewInvoiceForm
              form={form}
              // selectedCurrency={selectedCurrency}
              // setSelectedCurrency={setSelectedCurrency}
              // currentItems={selectedItems}
              // setSelectedItems={setSelectedItems}
              // includeDiscount={includeDiscount}
              // includeTax={includeTax}
              // discountValue={discountValue}
              // isPercentage={isPercentage}
            />
          </div>
          <Card className="col-span-1 lg:col-span-3   h-fit">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Item/Service Selection
                </Label>
                <AddItemsDialog />
              </div>
              <div className="space-y-2 mb-2">
                <Label className="text-sm text-muted-foreground">
                  Currency
                </Label>
                <Select
                  defaultValue={selectedCurrency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span className="text-amber-600 font-medium">
                          ({selectedCurrency})
                        </span>
                        <span>{selectedCurrency}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        <span className="flex items-center gap-2">
                          <span className="text-amber-600">
                            ({curr.symbol})
                          </span>
                          <span>{curr.value}</span>
                          <span className="text-muted-foreground text-xs">
                            - {curr.label}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {/* Tax Switch */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="tax-switch"
                    className="text-sm text-muted-foreground"
                  >
                    Include Tax
                  </Label>
                  <Switch
                    id="tax-switch"
                    checked={includeTax}
                    onCheckedChange={toggleTax}
                  />
                </div>

                {/* Discount Switch */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="discount-switch"
                    className="text-sm text-muted-foreground"
                  >
                    Include Discount
                  </Label>
                  <Switch
                    id="discount-switch"
                    checked={includeDiscount}
                    onCheckedChange={toggleDiscount}
                  />
                </div>
                {includeDiscount && (
                  <div className="space-y-3 rounded-md border p-3 bg-muted/30">
                    <div className="space-y-2">
                      <Label
                        htmlFor="discount-value"
                        className="text-sm text-muted-foreground"
                      >
                        Discount Amount
                      </Label>
                      <div className="relative">
                        <Input
                          id="discount-value"
                          type="number"
                          placeholder={
                            isPercentage ? "Enter percentage" : "Enter amount"
                          }
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          {isPercentage ? "%" : selectedCurrency}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is-percentage"
                        checked={isPercentage}
                        onCheckedChange={(checked) =>
                          setIsPercentage(checked === true)
                        }
                      />
                      <Label
                        htmlFor="is-percentage"
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Discount by percentage
                      </Label>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handlePreviewPDF}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Preview as PDF
                  </Button>
                  <Button className="w-full" onClick={handleSaveInvoice}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export default NewInvoice;
