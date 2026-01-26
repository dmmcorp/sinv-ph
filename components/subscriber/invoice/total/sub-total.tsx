import { useCalculateInvioceAmount } from "@/hooks/use-calculate-invoice-amount";
import { formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import React from "react";

interface SubTotalProps {
  subtotalClasses: string;
}

function SubTotal({ subtotalClasses }: SubTotalProps) {
  const total = useCalculateInvioceAmount();
  const invoice = useInvoiceStore();

  return (
    <div className="grid grid-cols-12 gap-x-1 font-semibold text-[0.4rem] sm:text-[0.6rem] md:text-sm lg:text-base">
      <div className="col-span-3"></div>
      <div className={`col-span-6 text-right ${subtotalClasses}`}>
        Subtotal:
      </div>
      <div className={`col-span-3 text-right pr-2 ${subtotalClasses}`}>
        {formatCurrency(total.grossTotal, invoice.selectedCurrency)}
      </div>
    </div>
  );
}

export default SubTotal;
