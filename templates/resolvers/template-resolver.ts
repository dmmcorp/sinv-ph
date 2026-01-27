// --------------------
// Class maps
// --------------------

import {
  HeaderSettings,
  HeaderLayout,
  Density,
  PaddingToken,
  RadiusToken,
  FontSizeToken,
  FontWeightToken,
  TextAlignToken,
  CustomerInfoSettings,
  LineItemsSettings,
  TotalsSettings,
  TotalsTextStyle,
} from "@/lib/types/invoice";

const layoutClassMap: Record<HeaderLayout, string> = {
  left: "flex flex-col items-start",
  right: "flex flex-col items-end",
  split: "flex flex-row justify-between ",
};

const densityGapMap: Record<Density, string> = {
  compact: "gap-2",
  normal: "gap-4",
  spacious: "gap-6",
};

const paddingClassMap: Record<PaddingToken, string> = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const radiusClassMap: Record<RadiusToken, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

const backgroundClassMap = {
  default: "bg-white",
  muted: "bg-muted",
  primary: "bg-primary",
  accent: "bg-accent",
};
const textColorClassMap = {
  default: "text-white",
  muted: "text-muted",
  primary: "text-primary",
  accent: "text-accent",
};

const borderClassMap = {
  none: "border-none",
  light: "border border-border",
  strong: "border-2 border-border",
};

const fontSizeClassMap: Record<FontSizeToken, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
  xxxl: "text-3xl",
};

const fontWeightClassMap: Record<FontWeightToken, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const textAlignClassMap: Record<TextAlignToken, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const lineItemsLayoutClassMap = {
  table: "flex flex-col",
  stacked: "flex flex-col space-y-2",
  card: "grid grid-cols-1 gap-4",
};

const rowStyleClassMap = {
  plain: "",
  striped: "odd:bg-transparent even:bg-muted",
  bordered: "border-b border-border",
};

// --------------------
// Resolver
// --------------------

export function resolveHeaderClasses(settings: HeaderSettings) {
  const { layout, textColor, density, padding, radius, background, border } =
    settings;

  const container = [
    "flex w-full",
    layoutClassMap[layout],
    densityGapMap[density],
    paddingClassMap[padding],
    radiusClassMap[radius],
    backgroundClassMap[background],
    borderClassMap[border],
  ].join(" ");

  const businessName = [
    fontSizeClassMap[settings.businessInfo.styleTokens.businessNameSize],
    fontWeightClassMap[settings.businessInfo.styleTokens.businessNameWeight],
    settings.businessInfo.styleTokens.textAlign
      ? textAlignClassMap[settings.businessInfo.styleTokens.textAlign]
      : "",
  ].join(" ");

  const businessMeta = [
    fontSizeClassMap[settings.businessInfo.styleTokens.businessMetaSize],
    fontWeightClassMap[settings.businessInfo.styleTokens.businessMetaWeight],
  ].join(" ");

  const invoiceMeta = settings.invoiceMeta.styleTokens
    ? [
        settings.invoiceMeta.styleTokens.metaSize
          ? fontSizeClassMap[settings.invoiceMeta.styleTokens.metaSize]
          : "",
        settings.invoiceMeta.styleTokens.metaWeight
          ? fontWeightClassMap[settings.invoiceMeta.styleTokens.metaWeight]
          : "",
        settings.invoiceMeta.styleTokens.textAlign
          ? textAlignClassMap[settings.invoiceMeta.styleTokens.textAlign]
          : "",
      ].join(" ")
    : "";

  const invoiceTitle = settings.invoiceMeta.styleTokens
    ? [
        settings.invoiceMeta.styleTokens.invoiceTitleSize
          ? fontSizeClassMap[settings.invoiceMeta.styleTokens.invoiceTitleSize]
          : "",
        settings.invoiceMeta.styleTokens.invoiceTitleWeight
          ? fontWeightClassMap[
              settings.invoiceMeta.styleTokens.invoiceTitleWeight
            ]
          : "",
      ].join(" ")
    : "";

  const logoSizeClass = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }[settings.businessInfo.styleTokens.logoSize || "md"];

  return {
    container,
    textColor,
    businessInfo: {
      logoSizeClass,
      businessName,
      businessMeta,
    },
    invoice: { invoiceTitle, invoiceMeta },
    visibility: {
      businessDetails: settings.businessInfo.visibility,
      businessMeta: settings.invoiceMeta.visibility,
    },
  };
}

