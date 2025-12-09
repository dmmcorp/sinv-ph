import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface BusinessProfileType {
  businessProfile: Doc<"business_profile"> | null;
  setBusinessProfile: (value: Doc<"business_profile"> | null) => void;
}

const useBusinessProfileStore = create<BusinessProfileType>((set) => ({
  businessProfile: null,
  setBusinessProfile: (businessProfile) => set(() => ({ businessProfile })),
}));

export default useBusinessProfileStore;
