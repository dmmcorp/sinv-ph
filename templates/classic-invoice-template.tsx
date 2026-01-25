// templates/classic/ClassicInvoiceTemplate.tsx
import React from "react";

import { TemplateSettings } from "@/lib/types/invoice";
import { InvoiceBusinessHeader } from "@/components/subscriber/invoice/header/invoice-business-header";
import InvoiceMeta from "@/components/subscriber/invoice/header/invoice-meta";
import InvoiceContainer from "@/components/subscriber/invoice/invoice-container";
import InvoiceCustomerInfo from "@/components/subscriber/invoice/customer/invoice-customer-info";
import {
  resolveCustomerClasses,
  resolveHeaderClasses,
} from "./resolvers/template-resolver";

interface ClassicInvoiceTemplateProps {
  templateSettings: TemplateSettings;
}

export const ClassicInvoiceTemplate = ({
  templateSettings,
}: ClassicInvoiceTemplateProps) => {
  const headerInfo = resolveHeaderClasses(templateSettings.headerSection);

  const cusotmerInfo = resolveCustomerClasses(templateSettings.customerSection);

  return (
    <div className="relative a4-size flex flex-col min-h-185  lg:min-h-312 mx-auto border-2  rounded-2xl space-y-3">
      {/* header information such as business name, logo, invoice no, date */}
      <InvoiceContainer config={headerInfo.container}>
        <InvoiceBusinessHeader
          textColor={headerInfo.textColor}
          businessInfo={headerInfo.businessInfo}
          visibility={headerInfo.visibility.businessDetails}
        />
        <InvoiceMeta
          textColor={headerInfo.textColor}
          invoice={headerInfo.invoice}
          visibility={headerInfo.visibility.businessMeta}
        />
      </InvoiceContainer>

      {/* Customer information */}
      <InvoiceContainer config={cusotmerInfo.container}>
        <InvoiceCustomerInfo config={cusotmerInfo} />
      </InvoiceContainer>
    </div>
  );
};
