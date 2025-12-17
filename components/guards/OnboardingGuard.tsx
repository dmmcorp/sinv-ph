"use client";

import { useHasUserBoarded } from "@/hooks/use-has-user-boarded";
import { useOnboardingStore } from "@/stores/onboarding/useOnboardingStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const OnboardingGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { justCompleted, setJustCompleted } = useOnboardingStore();
  const { hasUserBoarded, isLoading } = useHasUserBoarded();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If user hasn't boarded and not on onboarding page, redirect to onboarding
      if (hasUserBoarded === false && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
      console.log(justCompleted);

      //User that just submitted the onboarding information
      if (
        hasUserBoarded === true &&
        pathname === "/onboarding" &&
        justCompleted
      ) {
        router.push("/onboarding/success");
      }
      // Not a fresh acount
      // If user has boarded and on onboarding page, redirect to home
      if (
        hasUserBoarded === true &&
        pathname === "/onboarding" &&
        !justCompleted
      ) {
        router.push("/subscriber");
      }
    }
  }, [justCompleted, hasUserBoarded, isLoading, pathname, router]);

  if (isLoading || (hasUserBoarded === false && pathname !== "/onboarding")) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <>{children}</>;
};

// "use client";

// import { useHasUserBoarded } from "@/hooks/use-has-user-boarded";
// import { useOnboardingStore } from "@/stores/onboarding/useOnboardingStore";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";

// const ONBOARDING_ROUTES = new Set(["/onboarding", "/onboarding/success"]);

// export const OnboardingGuard = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const { justCompleted, setJustCompleted } = useOnboardingStore();
//   const { hasUserBoarded, isLoading } = useHasUserBoarded();
//   const pathname = usePathname();
//   const router = useRouter();

//   const isOnboardingRoute = ONBOARDING_ROUTES.has(pathname);

//   useEffect(() => {
//     if (isLoading) return;

//     if (justCompleted && pathname === "/onboarding/success") {
//       setJustCompleted(false); // reset
//       return;
//     }

//     // 🚫 User NOT onboarded → force onboarding
//     if (!hasUserBoarded && !isOnboardingRoute) {
//       setJustCompleted(false);
//       router.push("/onboarding");
//       return;
//     }

//     // 🚫 User onboarded → block onboarding form
//     //onboarder = true
//     if (hasUserBoarded && pathname === "/onboarding") {
//       console.log(justCompleted);
//       if (justCompleted) {
//         return;
//       } else {
//         router.push("/subscriber");
//       }
//     }
//   }, [
//     justCompleted,
//     setJustCompleted,
//     hasUserBoarded,
//     isLoading,
//     isOnboardingRoute,
//     pathname,
//     router,
//   ]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return <>{children}</>;
// };
