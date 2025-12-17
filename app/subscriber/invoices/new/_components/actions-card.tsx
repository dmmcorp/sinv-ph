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
import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import { INVOICE_TYPES } from "@/lib/constants/INVOICE_TYPES";
import { INVOiCETYPE } from "@/lib/types";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { useMutation } from "convex/react";
import { FileText, Save } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
type ErrorType = "INVALID_DISCOUNT" | "TIN_REQUIRED" | "NEGATIVE_TOTAL";
const currencies = [
  { value: "PHP", label: "Philippine Peso", symbol: "₱" },
  { value: "USD", label: "US Dollar", symbol: "$" },
];

function ActionsCard() {
  const invoice = useInvoiceStore();
  const total = useCalculateInvioceAmount();
  const { businessProfile } = useBusinessProfileStore();
  const { selectedClient } = useClientSelection();
  const saveInvoice = useMutation(api.invoices.createInvoice);
  const [errors, setErrors] = useState<Set<ErrorType>>(new Set());
  const handleSaveInvoice = () => {
    let vatStatus: "NON_VAT" | "VAT" = "NON_VAT";

    if (businessProfile?.businessType === "VAT-Registered Business") {
      vatStatus = "VAT";
    }

    const processedItems = invoice.selectedItems.map((item) => {
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
            sellerName: businessProfile.sellerName || "",
            sellerTin: businessProfile.tin,
            sellerAddress: businessProfile.address,
            discountType: invoice.isPercentage ? "PERCENT" : "FIXED",
            discountValue:
              typeof Number(invoice.discountValue) === "number"
                ? Number(invoice.discountValue)
                : 0, // to be add
            specialDiscountType: undefined, // to be add
            specialDiscountId: undefined, // to be add
            buyerTin: undefined, // to be add
            buyerAddress: selectedClient.address, // to be add
            status: "DRAFT",
            clientId: selectedClient._id,
            sellerBusinessName: businessProfile?.businessName || "",
            sellerVatStatus: vatStatus,
            invoiceType: invoice.invoiceType, // need to have a dynamic value
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
      setErrors(new Set());
      invoice.setStep(2);
    }
  };

  //handle the discount input to limit to 100 if % and totalAMount if fixed
  const handleDIscountInput = (value: string) => {
    const discount = Number(value);
    const isGreaterThan = invoice.isPercentage
      ? Boolean(Number(discount) > 100) // cannot be greater than 100%
      : Boolean(Number(discount) > total.totalAmount); // cannot be greater than totalAmount to be paid

    if (isGreaterThan) {
      setErrors((prev) => new Set(prev).add("INVALID_DISCOUNT"));
      return;
    }

    const isInvalid = invoice.isPercentage
      ? discount > 100
      : discount > total.totalAmount;

    setErrors((prev) => {
      const next = new Set(prev);

      if (isInvalid) {
        next.add("INVALID_DISCOUNT");
      } else {
        next.delete("INVALID_DISCOUNT");
      }

      return next;
    });
    invoice.setDiscountValue(discount.toString());
  };
  const handlePreviewPDF = () => {};
  return (
    <Card className="col-span-1 lg:col-span-3   h-fit">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-2">
          <Label className="text-sm text-muted-foreground">Invoice Type</Label>
          <Select
            defaultValue={invoice.selectedCurrency}
            onValueChange={(value) =>
              invoice.setInvoiceType(value as INVOiCETYPE)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Select Invoice Type"}>
                <span>{invoice.invoiceType}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {INVOICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  <span className="flex items-center gap-2">
                    <span>{type}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Item/Service Selection
          </Label>
          <AddItemsDialog />
        </div>
        <div className="space-y-2 mb-2">
          <Label className="text-sm text-muted-foreground">Currency</Label>
          <Select
            defaultValue={invoice.selectedCurrency}
            onValueChange={(value) => invoice.setCurrency(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-amber-600 font-medium">
                    ({invoice.selectedCurrency})
                  </span>
                  <span>{invoice.selectedCurrency}</span>
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
                checked={invoice.includeTax}
                onCheckedChange={invoice.toggleTax}
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
              checked={invoice.includeDiscount}
              onCheckedChange={invoice.toggleDiscount}
            />
          </div>
          {invoice.includeDiscount && (
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
                    max={invoice.isPercentage ? 100 : total.totalAmount}
                    placeholder={
                      invoice.isPercentage ? "Enter percentage" : "Enter amount"
                    }
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    value={invoice.discountValue}
                    onChange={(e) => handleDIscountInput(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {invoice.isPercentage ? "%" : invoice.selectedCurrency}
                  </span>
                </div>
                {errors.has("INVALID_DISCOUNT") && (
                  <p className="text-xs text-red-500 mt-1">
                    {invoice.isPercentage
                      ? "Discount cannot exceed 100%."
                      : "Discount amount cannot be greater than the amount due."}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is-percentage"
                  checked={invoice.isPercentage}
                  onCheckedChange={(checked) =>
                    invoice.setIsPercentage(checked === true)
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
