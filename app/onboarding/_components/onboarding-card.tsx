import {
  BriefcaseBusiness,
  CircleAlert,
  ImageIcon,
  MapPinHouse,
} from "lucide-react";

const ONBOARDING_STEPS = [
  {
    icon: BriefcaseBusiness,
    name: "Add Business Name",
    description:
      "Your business name will appear on all invoices and helps establish your professional brand with clients.",
  },
  {
    icon: CircleAlert,
    name: "Add TIN",
    description:
      "Required for tax compliance and legal documentation. Your Tax Identification Number ensures invoices meet regulatory requirements.",
  },
  {
    icon: MapPinHouse,
    name: "Add Business Address",
    description:
      "Essential for professional invoices and legal purposes. Provides clients with contact information and meets invoicing standards.",
  },
  {
    icon: ImageIcon,
    name: "Add Business Logo",
    description:
      "Enhances brand recognition and makes your invoices look professional. A logo helps clients instantly identify your business.",
  },
];

export const OnboardingCard = () => {
  return (
    <div className="w-[40%] h-[800px] pb-12 pt-24 flex flex-col items-center space-y-5 bg-linear-to-b from-[#ecf2fb] to-[#f5ebef] rounded-lg">
      <p className="text-gray-800 flex gap-3">
        <CircleAlert className="text-gray-800" />
        Get started by setting up your business profile.
      </p>

      <div className="flex flex-col gap-10">
        {ONBOARDING_STEPS.map((step, index) => (
          <div className="flex flex-row gap-7" key={index}>
            <div className="bg-white rounded-full aspect-square h-12 w-12 flex items-center justify-center shadow-md">
              <step.icon className="text-sky-500" />
            </div>

            <div className="max-w-[500px]">
              <h1 className="text-[24px]">{step.name}</h1>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
