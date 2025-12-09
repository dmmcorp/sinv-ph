import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getBusinessProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const businessProfile = await ctx.db
      .query("business_profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return businessProfile;
  },
});
