import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import { VAT_RATE_PERCENTAGE } from "@/lib/constants/VAT_RATE";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import React from "react";

interface TaxBreakDownProps {
  taxBreakdownClasses: string;
}

function TaxBreakDown({ taxBreakdownClasses }: TaxBreakDownProps) {
  const invoice = useInvoiceStore();
  const total = useCalculateInvioceAmount();
  return (
    <div>
      {invoice.includeTax && (
        <>
          <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3 "></div>
            <div className={`col-span-6 text-right ${taxBreakdownClasses}`}>
              Vatable Sales:
            </div>
            <div
              className={`col-span-3 text-right pr-2 ${taxBreakdownClasses}`}
            >
              {formatCurrency(total.vatableSales, invoice.selectedCurrency)}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-1 font-semibold  sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3 "></div>
            <div className={`col-span-6 text-right ${taxBreakdownClasses}`}>
              VAT-Exempt Sales:
            </div>
            <div
              className={`col-span-3  text-right pr-2 ${taxBreakdownClasses}`}
            >
              {formatCurrency(total.vatExemptSales, invoice.selectedCurrency)}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-1 font-semibold  sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3"></div>
            <div className={`col-span-6 text-right ${taxBreakdownClasses}`}>
              Zero-Rated Sales:
            </div>
            <div
              className={`col-span-3 text-right pr-2 ${taxBreakdownClasses}`}
            >
              {formatCurrency(total.zeroRatedSales, invoice.selectedCurrency)}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3"></div>
            <div className={`col-span-6 text-right ${taxBreakdownClasses}`}>
              Tax%:
            </div>
            <div
              className={`col-span-3 font-light text-right pr-2 invoice-text`}
            >
              {VAT_RATE_PERCENTAGE}%
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
            <div className="col-span-3"></div>
            <div className={`col-span-6 text-right ${taxBreakdownClasses}`}>
              VAT:
            </div>
            <div
              className={`col-span-3 text-right pr-2 ${taxBreakdownClasses}`}
            >
              {formatCurrency(total.vatAmount, invoice.selectedCurrency)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaxBreakDown;
