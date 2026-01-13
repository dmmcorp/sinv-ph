"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { randomHexColor } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";

const TestTemplates = () => {
  const data = useQuery(api.templates.getAllTemplates);
  const template = useQuery(api.templates.getDefaultTemplate);
  const draftInvoice = useQuery(api.invoices.getInvoiceById, {
    invoiceId: "jh7553c3mahj1m82grmk02rj0d7z3es3" as Id<"invoices">,
  });
  const issuedInvoice = useQuery(api.invoices.getInvoiceById, {
    invoiceId: "jh71s488pb1k3bk7spm491q9hh7z2hg6" as Id<"invoices">,
  });
  const makeDefault = useMutation(api.templates.makeDefaultTemplate);
  const changeTemplate = useMutation(api.templates.changeInvoiceUserTemplate);
  const editTemplate = useMutation(api.templates.editUserTemplate);

  const resolveTemplate = (invoiceData: any) => {
    const { invoice, userTemplate } = invoiceData;

    return (
      invoice.templateSnapshot ??
      userTemplate ?? {
        primaryColor: "#000000",
        secondaryColor: "#333333",
        headerColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
      }
    );
  };

  if (!data || template === undefined) {
    return <div>Loading…</div>;
  }

  if (!draftInvoice) return <div>Can't find invoice</div>;
  if (!issuedInvoice) return <div>Can't find issued invoice</div>;

  const { invoice, userTemplate } = draftInvoice;
  const { invoice: issued } = issuedInvoice;

  if (!template) return <div>No templates yet</div>;

  const toChangeUserTemplate =
    userTemplate?._id === "m578acr0axkctd2cz9wp73bfyn7z3e6z"
      ? "m577vhzev4c76hhx313qb7as6n7z2hr6"
      : "m578acr0axkctd2cz9wp73bfyn7z3e6z";

  const userTemplateId =
    "m578acr0axkctd2cz9wp73bfyn7z3e6z" as Id<"userTemplates">;

  return (
    <div>
      <h1 style={{ color: template.primaryColor }}>primaryColor</h1>

      <h2 style={{ color: template.secondaryColor }}>secondaryColor</h2>

      <div
        className="p-12 rounded-lg my-3"
        style={{ backgroundColor: template.headerColor }}
      >
        {/* headerColor */}
      </div>

      <div
        className="p-12 rounded-lg my-3"
        style={{ backgroundColor: template.backgroundColor }}
      >
        {/* backgroundColor */}
      </div>

      <div>
        <h2>Invoice (DRAFT – live template)</h2>
        {(() => {
          const t = resolveTemplate(draftInvoice);

          return (
            <>
              <Button
                onClick={async () => {
                  await changeTemplate({
                    invoiceId: invoice._id,
                    userTemplateId: toChangeUserTemplate as Id<"userTemplates">,
                  });
                  alert("Template changed!");
                }}
              >
                Change Template
              </Button>

              <h1 style={{ color: t?.primaryColor }}>
                Buyer Name: {invoice.buyerName}
              </h1>
              <h2 style={{ color: t?.secondaryColor }}>
                Amount: {invoice.totalAmount}
              </h2>
              <div
                className="p-12 rounded-lg my-3"
                style={{ backgroundColor: t?.headerColor ?? "blue" }}
              >
                {/* headerColor with user template */}
              </div>
              <div
                className="p-12 rounded-lg my-3"
                style={{
                  backgroundColor: t?.backgroundColor ?? "gray",
                }}
              >
                {/* backgroundColor with user template */}
              </div>
            </>
          );
        })()}
      </div>

      <Button
        onClick={async () => {
          await editTemplate({
            userTemplateId,
            primaryColor: randomHexColor(),
          });
          alert("Primary color updated");
        }}
        className="mr-5"
      >
        Change Primary Color
      </Button>

      <Button
        onClick={async () => {
          await editTemplate({
            userTemplateId,
            headerColor: randomHexColor(),
            backgroundColor: randomHexColor(),
          });
          alert("Header + Background updated");
        }}
      >
        Change Header + Background
      </Button>

      {issuedInvoice && (
        <div>
          <h2>Invoice (PAID – snapshot) yung dating brand</h2>
          {(() => {
            const t = resolveTemplate(issuedInvoice);
            return (
              <>
                <h1 style={{ color: t?.primaryColor }}>
                  Buyer Name: {invoice.buyerName}
                </h1>
                <h2 style={{ color: t?.secondaryColor }}>
                  Amount: {invoice.totalAmount}
                </h2>
                <div
                  className="p-12 rounded-lg my-3"
                  style={{ backgroundColor: t?.headerColor ?? "blue" }}
                >
                  {/* headerColor with user template */}
                </div>
                <div
                  className="p-12 rounded-lg my-3"
                  style={{
                    backgroundColor: t?.backgroundColor ?? "gray",
                  }}
                >
                  {/* backgroundColor with user template */}
                </div>
              </>
            );
          })()}
        </div>
      )}

      <div className="space-y-3">
        <p className="font-bold">DEFAULT:</p>
        {data.templates.map((template) => (
          <div key={template._id}>{template.primaryColor}</div>
        ))}

        <p className="font-bold">EXISTING:</p>
        {data.existingUserTemplates.map((existingUserTemplate) => (
          <div key={existingUserTemplate._id}>
            {existingUserTemplate.primaryColor}
            {template._id === existingUserTemplate._id ? (
              <h2>Current Default Template</h2>
            ) : (
              <Button
                onClick={async () => {
                  await makeDefault({
                    userTemplateId: existingUserTemplate._id,
                  });
                  alert("Template set as default!");
                }}
              >
                Set as Default
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestTemplates;
