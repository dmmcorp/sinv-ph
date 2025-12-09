"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const OnboardingPage = () => {
  const { signOut } = useAuthActions();

  return <Button onClick={async () => await signOut()}>Sign Out</Button>;
};

export default OnboardingPage;
