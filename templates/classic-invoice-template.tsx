// templates/classic/ClassicInvoiceTemplate.tsx
import React from "react";

import { InvoiceTemplateProps } from "@/lib/types/invoice";
import {
  DUMMY_HEADER_LEFT,
  InvoiceBusinessHeader,
} from "@/components/subscriber/invoice/header/invoice-business-header";
import InvoiceMeta from "@/components/subscriber/invoice/header/invoice-meta";
import HeaderContainer, {
  HeaderContainerDummy,
} from "@/components/subscriber/invoice/header/header-container";

export const ClassicInvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  metadata,
  settings,
}) => {
  return (
    <div className="relative a4-size flex flex-col min-h-185  lg:min-h-312 mx-auto border-2  rounded-2xl space-y-5 lg:space-y-10 ">
      <HeaderContainer config={HeaderContainerDummy}>
        <InvoiceBusinessHeader config={DUMMY_HEADER_LEFT} />
        <InvoiceMeta config={DUMMY_HEADER_LEFT} />
      </HeaderContainer>
      {/* Other sections: LineItems, Totals */}
    </div>
  );
};
