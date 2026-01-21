import {
  TemplateType,
  UserTemplatesType,
} from "@/stores/templates/useTemplatesStore";

type InvoiceThemeProviderProps = {
  template: TemplateType | UserTemplatesType | null;
  children: React.ReactNode;
};

export function InvoiceThemeProvider({
  template,
  children,
}: InvoiceThemeProviderProps) {
  return (
    <div
      className="invoice-root font-(--invoice-font) bg-(--invoice-bg) text-black"
      style={templateToCSSVars(template)}
    >
      {children}
    </div>
  );
}

export function templateToCSSVars(
  template: TemplateType | UserTemplatesType | null,
) {
  return {
    "--invoice-bg": template?.backgroundColor ?? "--primary",
    "--invoice-header": template?.headerColor ?? "--primary",
    "--invoice-primary": template?.primaryColor ?? "--primary",
    "--invoice-secondary": template?.secondaryColor ?? "--primary",
    "--invoice-font": template?.layoutConfig?.font ?? "Arial, sans-serif",
  } as React.CSSProperties;
}
