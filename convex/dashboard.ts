import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { aggregateInvoiceByUser, aggregateRevenueByUser } from "./aggregate";
import { getAuthUserId } from "@convex-dev/auth/server";
import { STATUSTYPE } from "../lib/constants/STATUS_TYPES";

// export const getInvoiceCountsForUser = query({
//     args: {
//         status: v.union(
//             v.literal("DRAFT"),
//             v.literal("PAID"), // HAS OR = PAID
//             v.literal("OPEN"), // NO OR = NOT PAID
//             v.literal("OVERDUE"),
//         ),
//     },
//     handler: async (ctx, args) => {
//         const userId = await getAuthUserId(ctx)
//         if (!userId) return null

//         return await aggregateInvoiceByUser.count(ctx, {
//             namespace: userId,
//             bounds: {
//                 eq: args.status,
//             }
//         })
//     }
// })

export const getInvoiceMetricsForUser = query({
    args: {
        year: v.string(), // 2026
    },
    handler: async (ctx, { year }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Not authenticated");

        const statuses: STATUSTYPE[] = [
            "DRAFT",
            "OPEN",
            "PAID",
            "OVERDUE",
        ];

        const result = {
            total: 0,
            draft: 0,
            open: 0,
            paid: 0,
            overdue: 0,
        }

        for (const status of statuses) {
            const count = await aggregateInvoiceByUser.count(ctx, {
                namespace: userId,
                bounds: {
                    eq: [year, status],
                    prefix: [year, status],
                },
            })

            result.total += count;


            if (status === "DRAFT") result.draft = count;
            if (status === "OPEN") result.open = count;
            if (status === "PAID") result.paid = count;
            if (status === "OVERDUE") result.overdue = count;
        }

        return result;
    },
});

export const getMonthlyRevenueForUser = query({
    args: {
        year: v.string() // 2026
    },
    handler: async (ctx, { year }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Not authenticated")

        // 01, 02, .... 10 11 12
        const months = Array.from({ length: 12 }, (_, i) =>
            `${year}-${String(i + 1).padStart(2, "0")}`
        )

        const results = await Promise.all(
            months.map((month) =>
                aggregateRevenueByUser.sum(ctx, {
                    bounds: {
                        prefix: [userId, month]
                    }
                })
            )
        );

        return months.map((month, i) => ({
            month,
            revenue: results[i] ?? 0,
        }))
    }
})