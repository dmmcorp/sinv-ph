import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const hasUserBoarded = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        const user = await ctx.db.get(userId)
        if (!user) return null

        return user.onboarding
    }
})

export const current = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        return await ctx.db.get(userId)
    }
})