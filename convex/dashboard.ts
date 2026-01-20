import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { aggregateInvoiceByUser } from "./aggregate";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getInvoiceCountsForUser = query({
    args: {
        status: v.union(
            v.literal("DRAFT"),
            v.literal("PAID"), // HAS OR = PAIDasd
            v.literal("OPEN"), // NO OR = NOT PAID
            v.literal("OVERDUE"),
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        return await aggregateInvoiceByUser.count(ctx, {
            namespace: userId,
            bounds: {
                eq: args.status,
            }
        })
    }
})