export function resolveCustomerClasses(settings: CustomerInfoSettings) {
  const { layout, density, padding } = settings;
  const container = [
    "flex w-full",
    layoutClassMap[layout],
    densityGapMap[density],
    paddingClassMap[padding],
  ].join(" ");

  const customerName = [
    fontSizeClassMap[settings.styleTokens.nameSize],
    fontWeightClassMap[settings.styleTokens.nameWeight],
  ].join(" ");

  const customerMeta = [
    fontSizeClassMap[settings.styleTokens.metaSize],
    fontWeightClassMap[settings.styleTokens.metaWeight],
  ].join(" ");

  return {
    container,
    customerName,
    customerMeta,
    visibility: {
      ...settings.visibility,
    },
  };
}

export function resolveLineItemsClasses(settings: LineItemsSettings) {
  const { layout, density, padding, visibility } = settings;

  const container = [
    "w-full",
    lineItemsLayoutClassMap[layout],
    densityGapMap[density],
    paddingClassMap[padding],
  ].join(" ");

  const header = [
    backgroundClassMap[settings.header.backgroundColor],
    textColorClassMap[settings.header.textColor],
    fontSizeClassMap[settings.header.fontSize],
    fontWeightClassMap[settings.header.fontWeight],
    textAlignClassMap[settings.header.textAlign ?? "left"],
  ].join(" ");

  const row = [
    rowStyleClassMap[settings.row.style],
    fontSizeClassMap[settings.row.styleTokens.fontSize],
    fontWeightClassMap[settings.row.styleTokens.fontWeight],
    textAlignClassMap[settings.row.styleTokens.textAlign ?? "left"],
  ].join(" ");

  const data = [
    settings.data.textColor,
    fontSizeClassMap[settings.data.fontSize],
    fontWeightClassMap[settings.data.fontWeight],
    textAlignClassMap[settings.data.textAlign ?? "left"],
  ].join(" ");

  const lineNumber = visibility.lineNumber;
  return {
    container,
    header,
    row,
    data,
    lineNumber,
  };
}

export function resolveTotalsClasses(settings: TotalsSettings) {
  const { layout, density, padding, radius, backgroundColor, border } =
    settings;

  // Container classes
  const container = [
    "flex w-full",
    lineItemsLayoutClassMap[layout], // could map via layoutClassMap if needed
    densityGapMap[density],
    paddingClassMap[padding],
    radius ? radiusClassMap[radius] : "",
    backgroundColor ? backgroundClassMap[backgroundColor] : "",
    border ? borderClassMap[border] : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Helper to resolve TotalsTextStyle to Tailwind classes
  const resolveRowClasses = (style: TotalsTextStyle) =>
    [
      fontSizeClassMap[style.fontSize],
      fontWeightClassMap[style.fontWeight],
      textAlignClassMap[style.textAlign],
      style.textColor,
      style.backgroundColor ? backgroundClassMap[style.backgroundColor] : "",
    ]
      .filter(Boolean)
      .join(" ");

  return {
    container,
    subtotal: resolveRowClasses(settings.subtotal),
    taxBreakdown: resolveRowClasses(settings.taxBreakdown),
    discount: resolveRowClasses(settings.discount),
    grandTotal: resolveRowClasses(settings.grandTotal),
  };
}

export type CustomerInfo = ReturnType<typeof resolveCustomerClasses>;
export type HeaderInfo = ReturnType<typeof resolveHeaderClasses>;
export type LineItems = ReturnType<typeof resolveLineItemsClasses>;
export type Totals = ReturnType<typeof resolveTotalsClasses>;
