import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getBusinessProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const businessProfile = await ctx.db
      .query("business_profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!businessProfile) {
      return null;
    }

    if (businessProfile.logoUrl) {
      const logoUrl = await ctx.storage.getUrl(
        businessProfile.logoUrl as Id<"_storage">
      );
      return {
        ...businessProfile,
        logoUrl: logoUrl === null ? "" : logoUrl,
      };
    }
    return {
      ...businessProfile,
    };
  },
});
