import { useBusinessProfileSync } from "@/hooks/use-business-profile";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/lib/types";

export const DUMMY_HEADER_LEFT = {
  container: {
    alignment: "left",
    padding: { top: 26, right: 26, bottom: 26, left: 26 },
    backgroundColor: null,
    borderBottom: {
      enabled: true,
      color: "#E5E7EB",
      width: 1,
    },
  },

  logo: {
    display: "none",
    position: "left",
    maxWidth: 120,
    maxHeight: 60,
  },

  businessName: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: 700,
      color: "#111827",
      textTransform: "uppercase",
      textAlign: "left",
      lineHeight: 1.2,
    },
  },

  businessMeta: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#6B7280",
      lineHeight: 1.4,
      textAlign: "left",
    },
    spacingTop: 4,
  },

  invoiceTitle: {
    visible: true,
    variant: "invoice",
    style: {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: 600,
      color: "#111827",
      textAlign: "left",
    },
  },

  invoiceMeta: {
    layout: "stacked",
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#374151",
      lineHeight: 1.5,
      textAlign: "left",
    },
  },
};

type Props = {
  config: typeof DUMMY_HEADER_LEFT; // it comes from convex/templates.ts
};

export function InvoiceBusinessHeader({ config }: Props) {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  );
}
