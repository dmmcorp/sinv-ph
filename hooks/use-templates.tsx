"use client";
import { api } from "@/convex/_generated/api";
import useTemplatesStore from "@/stores/templates/useTemplatesStore";
import { useQuery } from "convex/react";
import { useEffect, useEffectEvent } from "react";

export const useTemplate = () => {
  const { data, setData } = useTemplatesStore();
  const defaultTemplates = useQuery(api.templates.getAllTemplates);

  useEffect(() => {
    setData(defaultTemplates ?? null);
  }, [defaultTemplates, setData]);

  return {
    templates: data?.templates,
    existingUserTemplates: data?.existingUserTemplates,
  };
};
