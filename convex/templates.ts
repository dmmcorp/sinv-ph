import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getAllTemplates = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated!");
        }

        const existingUserTemplates = await ctx.db
            .query("userTemplates")
            .withIndex("by_user", q => q.eq("userId", userId))
            .collect()

        if (existingUserTemplates) {
            const templates = await ctx.db
                .query("templates")
                .collect()

            return {
                templates,
                existingUserTemplates,
            }
        } else {
            return await ctx.db
                .query("templates")
                .collect()
        }
    }
})

export const createUserTemplate = mutation({
    args: {
        templateId: v.id("templates"),
        primaryColor: v.string(),     // hex values // usually bold 10% of sales invoice template
        secondaryColor: v.string(),   // hex values // usually normal text
        headerColor: v.string(),      // hex values (header color for template)
        backgroundColor: v.string(),  // hex values (background color)

        isSaved: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Not authenticated!");
        }

        if (args.isSaved) {
            const businessProfile = await ctx.db
                .query("business_profile")
                .withIndex("by_user", q => q.eq("userId", userId))
                .first()

            if (!businessProfile) {
                throw new ConvexError("Couldn't find business profile, make sure you have completed onboarding.")
            }

            const userTemplateId = await ctx.db
                .insert("userTemplates", {
                    userId,
                    ...args,
                })

            await ctx.db
                .patch(businessProfile._id, {
                    defaultTemplate: userTemplateId,
                    updatedAt: Math.floor(Date.now() / 1000), // unix timestamp today
                })
        } else {
            return await ctx.db
                .insert("userTemplates", {
                    userId,
                    ...args,
                })
        }

    }
})

// TODO: MAKE DEFAULT TEMPLATE MUTATION
// TODO: 