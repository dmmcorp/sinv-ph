"use client";
import { Button } from "@/components/ui/button";
import { calculateInvoiceAmounts } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

function TestCasesPage() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    // VAT example (VATABLE item)
    const vatExample = calculateInvoiceAmounts({
      items: [{ unitPrice: 1120, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      // specialDiscountType: "SC", // SC special discount
    });
    console.log("TEST CASE 1: Single VATABLE item — No discount", vatExample);
  }, []);

  return (
    <div>
      <Button onClick={async () => await signOut()}>logout</Button>
    </div>
  );
}

export default TestCasesPage;
