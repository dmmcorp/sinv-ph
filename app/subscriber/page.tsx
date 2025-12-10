"use client";
import Dashboard from "@/components/subscriber/pages/dashboard/dashboard";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

function Page() {
  const { signOut } = useAuthActions();

  return (
    <div>
      <Dashboard />
      <Button onClick={async () => await signOut()}>logout</Button>
    </div>
  );
}

export default Page;
