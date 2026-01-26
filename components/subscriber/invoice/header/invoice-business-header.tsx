import { useBusinessProfileSync } from "@/hooks/use-business-profile";
import Image from "next/image";

interface BusinessInfoProps {
  textColor: string;
  businessInfo: BusinessInfo;
  visibility: BusinessDetails;
}

interface BusinessInfo {
  logoSizeClass: string;
  businessName: string;
  businessMeta: string;
}

interface BusinessDetails {
  logo: boolean;
  businessName: boolean;
  address: boolean;
  contactDetails: boolean;
}
export function InvoiceBusinessHeader({
  textColor,
  businessInfo,
  visibility,
}: BusinessInfoProps) {
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
      {businessProfile && visibility.logo && businessProfile.logoUrl !== "" && (
        <div className={`relative ${businessInfo.logoSizeClass}`}>
          <Image
            src={businessProfile.logoUrl}
            alt={businessProfile?.businessName ?? ""}
            fill
            className={`object-contain size-full`}
          />
        </div>
      )}
      <div className="">
        <h3 className={`${businessInfo.businessName} ${textColor}`}>
          {businessProfile?.businessName}
        </h3>
        {/* <p className="invoice-text ">{businessProfile?.sellerName}</p> */}
        <h5 className={`${businessInfo.businessMeta} ${textColor}`}>
          {formatedTin()}
        </h5>
        <h5 className={`${businessInfo.businessMeta} ${textColor}`}>
          {businessProfile?.address}
        </h5>
      </div>
    </div>
  );
}
