"use client";

import { useHasUserBoarded } from "@/hooks/use-has-user-boarded";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const OnboardingGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { hasUserBoarded, isLoading } = useHasUserBoarded();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If user hasn't boarded and not on onboarding page, redirect to onboarding
      if (hasUserBoarded === false && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
      // If user has boarded and on onboarding page, redirect to home
      if (hasUserBoarded === true && pathname === "/onboarding") {
        router.push("/subscriber");
      }
    }
  }, [hasUserBoarded, isLoading, pathname, router]);

  if (isLoading || (hasUserBoarded === false && pathname !== "/onboarding")) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <>{children}</>;
};
