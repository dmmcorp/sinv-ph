"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useHasUserBoarded } from "@/hooks/use-has-user-boarded";
import { useOnboardingStore } from "@/stores/onboarding/useOnboardingStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingWithLogo from "../loading-with-logo";

export const AppGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { hasUserBoarded, isLoading: onboardLoading } = useHasUserBoarded();
  const { justCompleted } = useOnboardingStore();

  const pathname = usePathname();
  const router = useRouter();

  const isLoading = userLoading || onboardLoading;

  useEffect(() => {
    if (isLoading) return;

    // 1️⃣ Not authenticated
    if (!user && pathname !== "/auth") {
      router.replace("/auth");
      return;
    }

    // 2️⃣ Authenticated but not onboarded
    if (user && hasUserBoarded === false && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    // 3️⃣ Just completed onboarding
    if (user && hasUserBoarded && pathname === "/onboarding" && justCompleted) {
      router.replace("/onboarding/success");
      return;
    }

    // 4️⃣ Authenticated + onboarded but visiting onboarding
    if (
      user &&
      hasUserBoarded &&
      pathname === "/onboarding" &&
      !justCompleted
    ) {
      router.replace("/subscriber");
    }
  }, [user, hasUserBoarded, isLoading, pathname, justCompleted, router]);

  if (isLoading) {
    return <LoadingWithLogo />;
  }

  return <>{children}</>;
};
