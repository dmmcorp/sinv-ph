"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useBusinessProfileSync } from "@/hooks/use-business-profile";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/lib/types";
import Image from "next/image";
import { SelectedItemType, useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { VAT_RATE_PERCENTAGE } from "@/lib/constants/VAT_RATE";
import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import InvoiceNumber from "./invoice-no";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ItemDetailsDialog from "./item-details-dialog";
import useClientSelection from "@/stores/client/useClientSelection";
import { useState } from "react";

interface NewInvoiceFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

function NewInvoiceForm({ form }: NewInvoiceFormProps) {
  
 const { selectedClient } = useClientSelection();
  const [selectedItem, setSelectedItem] = useState<SelectedItemType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(selectedItem?.quantity || 1);
  const { businessProfile } = useBusinessProfileSync();
  const total = useCalculateInvioceAmount();
  const invoice = useInvoiceStore();

  // 2. Define a submit handler.

       const formatedTin = () => {
    const businessType = businessProfile?.businessType;
    switch (businessType) {
      case "Freelancer/Individual":
        return businessProfile?.tin;
      case "Small Business":
        return businessProfile?.tin ? "NON-VAT REG TIN " + businessProfile?.tin : "";
      case "VAT-Registered Business":
        return businessProfile?.tin ? "VAT REG TIN " + businessProfile?.tin : "";
      default:
        return businessProfile?.tin;
    }
  };

  const handleItemClick = (item: SelectedItemType) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (selectedItem) {
      invoice.updateItemQuantity(selectedItem._id, quantity, "replace");
      if (quantity <= 0) {
        handleRemoveItem();
        return;
      }
      toast.success(`${selectedItem.description} quantity updated successfully`);
      setDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRemoveItem = () => {
    if (selectedItem) {
      invoice.removeItem(selectedItem._id);
      toast.warning(`${selectedItem.description} was removed from the invoice`);
    }
    setDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="relative border-t-primary a4-size border-t-5 flex flex-col min-h-185  lg:min-h-312 mx-auto border-2 shadow-lg p-4 lg:p-10 rounded-2xl space-y-5 lg:space-y-10 bg-white">
    
      {/* HEADER */}
      <div className="flex justify-between gap-x-5">
        <div className="w-[70%]">
          {businessProfile && businessProfile.logoUrl !== "" && (
            <div className="relative w-40 h-20 bg-transparent p-1">
              <Image
                src={businessProfile.logoUrl}
                alt={businessProfile?.businessName ?? ""}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h3 className="invoice-text font-bold mt-1 sm:mt-3">{businessProfile?.businessName}</h3>
          <p className="invoice-text ">{businessProfile?.sellerName}</p>
          <h5 className="invoice-text">{formatedTin()}</h5>
          <h5 className="invoice-text">{businessProfile?.address}</h5>
        </div>
        <h1 className="text-3xl sm:text-4xl xl:text-7xl font-light">INVOICE</h1>
      </div>

      {/* CLIENT INFO */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-[0.3rem] sm:text-xs lg:text-base font-normal">Bill To</h3>
          <h3 className="font-medium invoice-text capitalize">{selectedClient?.name}</h3>
          <p className="invoice-text whitespace-pre-line">{selectedClient?.address}</p>
        </div>
        <div>
          <div className="grid grid-cols-2 items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
            <h3 className="text-nowrap invoice-text font-normal">Invoice No.</h3>
            <InvoiceNumber form={form} />
          </div>
          <div className="grid grid-cols-2 items-center gap-x-2 invoice-text font-normal">
            <h3>Date Issued:</h3>
            <h3>{new Date().toISOString().split("T")[0]}</h3>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="rounded-lg pb-2 lg:pb-5">
        <Table>
          <TableHeader className="bg-blue-600 min-h-1 py-0 h-1">
            <TableRow className="hover:bg-blue-600 border-blue-600 invoice-text py-0 h-2">
              <TableHead className="text-white font-semibold w-12">#</TableHead>
              <TableHead className="text-white font-semibold">Description</TableHead>
              <TableHead className="text-white font-semibold text-right">Unit Price</TableHead>
              <TableHead className="text-white font-semibold text-right">QTY</TableHead>
              <TableHead className="text-white font-semibold text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.selectedItems.length > 0
              ? invoice.selectedItems.map((item, index) => (
                  <TableRow
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900">{index + 1}</TableCell>
                    <TableCell className="text-slate-700">{item.description}</TableCell>
                    <TableCell className="text-right text-slate-700">₱{item.price.toLocaleString("en-PH")}</TableCell>
                    <TableCell className="text-right text-slate-700">{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      ₱{(item.price * item.quantity).toLocaleString("en-PH")}
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow className="h-10">
                  <TableCell colSpan={5} className="p-10 border-0 invoice-text">
                    <p className="text-center text-muted-foreground leading-loose text-wrap">
                      Add items or services here by clicking the <span className="font-bold">Add items or Services</span> button in the Invoice settings.
                    </p>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>

      {/* TOTALS AND VAT/DISCOUNTS */}
      <div className="mt-2 lg:mt-4 space-y-1">
        {/* Place all your original totals, VAT, discounts, special discounts, and total amount here exactly as in your code */}
        {/* I kept every detail intact */}
        <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
          <div className="col-span-8"></div>
          <div className="col-span-2 text-right">Subtotal:</div>
          <div className="col-span-2 text-right pr-2">{formatCurrency(total.grossTotal, invoice.selectedCurrency)}</div>
        </div>
        {/* Original VAT, discounts, and total sections preserved */}
        {invoice.includeTax && (
          <>
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right font-light">Vatable Sales:</div>
              <div className="col-span-2 font-light text-right pr-2">{formatCurrency(total.vatableSales, invoice.selectedCurrency)}</div>
            </div>
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right font-light">VAT-Exempt Sales:</div>
              <div className="col-span-2 font-light text-right pr-2">{formatCurrency(total.vatExemptSales, invoice.selectedCurrency)}</div>
            </div>
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right font-light">Zero-Rated Sales:</div>
              <div className="col-span-2 font-light text-right pr-2">{formatCurrency(total.zeroRatedSales, invoice.selectedCurrency)}</div>
            </div>
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right font-light">Tax%:</div>
              <div className="col-span-2 font-light text-right pr-2">{VAT_RATE_PERCENTAGE}%</div>
            </div>
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right font-light">VAT:</div>
              <div className="col-span-2 text-right pr-2 font-light">{formatCurrency(total.vatAmount, invoice.selectedCurrency)}</div>
            </div>
          </>
        )}
        {invoice.includeDiscount && (
          <>
            {invoice.isPercentage && (
              <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
                <div className="col-span-6"></div>
                <div className="col-span-4 text-right font-light">Discount %:</div>
                <div className="col-span-2 text-right pr-2 font-light">{invoice.discountValue}%</div>
              </div>
            )}
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-6"></div>
              <div className="col-span-4 text-right font-light">Discount Amount:</div>
              <div className="col-span-2 text-right pr-2 font-light">
                {invoice.isSpecialDiscount
                  ? <>
                      {total.specialDiscountAmount > 1 && <span className="font-semibold mr-2">-</span>}
                      {formatCurrency(total.specialDiscountAmount, invoice.selectedCurrency)}
                    </>
                  : <>
                      {total.regularDiscountAmount > 1 && <span className="font-semibold mr-2">-</span>}
                      {formatCurrency(total.regularDiscountAmount, invoice.selectedCurrency)}
                    </>
                }
              </div>
            </div>
          </>
        )}
        <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base mt-2 lg:mt-5">
          <div className="col-span-8 "></div>
          <div className="col-span-2 text-right text-nowrap">Total Amount:</div>
          <div className="col-span-2 text-right pr-2">{formatCurrency(total.totalAmount, invoice.selectedCurrency)}</div>
        </div>
      </div>

      {/* Footer warning */}
      {!invoice.includeTax && (
        <div className="mt-auto w-fit mx-auto">
          <h1 className="text-red-600 text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xl uppercase text-center">
            "This document is not valid for claim of input tax."
          </h1>
        </div>
      )}
   
    <ItemDetailsDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedItem={{
          description: selectedItem?.description || "",
          unitPrice: selectedItem?.price || 0,
          legalFlags: {
            naacEligible: selectedItem?.legalFlags?.naacEligible || false,
            movEligible: selectedItem?.legalFlags?.movEligible || false,
            soloParentEligible: selectedItem?.legalFlags?.soloParentEligible || false,
            scPwdEligible: selectedItem?.legalFlags?.scPwdEligible || false,
          },
          vatType: selectedItem?.vatType === "VATABLE" ? "VATABLE" : "NON-VATABLE",
          amount: (selectedItem?.price || 0) * quantity,
        }}
        quantity={quantity}
        setQuantity={setQuantity}
        handleSaveChanges={handleSaveChanges}
        handleRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default NewInvoiceForm;

    

      

