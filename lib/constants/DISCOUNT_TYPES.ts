export const DISCOUNT_TYPES = [
    "PERCENT",
    "FIXED",
] as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];


export const SPECIAL_DISCOUNT_TYPES = [
    "SC",
    "PWD",
    "NAAC",
    "MOV",
    "SP",
] as const

export type SpecialDiscountType = (typeof SPECIAL_DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];