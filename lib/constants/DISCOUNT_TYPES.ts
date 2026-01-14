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

export const SPECIAL_DISCOUNT_TYPES_MAP = [
{
    value: "SC",
    label: "Senior Citizen",
},{
    value: "PWD",
    label: "Person With Disability",
},{
    value: "NAAC",
    label: "National Athletes And Coaches",
},{
    value: "MOV",
    label: "Military Officer/Veteran",
},{
    value: "SP",
    label: "Solo Parent",
}];

export type SpecialDiscountType = (typeof SPECIAL_DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];