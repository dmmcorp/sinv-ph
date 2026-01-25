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
} from "@/lib/types/invoice";

const layoutClassMap: Record<HeaderLayout, string> = {
  left: "flex flex-col items-start",
  right: "flex flex-col items-end",
  split: "flex flex-row justify-between items-start",
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
};

const fontWeightClassMap: Record<FontWeightToken, string> = {
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

export type CustomerInfo = ReturnType<typeof resolveCustomerClasses>;
export type HeaderInfo = ReturnType<typeof resolveHeaderClasses>;
