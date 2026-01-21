import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

export type TemplateType = Doc<"templates">;
export type UserTemplatesType = Doc<"userTemplates">;

export interface TemplatesWithExistingUserTemplates {
  templates: TemplateType[];
  existingUserTemplates: UserTemplatesType[];
}

interface TemplatesType {
  data: TemplatesWithExistingUserTemplates | null;
  defaultTemplate: TemplateType | UserTemplatesType | null;
  setData: (value: TemplatesWithExistingUserTemplates | null) => void;
  selectedTemplate: TemplateType | UserTemplatesType | null;
  setSelectedTemplate: (
    template: TemplateType | UserTemplatesType | null,
  ) => void;
}

const useTemplatesStore = create<TemplatesType>((set) => ({
  data: null,
  defaultTemplate: null,
  setData: (data) => set(() => ({ data })),
  selectedTemplate: null,
  setSelectedTemplate: (template) =>
    set(() => ({ selectedTemplate: template })),
}));

export default useTemplatesStore;
