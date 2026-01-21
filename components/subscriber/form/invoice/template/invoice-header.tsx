import { useBusinessProfileSync } from "@/hooks/use-business-profile";
import Image from "next/image";
import InvoiceNumber from "../invoice-no";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/lib/types";
import { DUMMY_HEADER_LEFT, DUMMY_INVOICE_HEADER_DATA } from "./dummy-data";

type Props = {
  config: typeof DUMMY_HEADER_LEFT; // it comes from convex/templates.ts
  form: UseFormReturn<InvoiceFormValues>;
};

export function InvoiceHeader({ form, config }: Props) {
  const layoutClass = getHeaderLayout(config.container.alignment);
  const { businessProfile } = useBusinessProfileSync();

  const formatedTin = () => {
    const businessType = businessProfile?.businessType;
    switch (businessType) {
      case "Freelancer/Individual":
        return businessProfile?.tin;
      case "Small Business":
        return businessProfile?.tin
          ? "NON-VAT REG TIN " + businessProfile?.tin
          : "";
      case "VAT-Registered Business":
        return businessProfile?.tin
          ? "VAT REG TIN " + businessProfile?.tin
          : "";
      default:
        return businessProfile?.tin;
    }
  };
  return (
    <header
      className={`
        flex ${layoutClass}
        ${config.container.borderBottom.enabled ? "border-y   border-gray-200" : ""}
      `}
      style={{
        padding: `${config.container.padding.top}px
                    ${config.container.padding.right}px
                    ${config.container.padding.bottom}px
                    ${config.container.padding.left}px`,
      }}
    >
      <div className="">
        {businessProfile && businessProfile.logoUrl !== "" && (
          <div
            className="relative w-30 h-30 lg:w-40 lg:h-20 bg-transparent "
            style={{
              display: config.logo.display,
            }}
          >
            <Image
              src={businessProfile.logoUrl}
              alt={businessProfile?.businessName ?? ""}
              fill
              className="object-contain"
              style={{
                maxWidth: config.logo.maxWidth,
              }}
            />
          </div>
        )}
        <div className="">
          <h3
            className="invoice-text font-bold "
            style={{
              fontSize: config.businessName.style.fontSize,
              fontWeight: config.businessName.style.fontWeight,
              color: config.businessName.style.color,
              textAlign: config.businessName.style.textAlign as any,
            }}
          >
            {businessProfile?.businessName}
          </h3>
          {/* <p className="invoice-text ">{businessProfile?.sellerName}</p> */}
          <h5
            className="invoice-text"
            style={{
              fontSize: config.businessMeta.style.fontSize,
              color: config.businessMeta.style.color,
            }}
          >
            {formatedTin()}
          </h5>
          <h5
            className="invoice-text"
            style={{
              fontSize: config.businessMeta.style.fontSize,
              color: config.businessMeta.style.color,
            }}
          >
            {businessProfile?.address}
          </h5>
        </div>
      </div>
      <div className="">
        <h1
          className=""
          style={{
            fontSize: config.invoiceTitle.style.fontSize,
            fontWeight: config.invoiceTitle.style.fontWeight,
          }}
        >
          INVOICE
        </h1>
        <div>
          <div className="grid grid-cols-2 items-center gap-x-2 text-[0.6rem] sm:text-xs lg:text-lg text-nowrap">
            <h3
              className="text-nowrap invoice-text font-normal"
              style={{
                fontSize: config.invoiceMeta.style.fontSize,
              }}
            >
              Invoice No.
            </h3>
            <InvoiceNumber
              form={form}
              style={{
                fontSize: config.invoiceMeta.style.fontSize,
              }}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-x-2 invoice-text font-normal">
            <h3 style={{ fontSize: config.invoiceMeta.style.fontSize }}>
              Date Issued:
            </h3>
            <h3 style={{ fontSize: config.invoiceMeta.style.fontSize }}>
              {new Date().toISOString().split("T")[0]}
            </h3>
          </div>
        </div>
      </div>
    </header>
  );
}

function getHeaderLayout(alignment: string) {
  switch (alignment) {
    case "left":
      return "flex-row justify-between items-start ";
    case "right":
      return "flex-row justify-between items-end flex-row-reverse";
    case "space-between":
    default:
      return "flex-row justify-between items-start";
  }
}
