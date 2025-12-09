import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export const useHasUserBoarded = () => {
  const data = useQuery(api.users.hasUserBoarded);
  const isLoading = data === undefined;

  return {
    hasUserBoarded: data,
    isLoading,
  };
};
