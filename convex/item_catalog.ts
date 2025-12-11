import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createItem = mutation({
    args: {
        unitPrice: v.number(),
        description: v.string(), // goods or nature of service
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Not authenticated!")
        }

        return await ctx.db
            .insert("itemCatalog", {
                userId,
                isActive: true,
                ...args,
            })
    }
})

export const getAllItem = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Not authenticated!")
        }

        return await ctx.db
            .query("itemCatalog")
            .withIndex("by_user", q => q.eq("userId", userId))
            .filter(q => q.eq(q.field("isActive"), true))
            .collect()
    }
})