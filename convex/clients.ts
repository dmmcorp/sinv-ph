import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createClient = mutation({
    args: {
        name: v.string(),
        email: v.optional(v.string()),
        address: v.optional(v.string()),
    },
    handler: async (ctx, {
        name,
        address,
        email
    }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Not authenticated")

        const client = await ctx.db.insert("clients", {
            userId,
            name,
            address,
            email,
        })

        if (client) {
            return "Successfully created a new client."
        } else {
            return "Error, please review the fields."
        }
    }
})

export const getAllClients = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Not authenticated")

        return await ctx.db
            .query("clients")
            .withIndex("by_user", q => q.eq("userId", userId))
            .collect()
    }
})

export const getClient = query({
    args: {
        clientId: v.id("clients")
    },
    handler: async (ctx, { clientId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Not authenticated")

        return await ctx.db
            .get(clientId)

    }
})