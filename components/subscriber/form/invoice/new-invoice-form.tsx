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
import { VAT_RATE_PERCENTAGE } from "@/lib/constants/VAT_RATE";
import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import InvoiceNumber from "./invoice-no";

interface NewInvoiceFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

function NewInvoiceForm({ form }: NewInvoiceFormProps) {
  const { businessProfile } = useBusinessProfileSync();
  const total = useCalculateInvioceAmount();

  const invoice = useInvoiceStore();

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

  const rowCount = Math.max(5, invoice.selectedItems.length);
  return (
    <div className="relative border-t-primary border-t-5 flex flex-col min-h-185 bg-primary  lg:min-h-312 mx-auto border-2 shadow-lg p-4 lg:p-10 rounded-2xl space-y-5 lg:space-y-10 bg-white">
      <div className="flex justify-between ">
        <div className="">
          {businessProfile && businessProfile.logoUrl !== "" && (
            <Image
              width={70}
              height={70}
              src={businessProfile?.logoUrl}
              alt={businessProfile?.businessName ?? ""}
              className="object-contain size-10 sm:size-12.5 md:size-15 lg:size-17.5"
            />
          )}
          <h3 className="text-xs lg:text-lg font-bold mt-1 sm:mt-3">
            {businessProfile?.businessName}
          </h3>
          <p className="text-[0.6rem] sm:text-xs lg:text-lg">
            {businessProfile?.sellerName}
          </p>
          <h5 className="text-[0.6rem] sm:text-xs lg:text-lg">
            {formatedTin()}
          </h5>
          <h5 className="text-[0.6rem] sm:text-xs lg:text-lg">
            {businessProfile?.address}
          </h5>
        </div>
        <h1 className="text-lg lg:text-2xl"> {invoice.invoiceType} INVOICE</h1>
      </div>
      <div className="flex-1 space-y-4 lg:space-y-8 ">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-[0.6rem] sm:text-xs lgtext-base font-normal">
              Bill To
            </h3>
            <div className="">  
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Client Name</FormLabel> */}
                    <FormControl>
                      <Input
                        className="capitalized border-none font-semibold text-[0.6rem] sm:text-xs lg:text-lg shadow-none focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
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
                        className="border-none shadow-none text-[0.5rem] sm:text-xs lg:text-lg focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
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
            <h3 className=" font-bold opacity-0 text-[0.6rem] sm:text-xs lg:text-lg">
              1
            </h3>
            <div className="flex items-center justify-end gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
              <h3 className="text-nowrap">Invoice No.</h3>
              <InvoiceNumber form={form} />
            </div>
            <div className="flex items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg">
              Date Issued:
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Date</FormLabel> */}
                    <FormControl>
                      <Input
                        className="border-none max-w-14  sm:max-w-fit   shadow-none text-[0.5rem] sm:text-xs lg:text-lg  focus-visible:border-ring focus-visible:ring-ring/0 px-0 py-0 h-fit"
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
        <div className="rounded-lg pb-2 lg:pb-5 ">
          <div className="grid grid-cols-12 gap-x-1 py-1  lg:py-1 text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-lg font-semibold  bg-primary text-white">
            <div className="col-span-[0.5] text-center">#</div>
            <div className="col-span-6 text-center">Description</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-[1.5] text-center">QTY</div>
            <div className="col-span-2 text-center">Amount</div>
          </div>

         {Array.from({ length: rowCount }).map((_, index) => {
          const item = invoice.selectedItems[index];

          return (
            <div
              key={index}
              className="grid grid-cols-12 text-center gap-x-1  h-5 md:h-7 lg:h-7
                        text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xs
                        items-center border-t border-t-black/70 
                        border-b border-b-black py-1 lg:py-2"
            >
              <div className="col-span-[0.5]">
                {item ? index + 1 : ""}
              </div>

              <div className="col-span-6">
                {item?.description || ""}
              </div>

              <div className="col-span-2">
                {item
                  ? formatCurrency(item.price, invoice.selectedCurrency)
                  : ""}
              </div>

              <div className="col-span-[1.5] flex items-center justify-center gap-2">
                {item?.quantity || ""}
              </div>

              <div className="col-span-2">
                {item
                  ? formatCurrency(
                      item.quantity * item.price,
                      invoice.selectedCurrency
                    )
                  : ""}
              </div>
            </div>
          );
        })}
          <div className="mt-2 lg:mt-4">
            <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-sm">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right"> Subtotal:</div>
              <div className="col-span-2 text-center ">
                {formatCurrency(total.grossTotal, invoice.selectedCurrency)}
              </div>
            </div>
            {invoice.includeTax && (
              <>
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xs">
                  <div className="col-span-8 "></div>
                  <div className="col-span-2 text-right font-light"> Tax%:</div>
                  <div className="col-span-2 text-center font-light">
                    {VAT_RATE_PERCENTAGE}%
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xs">
                  <div className="col-span-8 "></div>
                  <div className="col-span-2 text-right font-light"> VAT:</div>
                  <div className="col-span-2 text-center font-light">
                    {formatCurrency(total.vatAmount, invoice.selectedCurrency)}
                  </div>
                </div>
              </>
            )}
            {invoice.includeDiscount && (
              <>
                {invoice.isPercentage && (
                  <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xs">
                    <div className="col-span-6 "></div>
                    <div className="col-span-4 text-right font-light">
                      {" "}
                      Discount %:
                    </div>
                    <div className="col-span-2 text-center font-light">
                      {invoice.discountValue}%
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xs">
                  <div className="col-span-6 "></div>
                  <div className="col-span-4 text-right font-light">
                    {" "}
                    Discount Amount:
                  </div>
                  <div className="col-span-2 text-center font-light">
                    
                    { invoice.isSpecialDiscount ? (
                    formatCurrency(
                        total.specialDiscountAmount, 
                        invoice.selectedCurrency
                      )
                    ) : (
                      formatCurrency(
                        total.regularDiscountAmount,
                        invoice.selectedCurrency
                      )
                    )}<br />

                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-12 gap-x-1  font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-sm mt-2 lg:mt-5">
              <div className="col-span-8 "></div>
              <div className="col-span-2 text-right text-nowrap">
                {" "}
                Total Amount:
              </div>
              <div className="col-span-2 text-center ">
                {formatCurrency(total.totalAmount, invoice.selectedCurrency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!invoice.includeTax && (
        <div className="mt-auto  w-fit mx-auto">
          <h1 className="text-red-600 text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xl uppercase text-center">
            &quot;This document is not valid for claim of input tax.&quot;
          </h1>
        </div>
      )}
    </div>
  );
}

export default NewInvoiceForm;
