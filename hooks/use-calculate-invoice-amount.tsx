import {
  DiscountType,
  SpecialDiscountType,
} from "@/lib/constants/DISCOUNT_TYPES";
import { TaxType } from "@/lib/constants/TAX_TYPES";
import { calculateInvoiceAmounts } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";

export const useCalculateInvioceAmount = () => {
  const { selectedItems } = useInvoiceStore();
  const removeIds = selectedItems.map((item) => {
    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.price,
      vatType: item.vatType,
    };
  });
  const data = {
    items: removeIds,
  };
  const {
    grossTotal,
    // Discounts
    regularDiscountAmount,
    specialDiscountAmount,
    // BIR-required sales breakdown
    vatableSales,
    vatAmount,
    vatExemptSales,
    zeroRatedSales,
    // Totals
    netAmount,
    totalAmount,
  } = calculateInvoiceAmounts(data);

  return {
    grossTotal,
    // Discounts
    regularDiscountAmount,
    specialDiscountAmount,
    // BIR-required sales breakdown
    vatableSales,
    vatAmount,
    vatExemptSales,
    zeroRatedSales,
    // Totals
    netAmount,
    totalAmount,
  };
};
