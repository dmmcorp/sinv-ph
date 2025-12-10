"use client";
import { api } from "@/convex/_generated/api";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";
import { useQuery } from "convex/react";
import { useEffect } from "react";

export const useBusinessProfileSync = () => {
  const { businessProfile } = useBusinessProfileStore();
  const profile = useQuery(api.business_profile.getBusinessProfile);
  const setBusinessProfile = useBusinessProfileStore(
    (s) => s.setBusinessProfile
  );

  useEffect(() => {
    setBusinessProfile(profile ?? null);
  }, [profile, setBusinessProfile]);

  return { businessProfile };
};
