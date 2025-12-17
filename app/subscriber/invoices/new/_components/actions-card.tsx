"use client";
import { AddItemsDialog } from "@/components/subscriber/form/invoice/add-items-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useMutation } from "convex/react";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";

const currencies = [
  { value: "PHP", label: "Philippine Peso", symbol: "₱" },
  { value: "USD", label: "US Dollar", symbol: "$" },
];

function ActionsCard() {
  const {
    selectedItems,
    selectedCurrency,
    includeTax,
    includeDiscount,
    discountValue,
    isPercentage,
    setStep,
    setCurrency,
    toggleTax,
    toggleDiscount,
    setDiscountValue,
    setIsPercentage,
  } = useInvoiceStore();
  const { businessProfile } = useBusinessProfileStore();
  const { selectedClient } = useClientSelection();
  const saveInvoice = useMutation(api.invoices.createInvoice);
  const handleSaveInvoice = () => {
    let vatStatus: "NON_VAT" | "VAT" = "NON_VAT";

    if (businessProfile?.businessType === "VAT-Registered Business") {
      vatStatus = "VAT";
    }

    const processedItems = selectedItems.map((item) => {
      const amount = item.price * item.quantity;
      return {
        unitPrice: item.price,
        description: item.description,
        quantity: item.quantity,
        amount,
        vatType: item.vatType,
      };
    });
    try {
      if (selectedClient && businessProfile) {
        toast.promise(
          saveInvoice({
            sellerTin: businessProfile.tin,
            sellerAddress: businessProfile.address,
            discountType: undefined, // to be add
            discountValue: undefined, // to be add
            specialDiscountType: undefined, // to be add
            specialDiscountId: undefined, // to be add
            buyerTin: undefined, // to be add
            buyerAddress: undefined, // to be add
            status: "DRAFT",
            clientId: selectedClient._id,
            sellerBusinessName: businessProfile?.businessName || "",
            sellerVatStatus: vatStatus,
            invoiceType: "SALES", // need to have a dynamic value
            items: processedItems,
            buyerName: selectedClient.name || "",
          }),
          {
            loading: "Saving invoice...",
            success: "Invoice saved successfully!",
            error: "Failed to save invoice.",
          }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStep(2);
    }
  };
  const handlePreviewPDF = () => {};
  return (
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
          <Label className="text-sm text-muted-foreground">Currency</Label>
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
                    <span className="text-amber-600">({curr.symbol})</span>
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
          {businessProfile?.businessType === "VAT-Registered Business" && (
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
          )}
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
  );
}

export default ActionsCard;
