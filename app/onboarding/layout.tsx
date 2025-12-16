import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { OnboardingNavbar } from "./_components/onboarding-navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Onboarding | SINVPH",
  description: "Complete your onboarding process",
};

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-200 ${poppinsFont.className}`}
    >
      <OnboardingNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex-1 w-full">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
