"use client";
import { AddItemsDialog, Item } from "@/components/subscriber/form/invoice/add-items-dialog";
import { TemplateDialog } from "@/components/subscriber/form/invoice/template-dialog";
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
import {  SPECIAL_DISCOUNT_TYPES_MAP } from "@/lib/constants/DISCOUNT_TYPES";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import useItemCatalogStore from "@/stores/items/useItemsCatalogStore";
import { useMutation } from "convex/react";
import { DollarSign, FileText, PhilippinePeso, Save, Tag } from "lucide-react";
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
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template)
  }
  const handleSaveInvoice = () => {
    let vatStatus: "NON_VAT" | "VAT" = "NON_VAT";

    if (businessProfile?.businessType === "VAT-Registered Business") {
      vatStatus = "VAT";
    }

    if(invoice.selectedItems.length === 0){
      toast.error("Please add items to the invoice before saving.");
      return;
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
            currency: invoice.selectedCurrency,
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
    <>
    <Card className="col-span-1 lg:col-span-3 max-h-fit">
       
        {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-700/30">
        <h2 className="text-2xl font-semibold  tracking-tight">Invoice Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Customize your invoice details</p>
      </div>
      <div className="px-6 py-6 space-y-6">
        {/* {businessProfile?.businessType !== undefined ||
          (businessProfile?.businessType !== "Freelancer/Individual" && (
            <div className="space-y-2 mb-2">
              <Label className="text-sm text-muted-foreground">
                Invoice Type
              </Label>
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
          ))} */}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Template</label>
            <button
              onClick={() => setTemplateDialogOpen(true)}
              className="w-full px-4 py-2.5 text-sm font-medium border  hover:border-slate-500 rounded-lg transition-all duration-200 text-left flex items-center justify-between group"
            >
              <span className="capitalize">{selectedTemplate ? `${selectedTemplate} (Selected)` : "Choose template"}</span>
              <svg
                className="w-4 h-4 opacity-50 group-hover:opacity-75 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        <div className="space-y-2">
           <label className="text-xs font-semibold  uppercase tracking-wider"> Item or Service</label>
          <AddItemsDialog />
        </div>
        <div className="space-y-2 mb-2">
          <label className="text-xs font-semibold  uppercase tracking-wider flex items-center gap-2">
            {invoice.selectedCurrency ? <DollarSign className="w-3.5 h-3.5" /> : <PhilippinePeso className="w-3.5 h-3.5" />}
            Currency
          </label>
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

        <div className="space-y-3 pt-2">
          {/* Tax Switch */}
          {businessProfile?.businessType === "VAT-Registered Business" && (
            <div className="flex items-center justify-between">
              <Label
                htmlFor="tax-switch"
                className="text-sm font-medium "
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
        
              className="text-sm font-medium "
            >
              Include Discount
            </Label>
            <Switch
              id="discount-switch"
              checked={invoice.includeDiscount}
              onCheckedChange={(checked) => {
                if(!checked){
                  invoice.setIsSpecialDiscount(false);
                  invoice.scIdNumber = "";
                  invoice.setSelectedSpecialDiscounts(undefined);
                  invoice.setDiscountValue("");
                  invoice.setIsPercentage(false);
                  setErrors(new Set());
                   invoice.toggleDiscount()
                } else {
                  invoice.toggleDiscount()
                }
               }}
            />
          </div>
          {invoice.includeDiscount && (
            <div className="space-y-3 rounded-md border p-3 bg-muted/30">
              {invoice.isSpecialDiscount ? (
                <div className="space-y-2">
               
                <div className="relative">
                  <Select
                    defaultValue={invoice.selectedSpecialDiscounts}
                    onValueChange={(value) =>
                      invoice.setSelectedSpecialDiscounts(value as any)
                    }
                    
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Special Discount Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIAL_DISCOUNT_TYPES_MAP.map((type) => (
                        <SelectItem 
                        key={type.value} 
                        value={type.value} 
                        // disabled={handleSDiscountDisabled(type.value)}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.has("INVALID_DISCOUNT") && (
                  <p className="text-xs text-red-500 mt-1">
                    {invoice.isPercentage
                      ? "Discount cannot exceed 100%."
                      : "Discount amount cannot be greater than the amount due."}
                  </p>
                )}
              </div>
              ): (
                <div className="space-y-2">
                <Label
                  htmlFor="discount-value"
                 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-2"
                >
                  <Tag className="w-3.5 h-3.5" />
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
              )}
              
              {!invoice.isSpecialDiscount && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-percentage"
                    checked={invoice.isPercentage}
                    onCheckedChange={(checked) =>{
                      invoice.setIsPercentage(checked === true)
                      invoice.setDiscountValue("")
                      invoice.setSelectedSpecialDiscounts(undefined)
                      errors.delete("INVALID_DISCOUNT");
                    }}
                    className="bg-white"
                  />
                  <Label
                    htmlFor="is-percentage"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Discount by percentage
                  </Label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is-special-discount"
                  checked={invoice.isSpecialDiscount}
                  onCheckedChange={(checked) => {
                    invoice.setIsSpecialDiscount(checked === true);
                    invoice.scIdNumber = "";
                    invoice.setSelectedSpecialDiscounts(undefined);
                    invoice.setDiscountValue("");
                    invoice.setIsPercentage(false);
                    errors.delete("INVALID_DISCOUNT");
                  }}
                />
                <Label
                  htmlFor="is-special-discount"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Special Discount
                </Label>
              </div>
            </div>
          )}

        
        </div>
      </div>
        {/* Action Buttons */}
         <div className="px-6 py-4 border-t border-slate-700/30 space-y-3">
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
    </Card>
     <TemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleSelectTemplate}
      />
     </>
  );
}

export default ActionsCard;
