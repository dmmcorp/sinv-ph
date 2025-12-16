"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";

export const OnboardingNavbar = () => {
  const { signOut } = useAuthActions();
  const { user, isLoading } = useCurrentUser();

  if (isLoading || user === undefined) return <div>Loading...</div>;

  return (
    <nav className="flex justify-between py-2 px-12 w-full border-b border-gray-300 shadow-sm bg-white">
      <h1>SINVPH</h1>

      <div className="hidden lg:flex gap-12 items-center">
        <p className="text-muted-foreground">{user!.email}</p>
        <div className="border-r border-gray-300 h-7" />
        <Button onClick={async () => await signOut()}>Logout</Button>
      </div>
    </nav>
  );
};
