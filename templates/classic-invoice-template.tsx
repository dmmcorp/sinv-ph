// templates/classic/ClassicInvoiceTemplate.tsx
import React from "react";

import { InvoiceTemplateProps } from "@/lib/types/invoice";
import {
  DUMMY_HEADER_LEFT,
  InvoiceBusinessHeader,
} from "@/components/subscriber/invoice/header/invoice-business-header";

export const ClassicInvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  metadata,
  settings,
}) => {
  return (
    <div className="relative a4-size flex flex-col min-h-185  lg:min-h-312 mx-auto border-2  rounded-2xl space-y-5 lg:space-y-10 ">
      <InvoiceBusinessHeader config={DUMMY_HEADER_LEFT} />
      {/* Other sections: LineItems, Totals */}
    </div>
  );
};
