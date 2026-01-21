"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import Sample from "@/public/assets/sample.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useTemplatesStore from "@/stores/templates/useTemplatesStore";
import { useTemplate } from "@/hooks/use-templates";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: string) => void;
}

// const TEMPLATES = [
//   {
//     id: "modern",
//     name: "Modern Minimal",
//     description: "Clean and contemporary design with minimal elements",
//     image: Sample,
//   },
//   {
//     id: "professional",
//     name: "Professional Classic",
//     description: "Traditional business invoice with corporate styling",
//     image: Sample,
//   },
//   {
//     id: "creative",
//     name: "Creative Bold",
//     description: "Eye-catching design with vibrant accents",
//     image: Sample,
//   },
//   {
//     id: "elegant",
//     name: "Elegant Luxury",
//     description: "Sophisticated design with premium aesthetics",
//     image: Sample,
//   },
//   {
//     id: "minimal",
//     name: "Ultra Minimal",
//     description: "Stripped down essentials only design",
//     image: Sample,
//   },
//   {
//     id: "corporate",
//     name: "Corporate Blue",
//     description: "Enterprise-grade with trust-building colors",
//     image: Sample,
//   },
// ];

export function TemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateDialogProps) {
  const { templates, existingUserTemplates } = useTemplate();
  const { selectedTemplate, setSelectedTemplate } = useTemplatesStore();
  const defaultTemplate = templates ? templates : null;

  const handleSelect = (templateId: string) => {
    const selectedTemplate = templates?.find((t) => t._id === templateId);
    if (!selectedTemplate) return;
    setSelectedTemplate(selectedTemplate);
    onSelectTemplate(selectedTemplate.templateName);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl ">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold ">
            Choose Invoice Template
          </SheetTitle>
          <SheetDescription className="text-foreground">
            Select a template to customize your invoice appearance
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-4">
          <h3 className="text-sm font-bold text-muted-foreground">
            Default Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6  ">
            {defaultTemplate?.map((template) => (
              <button
                key={template._id}
                onClick={() => handleSelect(template._id)}
                className="group relative"
              >
                <div
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    selectedTemplate?._id === template._id
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-muted-foreground/70 hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={Sample}
                    alt={template.templateName}
                    className="w-full h-40 object-contain bg-accent/10"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  {selectedTemplate?._id === template._id && (
                    <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mt-3 text-left">
                  <h3 className="text-sm font-semibold   transition-colors">
                    {template.templateName}
                  </h3>
                  {/* <p className="text-xs text-foreground mt-1 line-clamp-2">
                  {template.description}
                </p> */}
                </div>
              </button>
            ))}
            {defaultTemplate === null && (
              <p className="text-sm text-foreground/70 col-span-3 text-center">
                No templates available right now.
              </p>
            )}
          </div>
          <h3 className="text-sm font-bold text-muted-foreground max-h-90 overflow-auto mt-6">
            Custom Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 px-4">
            {defaultTemplate?.map((template) => (
              <button
                key={template._id}
                onClick={() => handleSelect(template._id)}
                className="group relative"
              >
                <div
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    selectedTemplate?._id === template._id
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <Image
                    src={Sample}
                    alt={template.templateName}
                    className="w-full h-40 object-contain bg-accent/10"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  {selectedTemplate?._id === template._id && (
                    <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mt-3 text-left">
                  <h3 className="text-sm font-semibold   transition-colors">
                    {template.templateName}
                  </h3>
                  {/* <p className="text-xs text-foreground mt-1 line-clamp-2">
                  {template.description}
                </p> */}
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
