import { TemplateSettings } from "@/lib/types/invoice";
import { InvoiceBusinessHeader } from "@/components/subscriber/invoice/header/invoice-business-header";
import InvoiceMeta from "@/components/subscriber/invoice/header/invoice-meta";
import InvoiceContainer from "@/components/subscriber/invoice/invoice-container";
import InvoiceCustomerInfo from "@/components/subscriber/invoice/customer/invoice-customer-info";
import {
  resolveCustomerClasses,
  resolveHeaderClasses,
  resolveLineItemsClasses,
} from "./resolvers/template-resolver";
import { Table } from "@/components/ui/table";
import LineItemsHeader from "@/components/subscriber/invoice/line-items/line-items-header";
import LineItemsBody from "@/components/subscriber/invoice/line-items/line-items-body";

interface ClassicInvoiceTemplateProps {
  templateSettings: TemplateSettings;
}

export const ClassicInvoiceTemplate = ({
  templateSettings,
}: ClassicInvoiceTemplateProps) => {
  const headerInfoClasses = resolveHeaderClasses(
    templateSettings.headerSection,
  );

  const cusotmerInfoClasses = resolveCustomerClasses(
    templateSettings.customerSection,
  );
  const lineItemsClasses = resolveLineItemsClasses(
    templateSettings.lineItemsSection,
  );

  return (
    <div className="relative a4-size flex flex-col min-h-185  lg:min-h-312 mx-auto border-2  rounded-2xl space-y-3">
      {/* header information such as business name, logo, invoice no, date */}
      <InvoiceContainer config={headerInfoClasses.container}>
        <InvoiceBusinessHeader
          textColor={headerInfoClasses.textColor}
          businessInfo={headerInfoClasses.businessInfo}
          visibility={headerInfoClasses.visibility.businessDetails}
        />
        <InvoiceMeta
          textColor={headerInfoClasses.textColor}
          invoice={headerInfoClasses.invoice}
          visibility={headerInfoClasses.visibility.businessMeta}
        />
      </InvoiceContainer>

      {/* Customer information */}
      <InvoiceContainer config={cusotmerInfoClasses.container}>
        <InvoiceCustomerInfo config={cusotmerInfoClasses} />
      </InvoiceContainer>

      {/* Line items */}
      <InvoiceContainer config={lineItemsClasses.container}>
        <Table>
          <LineItemsHeader
            header={lineItemsClasses.header}
            visibleLineNumber={lineItemsClasses.lineNumber}
          />
          <LineItemsBody
            row={lineItemsClasses.row}
            data={lineItemsClasses.data}
            visibleLineNumber={lineItemsClasses.lineNumber}
          />
        </Table>
      </InvoiceContainer>
    </div>
  );
};
