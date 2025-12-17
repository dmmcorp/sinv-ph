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
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import { VAT_RATE, VAT_RATE_PERCENTAGE } from "@/lib/constants/VAT_RATE";
import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";

interface NewInvoiceFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

function NewInvoiceForm({ form }: NewInvoiceFormProps) {
  const { businessProfile } = useBusinessProfileSync();
  const total = useCalculateInvioceAmount();
  const {
    selectedCurrency,
    includeTax,
    includeDiscount,
    discountValue,
    isPercentage,
    selectedItems,
  } = useInvoiceStore();

  const calculateSubTotal = () => {
    return selectedItems.reduce((total, item) => {
      const lineTotal = (item.quantity || 0) * (item.price || 0);
      return total + lineTotal;
    }, 0);
  };

  const subtotal = calculateSubTotal();

  const calculateTaxAmount = () => {
    const totalVATAmount = selectedItems.reduce((total, item) => {
      if (item.vatType === "VATABLE") {
        console.log("item Pric:", item.price);
        return item.price * VAT_RATE + total;
      }
      return total;
    }, 0);

    return totalVATAmount;
  };
  const calculateDiscountAmount = () => {
    const disc = isPercentage
      ? subtotal * (Number(discountValue) / 100)
      : Number(discountValue);

    return disc;
  };
  const calculateTotalAmount = () => {
    let total = subtotal;
    if (includeTax) {
      total += taxAmount;
    }

    if (includeDiscount) {
      total -= discountAmount;
    }

    return total;
  };
  const discountAmount = calculateDiscountAmount();
  const taxAmount = calculateTaxAmount();
  const totalAmount = calculateTotalAmount();
  // 2. Define a submit handler.

  const formatedTin = () => {
    const businessType = businessProfile?.businessType;
    switch (businessType) {
      case "Freelancer/Individual":
        // Logic for freelancers / individuals
        return businessProfile?.tin;

      case "Small Business":
        // Logic for small businesses (non-VAT)
        if (businessProfile?.tin) {
          return "NON-VAT REG TIN " + businessProfile?.tin;
        } else {
          return "";
        }

      case "VAT-Registered Business":
        // Logic for VAT-registered businesses
        if (businessProfile?.tin) {
          return "VAT REG TIN " + businessProfile?.tin;
        } else {
          return "";
        }

      default:
        // Fallback if businessType is undefined or unexpected
        return businessProfile?.tin;
    }
    return;
  };
  return (
    <div className=" border-2 shadow-lg p-10 rounded-2xl space-y-10 bg-white">
      <div className="flex justify-between">
        <div className="">
          {businessProfile && businessProfile.logoUrl !== "" && (
            <Image
              width={70}
              height={70}
              src={businessProfile?.logoUrl}
              alt={businessProfile?.businessName ?? ""}
              className="object-contain"
            />
          )}
          <h3 className="text-lg font-bold">{businessProfile?.businessName}</h3>
          <p>{businessProfile?.sellerName}</p>
          <h5>{formatedTin()}</h5>
          <h5>{businessProfile?.address}</h5>
        </div>
        <h1>INVOICE</h1>
      </div>
      <div className="space-y-8">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-md font-bold">Bill To</h3>
            <div className="">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Client Name</FormLabel> */}
                    <FormControl>
                      <Input
                        className="border-none font-semibold shadow-none focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
                        placeholder="Enter client name"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Client Address</FormLabel> */}
                    <FormControl>
                      <Input
                        disabled
                        className="border-none shadow-none focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
                        placeholder="Enter address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="">
            <h3 className="text-md font-bold opacity-0">1</h3>
            <div className="flex items-center gap-x-2">
              Invoice No.
              <FormField
                control={form.control}
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Invoice Number</FormLabel> */}
                    <FormControl>
                      <Input
                        className="border-none text-base shadow-none focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
                        placeholder="0001"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-x-2">
              Date Issued:
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Date</FormLabel> */}
                    <FormControl>
                      <Input
                        className="border-none shadow-none  focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="border-x border-y border-black rounded-lg pb-5">
          <div className="grid grid-cols-12 gap-x-1 py-1  font-semibold border-b border-black text-sm">
            <div className="col-span-[0.5] text-center">#</div>
            <div className="col-span-6 text-center">Description</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-[1.5] text-center">QTY</div>
            <div className="col-span-2 text-center">Amount</div>
          </div>

          {selectedItems.length > 0
            ? selectedItems.map((selectedItem, index) => (
                <div
                  key={selectedItem.description}
                  className="grid grid-cols-12 text-center  gap-x-1 text-xs items-center border-t border-t-black/70 py-2 border-b border-b-black"
                >
                  <div className="col-span-[0.5]">{index + 1}</div>
                  <div className="col-span-6">{selectedItem.description}</div>
                  <div className="col-span-2">
                    {formatCurrency(selectedItem.price, selectedCurrency)}
                  </div>
                  <div className="col-span-[1.5] flex items-center justify-center gap-2">
                    {selectedItem.quantity}
                  </div>
                  <div className="col-span-2">
                    {}
                    {formatCurrency(
                      selectedItem.quantity * selectedItem.price,
                      selectedCurrency
                    )}
                  </div>
                </div>
              ))
            : [1, 2, 3, 5].map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 text-center min-h-5 py-3  gap-x-1 text-xs items-center border-t border-t-black/70  border-b border-b-black"
                >
                  <div className="col-span-[0.5]">{}</div>
                  <div className="col-span-6">{}</div>
                  <div className="col-span-2">{}</div>
                  <div className="col-span-[1.5] flex items-center justify-center gap-2">
                    {}
                  </div>
                  <div className="col-span-2">
                    {}
                    {}
                  </div>
                </div>
              ))}
          <div className="mt-4">
            <div className="grid grid-cols-12 gap-x-1  font-semibold text-sm">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right"> Subtotal:</div>
              <div className="col-span-2 text-center ">
                {formatCurrency(total.grossTotal, selectedCurrency)}
              </div>
            </div>
            {includeTax && (
              <>
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-xs">
                  <div className="col-span-8 "></div>
                  <div className="col-span-2 text-right font-light"> Tax%:</div>
                  <div className="col-span-2 text-center font-light">
                    {VAT_RATE_PERCENTAGE}%
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-xs">
                  <div className="col-span-8 "></div>
                  <div className="col-span-2 text-right font-light"> VAT:</div>
                  <div className="col-span-2 text-center font-light">
                    {formatCurrency(total.vatAmount, selectedCurrency)}
                  </div>
                </div>
              </>
            )}
            {includeDiscount && (
              <>
                {isPercentage && (
                  <div className="grid grid-cols-12 gap-x-1  font-semibold text-xs">
                    <div className="col-span-6 "></div>
                    <div className="col-span-4 text-right font-light">
                      {" "}
                      Discount %:
                    </div>
                    <div className="col-span-2 text-center font-light">
                      {discountValue}%
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-xs">
                  <div className="col-span-6 "></div>
                  <div className="col-span-4 text-right font-light">
                    {" "}
                    Discount Amount:
                  </div>
                  <div className="col-span-2 text-center font-light">
                    {formatCurrency(discountAmount, selectedCurrency)}
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-12 gap-x-1  font-semibold text-sm mt-5">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right"> Total Amount:</div>
              <div className="col-span-2 text-center ">
                {formatCurrency(total.totalAmount, selectedCurrency)}
              </div>
            </div>
          </div>
        </div>
        {!includeTax && (
          <div className="">
            <h1 className="text-red-600 text-xl uppercase text-center">
              &quot;This document is not valid for claim of input tax.&quot;
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewInvoiceForm;
