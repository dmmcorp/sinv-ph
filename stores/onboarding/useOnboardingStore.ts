// onboarding-store.ts
import { create } from "zustand";

export const useOnboardingStore = create<{
  justCompleted: boolean;
  setJustCompleted: (v: boolean) => void;
}>((set) => ({
  justCompleted: false,
  setJustCompleted: (v) => set({ justCompleted: v }),
}));
