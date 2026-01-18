"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const SubscriberGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If there is no user and tried to access the /subscriber
      if (!user && pathname === "/subscriber") {
        router.push("/auth");
      }
      // if there is a user and tried to access the /auth
      if (user && pathname === "/auth") {
        router.push("/subscriber");
      }
    }
  }, [user, pathname, isLoading, router]);

  if (isLoading) {
    return <div>subscriber loading...</div>; // Or your loading component
  }

  return <>{children}</>;
};
