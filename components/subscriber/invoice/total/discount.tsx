import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import React from "react";
interface DiscountProps {
  discountClasses: string;
}

function Discount({ discountClasses }: DiscountProps) {
  const invoice = useInvoiceStore();
  const total = useCalculateInvioceAmount();

  const lineClasses = `text-right ${discountClasses}`;
  return (
    <>
      {invoice.includeDiscount && (
        <div>
          {invoice.isPercentage && (
            <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
              <div className="col-span-3"></div>
              <div className={`col-span-6 ${lineClasses}`}>Discount %:</div>
              <div className={`col-span-3 pr-2 ${lineClasses}`}>
                {invoice.discountValue}%
              </div>
            </div>
          )}
          <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3"></div>
            <div className={`col-span-6 ${lineClasses}`}>Discount Amount:</div>
            <div className={`col-span-3 pr-2 ${lineClasses}`}>
              {invoice.isSpecialDiscount ? (
                <>
                  {total.specialDiscountAmount > 1 && (
                    <span className="font-semibold mr-2">-</span>
                  )}
                  {formatCurrency(
                    total.specialDiscountAmount,
                    invoice.selectedCurrency,
                  )}
                </>
              ) : (
                <>
                  {total.regularDiscountAmount > 1 && (
                    <span className="font-semibold mr-2">-</span>
                  )}
                  {formatCurrency(
                    total.regularDiscountAmount,
                    invoice.selectedCurrency,
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Discount;
