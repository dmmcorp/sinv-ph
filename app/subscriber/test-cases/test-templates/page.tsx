"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const TestTemplates = () => {
  const data = useQuery(api.templates.getAllTemplates);
  const template = useQuery(api.templates.getDefaultTemplate);
  const makeDefault = useMutation(api.templates.makeDefaultTemplate);

  if (!data || template === undefined) {
    return <div>Loading…</div>;
  }

  if (!template) return <div>No templates yet</div>;

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
