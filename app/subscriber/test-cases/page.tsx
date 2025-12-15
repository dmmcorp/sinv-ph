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
      items: [{ unitPrice: 1120.37, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
    });
    console.log("TEST CASE 1: Single VATABLE item — No discount", vatExample);

    // TEST CASE 2: Single VATABLE item — SC / PWD
    const testCase2 = calculateInvoiceAmounts({
      items: [{ unitPrice: 1120, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 2: Single VATABLE item — SC / PWD", testCase2);

    // TEST CASE 3: Single VAT-EXEMPT item — No discount
    const testCase3 = calculateInvoiceAmounts({
      items: [{ unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" }],
      taxType: "VAT_EXEMPT",
    });
    console.log("TEST CASE 3: Single VAT-EXEMPT item — No discount", testCase3);

    // TEST CASE 4: Single VAT-EXEMPT item — SC / PWD
    const testCase4 = calculateInvoiceAmounts({
      items: [{ unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" }],
      taxType: "VAT_EXEMPT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 4: Single VAT-EXEMPT item — SC / PWD", testCase4);

    // TEST CASE 5: Mixed: VATABLE + NON-VAT — No discount
    const testCase5 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 1120, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 500, quantity: 1, vatType: "NON_VAT" },
      ],
      taxType: "MIXED",
    });
    console.log(
      "TEST CASE 5: Mixed: VATABLE + NON-VAT — No discount",
      testCase5
    );

    // TEST CASE 6: Mixed: VATABLE + NON-VAT — SC / PWD
    const testCase6 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 1120, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 500, quantity: 1, vatType: "NON_VAT" },
      ],
      taxType: "MIXED",
      specialDiscountType: "PWD",
    });
    console.log("TEST CASE 6: Mixed: VATABLE + NON-VAT — SC / PWD", testCase6);

    // TEST CASE 7: Multiple VATABLE items — No discount
    const testCase7 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
      ],
      taxType: "VAT",
    });
    console.log("TEST CASE 7: Multiple VATABLE items — No discount", testCase7);

    // TEST CASE 8: Multiple VATABLE items — SC / PWD
    const testCase8 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
      ],
      taxType: "VAT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 8: Multiple VATABLE items — SC / PWD", testCase8);

    // TEST CASE 9: Multiple NON-VAT items — No discount
    const testCase9 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 300, quantity: 1, vatType: "NON_VAT" },
        { unitPrice: 200, quantity: 1, vatType: "NON_VAT" },
      ],
      taxType: "NON_VAT",
    });
    console.log("TEST CASE 9: Multiple NON-VAT items — No discount", testCase9);

    // TEST CASE 10: Multiple NON-VAT items — SC / PWD
    const testCase10 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 300, quantity: 1, vatType: "VAT_EXEMPT" },
        { unitPrice: 200, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "VAT_EXEMPT",
      specialDiscountType: "PWD",
    });

    console.log("TEST CASE 10: Multiple NON-VAT items — SC / PWD", testCase10);
  }, []);

  return (
    <div>
      <Button onClick={async () => await signOut()}>logout</Button>
    </div>
  );
}

export default TestCasesPage;
