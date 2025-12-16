import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const board = mutation({
  args: {
    businessName: v.string(),
    tin: v.string(),
    address: v.string(),
    logoUrl: v.string(),
    businessType: v.union(
      v.literal("Freelancer/Individual"),
      v.literal("Small Business"),
      v.literal("VAT-Registered Business")
    ),
    vatRegistration: v.boolean(),
  },
  handler: async (
    ctx,
    { address, businessName, logoUrl, tin, businessType, vatRegistration }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("No user found!");

    const businessProfile = await ctx.db.insert("business_profile", {
      address,
      businessName,
      businessType,
      vatRegistration,
      logoUrl,
      tin,
      userId,
      updatedAt: Math.floor(Date.now() / 1000), // unix timestamp today
    });

    if (businessProfile)
      await ctx.db.patch(userId, {
        updatedAt: Math.floor(Date.now() / 1000), // unix timestamp today
        onboarding: true,
      });
  },
});
