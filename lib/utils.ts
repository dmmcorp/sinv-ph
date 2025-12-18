import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SOLO_PARENT_DISCOUNT_RATE, SPECIAL_DISCOUNT_RATE } from "./constants/SPECIAL_DISCOUNT_RATE";
import { VAT_RATE } from "./constants/VAT_RATE";
import type { TaxType } from "./constants/TAX_TYPES";
import type {
  DiscountType,
  SpecialDiscountType,
} from "./constants/DISCOUNT_TYPES";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2, // Always show 2 decimals for centavos
    maximumFractionDigits: 2, // Cap at 2 decimals
  }).format(value);
};

export const round = (value: number): number => Math.round(value * 100) / 100;

export const calculateInvoiceAmounts = (args: {
  items: {
    unitPrice: number;
    quantity: number;
    vatType?: "VATABLE" | "VAT_EXEMPT" | "ZERO_RATED";
  }[];
  taxType?: TaxType;
  discountType?: DiscountType;
  discountValue?: number;
  specialDiscountType?: SpecialDiscountType;
}) => {
  let vatablesTotal = 0;
  let vatExemptTotal = 0;
  let zeroRatedTotal = 0;
  let noVatTypeTotal = 0;
  // let nonVatTotal = 0;

  if ((args.discountType || args.discountValue) && args.specialDiscountType) {
    throw Error("You can't mix regular discount and special discount.");
  }


  for (const item of args.items) {
    if (item.vatType === "ZERO_RATED" && args.specialDiscountType) {
      throw new Error("SC/PWD discount not allowed on zero-rated sales");
    }

    const itemTotal = item.unitPrice * item.quantity;

    switch (item.vatType) {
      case "VATABLE":
        vatablesTotal += itemTotal;
        break;
      case "VAT_EXEMPT":
        vatExemptTotal += itemTotal;
        break;
      case "ZERO_RATED":
        zeroRatedTotal += itemTotal;
        break;
      // case undefined:
      //   noVatTypeTotal += itemTotal;
      //   break;
      // case "NON_VAT":
      //   nonVatTotal += itemTotal;
      //   break;
    }
  }

  const grossTotal = round(
    vatablesTotal + vatExemptTotal + zeroRatedTotal
    // + noVatTypeTotal
    // + nonVatTotal
  );

  const vatableExclusiveAmount = round(
    vatablesTotal > 0 ? vatablesTotal / 1.12 : 0
  );
  // const originalVatAmount = round(vatableExclusiveAmount * VAT_RATE);

  let regularDiscountAmount = 0;
  if (args.discountType && args.discountValue) {
    if (args.discountType === "PERCENT") {
      regularDiscountAmount = round(grossTotal * (args.discountValue / 100));
    } else {
      regularDiscountAmount = round(args.discountValue);
    }
  }

  const discountRatio = grossTotal > 0 ? regularDiscountAmount / grossTotal : 0;

  const vatableAfterRegularDisc = round(
    vatableExclusiveAmount * (1 - discountRatio)
  );
  const exemptAfterRegularDisc = round(vatExemptTotal * (1 - discountRatio));
  const zeroRatedAfterRegularDisc = round(zeroRatedTotal * (1 - discountRatio));
  // const nonVatAfterRegularDisc = round(nonVatTotal * (1 - discountRatio));
  const noVatTypeAfterRegularDisc = round(noVatTypeTotal * (1 - discountRatio));

  // special discounts logic
  let specialDiscountAmount = 0;
  let vatableSales = 0;
  let vatExemptSales = 0;
  let zeroRatedSales = 0;
  let noVatTypeSales = 0;
  let vatAmount = 0;

  if (args.specialDiscountType) {
    // ang pag compute ng special discount ay depende sa item if inclusive or exclusive. Separate ang pag discount ng 20%

    const scDiscountOnVatable = round(
      vatableAfterRegularDisc * SPECIAL_DISCOUNT_RATE
    );
    const scDiscountOnExempt = round(
      exemptAfterRegularDisc * SPECIAL_DISCOUNT_RATE
    );
    const scDiscountOnZeroRated = round(
      zeroRatedAfterRegularDisc * SPECIAL_DISCOUNT_RATE
    );
    const scDiscountOnNoVat = round(
      noVatTypeAfterRegularDisc * SPECIAL_DISCOUNT_RATE
    );

    specialDiscountAmount = round(
      scDiscountOnVatable + scDiscountOnExempt + scDiscountOnZeroRated
      // + scDiscountOnNonVat
    );

    // BIR Rule: ALL sales become VAT-EXEMPT for SC/PWD
    vatableSales = 0;
    vatAmount = 0;

    // vat exempt na mapuounta after special discount
    vatExemptSales = round(
      vatableAfterRegularDisc -
      scDiscountOnVatable +
      (exemptAfterRegularDisc - scDiscountOnExempt) +
      (noVatTypeAfterRegularDisc - scDiscountOnNoVat)
    );
    zeroRatedSales = round(zeroRatedAfterRegularDisc - scDiscountOnZeroRated);
    // nonVatSales = 0;
  }
  // else if (args.specialDiscountType === "SP") {
  //   // SOLO PARENT Discount logic
  //   const spDiscountOnVatable = round(vatableAfterRegularDisc * SOLO_PARENT_DISCOUNT_RATE)
  //   const spDiscountOnExempt = round(exemptAfterRegularDisc * SOLO_PARENT_DISCOUNT_RATE);
  //   const spDiscountOnZeroRated = round(zeroRatedAfterRegularDisc * SOLO_PARENT_DISCOUNT_RATE);

  //   specialDiscountAmount = round(
  //     spDiscountOnVatable + spDiscountOnExempt + spDiscountOnZeroRated
  //   )

  //   vatableSales = round(vatableAfterRegularDisc - spDiscountOnVatable);
  //   vatAmount = round(vatableSales * VAT_RATE);
  //   vatExemptSales = round(exemptAfterRegularDisc - spDiscountOnExempt);
  //   zeroRatedSales = round(zeroRatedAfterRegularDisc - spDiscountOnZeroRated);
  // }
  else {
    // Regular transaction (no SC/PWD)
    vatableSales = vatableAfterRegularDisc;
    vatAmount = round(vatableSales * VAT_RATE);
    vatExemptSales = exemptAfterRegularDisc;
    zeroRatedSales = zeroRatedAfterRegularDisc; // no vat rate applied
    noVatTypeSales = noVatTypeAfterRegularDisc;
  }

  const netAmount = round(
    vatExemptSales + vatableSales + zeroRatedSales + noVatTypeSales
  );
  const totalAmount = round(netAmount + vatAmount);

  const total = formatCurrency(totalAmount, "PHP");
  return {
    // Gross amounts
    grossTotal: round(grossTotal), // Total before any discounts
    total,
    // Discounts
    regularDiscountAmount, // Regular discount (percent/fixed)
    specialDiscountAmount, // SC/PWD discount (20%)

    // BIR-required sales breakdown
    vatableSales, // Sales subject to VAT (0 if SC/PWD)
    vatAmount, // VAT amount (0 if SC/PWD)
    vatExemptSales, // VAT-exempt sales
    zeroRatedSales, // Zero-rated sales
    // nonVatSales, // NON-VAT sales

    // Totals
    netAmount, // After discounts, before VAT
    totalAmount, // Final amount to pay
  };

  // // gross after deductions
  // let grossTotal = 0
  // for (const item of args.items) {
  //   grossTotal += item.unitPrice * item.quantity
  // }

  // // normal discount
  // let discountAmount = 0;
  // if (args.discountType && args.discountValue) {
  //   if (args.discountType === "PERCENT") {
  //     discountAmount = grossTotal * (args.discountValue / 100);
  //   } else if (args.discountType === "FIXED") {
  //     discountAmount = args.discountValue
  //   }
  // }

  // const afterRegularDiscount = grossTotal - discountAmount;

  // // special discounts ( sc / sp / pwd / naac / mov)
  // let specialDiscountAmount = 0;
  // let taxAmount = 0; // VAT
  // let vatableSales = 0;
  // let vatExemptSales = 0;
  // let netAmount = 0;

  // if (args.taxType === 'VAT') {
  //   vatableSales = afterRegularDiscount / 1.12

  //   if (args.specialDiscountType) {
  //     // sc / pwd: 20% discount on vatable sales
  //     specialDiscountAmount = vatableSales * SPECIAL_DISCOUNT_RATE
  //     vatExemptSales = specialDiscountAmount
  //     vatableSales = vatableSales - specialDiscountAmount

  //     // VAT only on remaining vatable sales 12% of vatable sales
  //     taxAmount = vatableSales * VAT_RATE; // -- is this part really needed?

  //     netAmount = vatableSales + taxAmount + vatExemptSales
  //   } else {
  //     taxAmount = vatableSales * VAT_RATE
  //     netAmount = afterRegularDiscount
  //   }
  // } else if (args.taxType === "NON_VAT") {
  //   if (args.specialDiscountType) {
  //     specialDiscountAmount = afterRegularDiscount * SPECIAL_DISCOUNT_RATE;
  //   }

  //   netAmount = afterRegularDiscount - specialDiscountAmount;
  //   taxAmount = 0;
  // } else {
  //   // TODO other tax types
  // }

  // const totalAmount = netAmount;

  // return {
  //   grossTotal,                  // Original total (VAT-inclusive if VAT)
  //   discountAmount,              // Regular discount
  //   specialDiscountAmount,       // SC/PWD discount (on vatable sales)
  //   vatableSales,               // Sales subject to VAT (after SC discount)
  //   vatExemptSales,             // VAT-exempt sales (SC discounted portion)
  //   taxAmount,                  // VAT amount (12% on vatable sales)
  //   netAmount,                  // After all discounts
  //   totalAmount,                // Final amount
  // };

  // if (args.specialDiscountType) {
  //   if (args.taxType == "VAT") {
  //     const vatableSales = afterRegularDiscount / 1.12;
  //     specialDiscountAmount = vatableSales * SPECIAL_DISCOUNT_RATE
  //   } else if (args.taxType === "NON_VAT") {
  //     specialDiscountAmount = afterRegularDiscount * SPECIAL_DISCOUNT_RATE
  //   } // TODO handle other tax types
  // }

  // const netAmount = afterRegularDiscount - specialDiscountAmount;

  // let taxAmount = 0;
  // let vatableSales = 0;
  // let vatExemptSales = 0;

  // if (args.taxType === "VAT") {
  //   if (args.specialDiscountType) {
  //     const totalVatableSales = afterRegularDiscount / 1.12;
  //     vatExemptSales = specialDiscountAmount // discounted portion daw ay vat exempt
  //     vatableSales = totalVatableSales - (specialDiscountAmount / 1.12)
  //     taxAmount = vatableSales * VAT_RATE
  //   } else {
  //     // Regular VAT calculation
  //     vatableSales = netAmount / 1.12;
  //     taxAmount = vatableSales * VAT_RATE;
  //   }
  // }

  // const totalAmount = netAmount + taxAmount;

  // return {
  //   subTotal,
  //   discountAmount,
  //   specialDiscountAmount,
  //   netAmount,
  //   taxAmount,
  //   vatableSales,
  //   vatExemptSales,
  //   totalAmount,
  // }
};

export function formatTIN(value: string) {
  return value
    .replace(/\D/g, "") // remove non-digits
    .slice(0, 12) // max 12 digits
    .replace(/(\d{3})(?=\d)/g, "$1-");
}
