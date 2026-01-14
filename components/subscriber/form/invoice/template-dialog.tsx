"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import Sample from "@/public/assets/sample.png"

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: string) => void
}

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean and contemporary design with minimal elements",
    image: Sample,
  },
  {
    id: "professional",
    name: "Professional Classic",
    description: "Traditional business invoice with corporate styling",
    image:Sample,
  },
  {
    id: "creative",
    name: "Creative Bold",
    description: "Eye-catching design with vibrant accents",
    image: Sample,
  },
  {
    id: "elegant",
    name: "Elegant Luxury",
    description: "Sophisticated design with premium aesthetics",
    image: Sample,
  },
  {
    id: "minimal",
    name: "Ultra Minimal",
    description: "Stripped down essentials only design",
    image: Sample,
  },
  {
    id: "corporate",
    name: "Corporate Blue",
    description: "Enterprise-grade with trust-building colors",
    image: Sample,
  },
]

export function TemplateDialog({ open, onOpenChange, onSelectTemplate }: TemplateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onSelectTemplate(templateId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold ">Choose Invoice Template</DialogTitle>
          <DialogDescription className="text-foreground">
            Select a template to customize your invoice appearance
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {TEMPLATES.map((template) => (
            <button key={template.id} onClick={() => handleSelect(template.id)} className="group relative">
              <div
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  selectedTemplate === template.id
                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <Image
                  src={template.image}
                  alt={template.name}
                  className="w-full h-40 object-contain bg-accent/10" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-3 text-left">
                <h3 className="text-sm font-semibold   transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-foreground mt-1 line-clamp-2">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
