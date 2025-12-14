export const TAX_TYPES = [
    "VAT",
    "NON_VAT",
    "VAT_EXEMPT",
    "ZERO_RATED",
    "MIXED",
    "PAYMENT_RECEIPT",
] as const;

export type TaxType = (typeof TAX_TYPES)[keyof typeof TAX_TYPES];