import useClientSelection from "@/stores/client/useClientSelection";
import { CustomerInfo } from "@/templates/resolvers/template-resolver";

interface InvoiceCustomerInfoProps {
  config: CustomerInfo;
}

function InvoiceCustomerInfo({ config }: InvoiceCustomerInfoProps) {
  const client = useClientSelection();
  return (
    <div className="flex justify-between pl-8 pr-8">
      <div className="">
        <h3 className="text-[0.6rem] uppercase">Customer details:</h3>
        <div>
          <h3 className={`${config.customerName} uppercase`}>
            {client?.selectedClient?.name}
          </h3>
          {config.visibility?.address && (
            <p className={config.customerMeta}>
              {client?.selectedClient?.address}
            </p>
          )}
          {config.visibility?.email && (
            <p className={config.customerMeta}>
              {client?.selectedClient?.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceCustomerInfo;
