"use client";

import { formatCurrency } from "@/lib/utils";
import { useBusinessProfileSync } from "@/hooks/use-business-profile";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/lib/types";
import Image from "next/image";
import {
  SelectedItemType,
  useInvoiceStore,
} from "@/stores/invoice/useInvoiceStore";
import { VAT_RATE_PERCENTAGE } from "@/lib/constants/VAT_RATE";
import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import InvoiceNumber from "./invoice-no";
import { toast } from "sonner";
import ItemDetailsDialog from "./item-details-dialog";
import useClientSelection from "@/stores/client/useClientSelection";
import { useState } from "react";
import useTemplatesStore from "@/stores/templates/useTemplatesStore";
import { InvoiceThemeProvider } from "@/components/template-theme-provider";
import { InvoiceHeader } from "./template/invoice-header";
import { DUMMY_INVOICE_HEADER_DATA } from "./template/dummy-data";
import { InvoiceRenderer } from "@/renderers/invoice-renderer";
import { Invoice, TemplateSettings } from "@/lib/types/invoice";

interface NewInvoiceFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

function NewInvoiceForm({ form }: NewInvoiceFormProps) {
  const { selectedClient } = useClientSelection();
  const { selectedTemplate } = useTemplatesStore();
  const [selectedItem, setSelectedItem] = useState<SelectedItemType | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(selectedItem?.quantity || 1);
  const total = useCalculateInvioceAmount();
  const invoice = useInvoiceStore();

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
      toast.success(
        `${selectedItem.description} quantity updated successfully`,
      );
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

  const DUMMY_TEMPLATE_SETTINGS_MINIMAL: TemplateSettings = {
    templateKey: "classic",
    headerSection: {
      layout: "split",
      density: "spacious",
      padding: "xl",
      border: "light",
      background: "muted",
      radius: "none",
      textColor: "text-black",
      businessInfo: {
        visibility: {
          logo: false,
          businessName: true,
          address: true,
          contactDetails: false,
        },
        styleTokens: {
          logoSize: "lg",
          businessNameSize: "xl",
          businessNameWeight: "bold",
          businessMetaSize: "xs",
          businessMetaWeight: "normal",
          textAlign: "left",
        },
      },

      invoiceMeta: {
        visibility: {
          invoiceNumber: true,
          issueDate: true,
          dueDate: true,
        },
        styleTokens: {
          invoiceTitleSize: "xl",
          invoiceTitleWeight: "bold",
          metaSize: "xs",
          metaWeight: "normal",
          textAlign: "right",
        },
      },
    },

    customerSection: {
      layout: "left",
      density: "normal",
      padding: "sm",
      visibility: {
        name: true,
        address: true,
        email: true,
        phone: false,
      },

      styleTokens: {
        nameSize: "sm",
        nameWeight: "semibold",
        metaSize: "xs",
        metaWeight: "normal",
        textAlign: "center",
      },
    },

    lineItemsSection: {
      layout: "table",
      density: "normal",
      padding: "md",

      header: {
        backgroundColor: "muted",
        textColor: "text-green-400",
        fontSize: "xs",
        fontWeight: "normal",
        textAlign: "center",
      },

      visibility: {
        lineNumber: false,
      },

      row: {
        style: "bordered",
        styleTokens: {
          fontSize: "sm",
          fontWeight: "normal",
          textAlign: "left",
        },
      },

      data: {
        fontSize: "xs",
        fontWeight: "normal",
        textAlign: "center",
        textColor: "text-black",
      },
    },
  };
  //fetch the template config values here

  return (
    // <InvoiceThemeProvider template={selectedTemplate}>
    //   <div className="relative a4-size flex flex-col min-h-185  lg:min-h-312 mx-auto border-2  rounded-2xl space-y-5 lg:space-y-10 ">
    //     {/* HEADER */}
    // <InvoiceHeader form={form} config={DUMMY_HEADER_LEFT} />

    //     {/* CLIENT INFO */}
    //     <div className="flex justify-between">
    //       <div>
    //         <h3 className="invoice-text font-semibold">
    //           {" "}
    //           Customer Information
    //         </h3>
    //         <h3 className="font-medium invoice-text capitalize">
    //           {selectedClient?.name}
    //         </h3>
    //         <p className="invoice-text whitespace-pre-line">
    //           {selectedClient?.address}
    //         </p>
    //       </div>
    //       <div>
    //         <div className="grid grid-cols-2 items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
    //           <h3 className="text-nowrap invoice-text font-normal">
    //             Invoice No.
    //           </h3>
    //           <InvoiceNumber form={form} />
    //         </div>
    //         <div className="grid grid-cols-2 items-center gap-x-2 invoice-text font-normal">
    //           <h3>Date Issued:</h3>
    //           <h3>{new Date().toISOString().split("T")[0]}</h3>
    //         </div>
    //       </div>
    //     </div>

    //     {/* ITEMS TABLE */}
    //     <div className="rounded-lg pb-2 lg:pb-5">
    //       <Table>
    //         <TableHeader className="min-h-1 py-0 h-1">
    //           <TableRow className="border-y border-muted-foreground invoice-text py-0 h-2">
    //             <TableHead className="text-muted-foreground font-semibold w-12 ">
    //               #
    //             </TableHead>
    //             <TableHead className="text-muted-foreground font-semibold">
    //               Description
    //             </TableHead>
    //             <TableHead className="text-muted-foreground font-semibold text-right">
    //               Unit Price
    //             </TableHead>
    //             <TableHead className="text-muted-foreground font-semibold text-right">
    //               QTY
    //             </TableHead>
    //             <TableHead className="text-muted-foreground font-semibold text-right">
    //               Amount
    //             </TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {invoice.selectedItems.length > 0 ? (
    //             invoice.selectedItems.map((item, index) => (
    //               <TableRow
    //                 key={item._id}
    //                 onClick={() => handleItemClick(item)}
    //                 className="cursor-pointer hover:bg-blue-50 transition-colors"
    //               >
    //                 <TableCell className="font-medium text-slate-900">
    //                   {index + 1}
    //                 </TableCell>
    //                 <TableCell className="text-slate-700">
    //                   {item.description}
    //                 </TableCell>
    //                 <TableCell className="text-right text-slate-700">
    //                   ₱{item.price.toLocaleString("en-PH")}
    //                 </TableCell>
    //                 <TableCell className="text-right text-slate-700">
    //                   {item.quantity}
    //                 </TableCell>
    //                 <TableCell className="text-right font-semibold text-slate-900">
    //                   ₱{(item.price * item.quantity).toLocaleString("en-PH")}
    //                 </TableCell>
    //               </TableRow>
    //             ))
    //           ) : (
    //             <TableRow className="h-10">
    //               <TableCell colSpan={5} className="p-10 border-0 invoice-text">
    //                 <p className="text-center text-muted-foreground leading-loose text-wrap invoice-text">
    //                   Add items or services here by clicking the{" "}
    //                   <span className="font-bold">
    //                     &quot;Add Line Items&quot;
    //                   </span>{" "}
    //                   button in the Invoice settings.
    //                 </p>
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </div>

    //     {/* TOTALS AND VAT/DISCOUNTS */}
    //     <div className="mt-2 lg:mt-4 space-y-1">
    //       {/* Place all your original totals, VAT, discounts, special discounts, and total amount here exactly as in your code */}
    //       {/* I kept every detail intact */}
    //       <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //         <div className="col-span-3"></div>
    //         <div className="col-span-6 text-right invoice-text">Subtotal:</div>
    //         <div className="col-span-3 text-right pr-2 invoice-text">
    //           {formatCurrency(total.grossTotal, invoice.selectedCurrency)}
    //         </div>
    //       </div>
    //       {/* Original VAT, discounts, and total sections preserved */}
    //       {invoice.includeTax && (
    //         <>
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3 "></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               Vatable Sales:
    //             </div>
    //             <div className="col-span-3 font-light text-right pr-2 invoice-text">
    //               {formatCurrency(total.vatableSales, invoice.selectedCurrency)}
    //             </div>
    //           </div>
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3 "></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               VAT-Exempt Sales:
    //             </div>
    //             <div className="col-span-3 font-light text-right pr-2 invoice-text">
    //               {formatCurrency(
    //                 total.vatExemptSales,
    //                 invoice.selectedCurrency,
    //               )}
    //             </div>
    //           </div>
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3"></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               Zero-Rated Sales:
    //             </div>
    //             <div className="col-span-3 font-light text-right pr-2 invoice-text">
    //               {formatCurrency(
    //                 total.zeroRatedSales,
    //                 invoice.selectedCurrency,
    //               )}
    //             </div>
    //           </div>
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3"></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               Tax%:
    //             </div>
    //             <div className="col-span-3 font-light text-right pr-2 invoice-text">
    //               {VAT_RATE_PERCENTAGE}%
    //             </div>
    //           </div>
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3"></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               VAT:
    //             </div>
    //             <div className="col-span-3 text-right pr-2 font-light invoice-text">
    //               {formatCurrency(total.vatAmount, invoice.selectedCurrency)}
    //             </div>
    //           </div>
    //         </>
    //       )}
    //       {invoice.includeDiscount && (
    //         <>
    //           {invoice.isPercentage && (
    //             <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //               <div className="col-span-3"></div>
    //               <div className="col-span-5 text-right font-light invoice-text">
    //                 Discount %:
    //               </div>
    //               <div className="col-span-3 text-right pr-2 font-light invoice-text">
    //                 {invoice.discountValue}%
    //               </div>
    //             </div>
    //           )}
    //           <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
    //             <div className="col-span-3"></div>
    //             <div className="col-span-6 text-right font-light invoice-text">
    //               Discount Amount:
    //             </div>
    //             <div className="col-span-3 text-right pr-2 font-light invoice-text">
    //               {invoice.isSpecialDiscount ? (
    //                 <>
    //                   {total.specialDiscountAmount > 1 && (
    //                     <span className="font-semibold mr-2">-</span>
    //                   )}
    //                   {formatCurrency(
    //                     total.specialDiscountAmount,
    //                     invoice.selectedCurrency,
    //                   )}
    //                 </>
    //               ) : (
    //                 <>
    //                   {total.regularDiscountAmount > 1 && (
    //                     <span className="font-semibold mr-2">-</span>
    //                   )}
    //                   {formatCurrency(
    //                     total.regularDiscountAmount,
    //                     invoice.selectedCurrency,
    //                   )}
    //                 </>
    //               )}
    //             </div>
    //           </div>
    //         </>
    //       )}
    //       <div className="grid grid-cols-12 gap-x-1 font-semibold  mt-2 lg:mt-5">
    //         <div className="col-span-3 "></div>
    //         <h1 className="col-span-6 text-right text-nowrap  text-xl text-(--invoice-primary)">
    //           Total Amount:
    //         </h1>
    //         <h1 className="col-span-3 text-right pr-2  text-xl text-(--invoice-primary)">
    //           {formatCurrency(total.totalAmount, invoice.selectedCurrency)}
    //         </h1>
    //       </div>
    //     </div>

    //     {/* Footer warning */}
    //     {!invoice.includeTax && (
    //       <div className="mt-auto w-fit mx-auto">
    //         <h1 className="text-red-600 text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-xl uppercase text-center">
    //           &quot;`This document is not valid for claim of input tax.&quot;`
    //         </h1>
    //       </div>
    //     )}

    //     <ItemDetailsDialog
    //       dialogOpen={dialogOpen}
    //       setDialogOpen={setDialogOpen}
    //       selectedItem={{
    //         description: selectedItem?.description || "",
    //         unitPrice: selectedItem?.price || 0,
    //         legalFlags: {
    //           naacEligible: selectedItem?.legalFlags?.naacEligible || false,
    //           movEligible: selectedItem?.legalFlags?.movEligible || false,
    //           soloParentEligible:
    //             selectedItem?.legalFlags?.soloParentEligible || false,
    //           scPwdEligible: selectedItem?.legalFlags?.scPwdEligible || false,
    //         },
    //         vatType:
    //           selectedItem?.vatType === "VATABLE" ? "VATABLE" : "NON-VATABLE",
    //         amount: (selectedItem?.price || 0) * quantity,
    //       }}
    //       quantity={quantity}
    //       setQuantity={setQuantity}
    //       handleSaveChanges={handleSaveChanges}
    //       handleRemoveItem={handleRemoveItem}
    //     />
    //   </div>
    // </InvoiceThemeProvider>
    <InvoiceRenderer templateSettings={DUMMY_TEMPLATE_SETTINGS_MINIMAL} />
  );
}

export default NewInvoiceForm;
