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
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col justify-between min-h-dvh max-h-dvh  ${poppinsFont.className}`}
    >
      <OnboardingNavbar />

      {children}
      <footer className="w-full border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          {/* Left */}
          <p>© {new Date().getFullYear()} YourCompany. All rights reserved.</p>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="hover:text-foreground transition">
              Privacy Policy
            </button>
            <button className="hover:text-foreground transition">
              Terms of Service
            </button>
            <span className="hidden sm:inline">•</span>
            <span>BIR-compliant invoices</span>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
