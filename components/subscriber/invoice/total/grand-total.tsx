import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import React from "react";

interface GrandTotalProps {
  grandTotalClasses: string;
}
function GrandTotal({ grandTotalClasses }: GrandTotalProps) {
  const invoice = useInvoiceStore();
  const total = useCalculateInvioceAmount();
  const lineClasses = `text-right ${grandTotalClasses}`;

  return (
    <div className="grid grid-cols-12 gap-x-1 font-semibold  mt-2 lg:mt-5">
      <div className="col-span-3 "></div>
      <h1 className={`col-span-6 text-nowrap  ${lineClasses}`}>
        Total Amount:
      </h1>
      <h1 className={`col-span-3  pr-2 ${lineClasses} `}>
        {formatCurrency(total.totalAmount, invoice.selectedCurrency)}
      </h1>
    </div>
  );
}

export default GrandTotal;
