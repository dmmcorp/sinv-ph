import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

        const templates = await ctx.db
            .query("templates")
            .collect()

        return {
            templates,
            existingUserTemplates,
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

        const userTemplateId = await ctx.db.insert("userTemplates", {
            userId,
            templateId: args.templateId,
            primaryColor: args.primaryColor,
            secondaryColor: args.secondaryColor,
            headerColor: args.headerColor,
            backgroundColor: args.backgroundColor,
        });

        if (args.isSaved) {
            const businessProfile = await ctx.db
                .query("business_profile")
                .withIndex("by_user", q => q.eq("userId", userId))
                .first();

            if (!businessProfile) {
                throw new ConvexError(
                    "Couldn't find business profile, make sure onboarding is complete."
                );
            }

            await ctx.db.patch(businessProfile._id, {
                defaultTemplate: userTemplateId,
                updatedAt: Math.floor(Date.now() / 1000),
            });
        }

        return userTemplateId;
    }
})

export const editUserTemplate = mutation({
    args: {
        userTemplateId: v.id("userTemplates"),
        primaryColor: v.optional(v.string()),                   // hex values // usually bold 10% of sales invoice template
        secondaryColor: v.optional(v.string()),                 // hex values // usually normal text
        headerColor: v.optional(v.string()),                    // hex values (header color for template)
        backgroundColor: v.optional(v.string()),                // hex values (background color)
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated!");
        }

        const userTemplate = await ctx.db
            .get(args.userTemplateId)

        if (!userTemplate) {
            throw new ConvexError("No user template found.")
        }

        if (userTemplate.userId !== userId) {
            throw new ConvexError("Invalid action. You are editing a user template that does not belong to you.")
        }

        return await ctx.db
            .patch(userTemplate._id, {
                _id: args.userTemplateId,
                primaryColor: args.primaryColor,
                secondaryColor: args.secondaryColor,
                headerColor: args.headerColor,
                backgroundColor: args.backgroundColor,
            })
    }
})

export const getDefaultTemplate = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated!");
        }

        const businessProfile = await ctx.db
            .query("business_profile")
            .withIndex("by_user", q => q.eq("userId", userId))
            .first()

        if (!businessProfile?.defaultTemplate) {
            return null;
        }

        return await ctx.db
            .get(businessProfile.defaultTemplate as Id<"userTemplates">)
    }
})

export const makeDefaultTemplate = mutation({
    args: {
        userTemplateId: v.id("userTemplates"),
    },
    handler: async (ctx, { userTemplateId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Not authenticated!");
        }

        const businessProfile = await ctx.db
            .query("business_profile")
            .withIndex("by_user", q => q.eq("userId", userId))
            .first()

        if (!businessProfile) {
            throw new ConvexError(
                "Couldn't find business profile, make sure onboarding is complete."
            );
        }

        await ctx.db
            .patch(businessProfile._id, {
                defaultTemplate: userTemplateId
            })

        return true;
    }
})

export const getInvoiceToTestColorTemplate = query({
    handler: async (ctx) => {

    }
})
