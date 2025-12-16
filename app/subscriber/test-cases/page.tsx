"use client";
import { Button } from "@/components/ui/button";
import { calculateInvoiceAmounts } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

function TestCasesPage() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    // VAT example (VATABLE item) (PASSED)
    const vatExample = calculateInvoiceAmounts({
      items: [{ unitPrice: 1120.37, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
    });
    console.log("TEST CASE 1: Single VATABLE item — No discount", vatExample);

    // TEST CASE 2: Single VATABLE item — SC / PWD (PASSED)
    const testCase2 = calculateInvoiceAmounts({
      items: [{ unitPrice: 1120, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 2: Single VATABLE item — SC / PWD", testCase2);

    // TEST CASE 3: Single VAT-EXEMPT item — No discount (PASSED)
    const testCase3 = calculateInvoiceAmounts({
      items: [{ unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" }],
      taxType: "VAT_EXEMPT",
    });
    console.log("TEST CASE 3: Single VAT-EXEMPT item — No discount", testCase3);

    // TEST CASE 4: Single VAT-EXEMPT item — SC / PWD (PASSED)
    const testCase4 = calculateInvoiceAmounts({
      items: [{ unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" }],
      taxType: "VAT_EXEMPT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 4: Single VAT-EXEMPT item — SC / PWD", testCase4);

    // TEST CASE 5: Mixed: VATABLE + NON-VAT — No discount (PASSED)
    const testCase5 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 1120, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "MIXED",
    });
    console.log(
      "TEST CASE 5: Mixed: VATABLE + NON-VAT — No discount",
      testCase5
    );

    // TEST CASE 6: Mixed: VATABLE + NON-VAT — SC / PWD (PASSED)
    const testCase6 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 1120, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 500, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "MIXED",
      specialDiscountType: "PWD",
    });
    console.log("TEST CASE 6: Mixed: VATABLE + NON-VAT — SC / PWD", testCase6);

    // TEST CASE 7: Multiple VATABLE items — No discount (PASSED)
    const testCase7 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
      ],
      taxType: "VAT",
    });
    console.log("TEST CASE 7: Multiple VATABLE items — No discount", testCase7);

    // TEST CASE 8: Multiple VATABLE items — SC / PWD (PASSED)
    const testCase8 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
      ],
      taxType: "VAT",
      specialDiscountType: "SC",
    });
    console.log("TEST CASE 8: Multiple VATABLE items — SC / PWD", testCase8);

    // TEST CASE 9: Multiple NON-VAT items — No discount (PASSED)
    const testCase9 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 300, quantity: 1, vatType: "VAT_EXEMPT" },
        { unitPrice: 200, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "NON_VAT",
    });
    console.log("TEST CASE 9: Multiple NON-VAT items — No discount", testCase9);

    // TEST CASE 10: Multiple NON-VAT items — SC / PWD (PASSED)
    const testCase10 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 300, quantity: 1, vatType: "VAT_EXEMPT" },
        { unitPrice: 200, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "VAT_EXEMPT",
      specialDiscountType: "PWD",
    });

    console.log("TEST CASE 10: Multiple NON-VAT items — SC / PWD", testCase10);

    // TEST CASE 11: Regular Discount (PASSED)
    const testCase11 = calculateInvoiceAmounts({
      items: [{ unitPrice: 300, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      discountType: "PERCENT",
      discountValue: 20,
    });
    console.log("TEST CASE 11: Regular Discount", testCase11);

    // TEST CASE 12 — VATABLE, FIXED discount
    const testCase12 = calculateInvoiceAmounts({
      items: [{ unitPrice: 500, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      discountType: "FIXED",
      discountValue: 50,
    });
    console.log("TEST CASE 12: VATABLE, FIXED discount", testCase12);

    // TEST CASE 13 — VATABLE, 10% discount
    const testCase13 = calculateInvoiceAmounts({
      items: [{ unitPrice: 1120, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      discountType: "PERCENT",
      discountValue: 10,
    });
    console.log("TEST CASE 13 — VATABLE, 10% discount", testCase13);

    // TEST CASE 14 — NON_VAT, 20% discount
    const testCase14 = calculateInvoiceAmounts({
      items: [{ unitPrice: 400, quantity: 1, vatType: "VAT_EXEMPT" }],
      taxType: "NON_VAT",
      discountType: "PERCENT",
      discountValue: 20,
    });
    console.log("TEST CASE 14 — NON_VAT, 20% discount", testCase14);

    // TEST CASE 15 — NON_VAT, FIXED discount
    const testCase15 = calculateInvoiceAmounts({
      items: [{ unitPrice: 250, quantity: 2, vatType: "VAT_EXEMPT" }],
      taxType: "NON_VAT",
      discountType: "FIXED",
      discountValue: 50,
    });
    console.log("TEST CASE 15 — NON_VAT, FIXED discount", testCase15);

    // TEST CASE 16 — Mixed, 10% discount
    const testCase16 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 300, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 200, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "MIXED",
      discountType: "PERCENT",
      discountValue: 10,
    });
    console.log("TEST CASE 16 — Mixed, 10% discount", testCase16);

    // TEST CASE 17 - Mixed, FIXED discount (flat)
    const testCase17 = calculateInvoiceAmounts({
      items: [
        { unitPrice: 560, quantity: 1, vatType: "VATABLE" },
        { unitPrice: 240, quantity: 1, vatType: "VAT_EXEMPT" },
      ],
      taxType: "MIXED",
      discountType: "FIXED",
      discountValue: 100,
    });
    console.log("TEST CASE 17 - Mixed, FIXED discount (flat)", testCase17);

    // TEST CASE 18 — VATABLE, small price + percent
    const testCase18 = calculateInvoiceAmounts({
      items: [{ unitPrice: 56, quantity: 1, vatType: "VATABLE" }],
      taxType: "VAT",
      discountType: "PERCENT",
      discountValue: 10,
    });
    console.log("TEST CASE 18 — VATABLE, small price + percent", testCase18);

    // TEST CASE 19 - VATABLE, quantity + fixed
    const testCase19 = calculateInvoiceAmounts({
      items: [{ unitPrice: 120, quantity: 3, vatType: "VATABLE" }],
      taxType: "VAT",
      discountType: "FIXED",
      discountValue: 60,
    });
    console.log("TEST CASE 19 - VATABLE, quantity + fixed", testCase19);

    // TEST CASE 20 - NO DISCOUNT (CONTROL)
    const testCase20 = calculateInvoiceAmounts({
      items: [{ unitPrice: 180, quantity: 2, vatType: "VAT_EXEMPT" }],
      taxType: "NON_VAT",
    });
    console.log("TEST CASE 20 - NO DISCOUNT (CONTOL)", testCase20);
  }, []);

  return (
    <div>
      <Button onClick={async () => await signOut()}>logout</Button>
    </div>
  );
}

export default TestCasesPage;
