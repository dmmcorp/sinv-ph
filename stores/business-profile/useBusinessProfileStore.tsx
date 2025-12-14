import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type BusinessProfileConvexType = Doc<"business_profile">;

interface BusinessProfileType {
  businessProfile: BusinessProfileConvexType | null;
  setBusinessProfile: (value: BusinessProfileConvexType | null) => void;
}

const useBusinessProfileStore = create<BusinessProfileType>((set) => ({
  businessProfile: null,
  setBusinessProfile: (businessProfile) => set(() => ({ businessProfile })),
}));

export default useBusinessProfileStore;
