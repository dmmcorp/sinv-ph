import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createInvoice = mutation({
    args: {
        // client
        clientId: v.id("clients"),

        // invoice infos
        invoiceType: v.union(
            v.literal("SALES"),
            v.literal("SERVICE"),
            v.literal("COMMERCIAL"),
        ),
        invoiceNumber: v.string(),

        // seller infos (subscribers)
        sellerBusinessName: v.string(),
        sellerTin: v.optional(v.string()),
        sellerAddress: v.optional(v.string()),
        sellerVatStatus: v.union(
            v.literal("VAT"),
            v.literal("NON_VAT")
        ),

        // buyer infos
        buyerName: v.string(),
        buyerTin: v.optional(v.string()),
        buyerAddress: v.optional(v.string()),

        // tax infos
        taxType: v.union(
            v.literal("NON_VAT"),
            v.literal("VAT"),
            v.literal("VAT_EXEMPT"),
            v.literal("ZERO_RATED"),
            v.literal("MIXED"),
            v.literal("PAYMENT_RECEIPT")
        ),
        discountType: v.optional(v.union(v.literal("PERCENT"), v.literal("FIXED"))),
        discountValue: v.optional(v.number()),
        specialDiscountType: v.optional(
            v.union(
                v.literal("SC"),
                v.literal("PWD"),
                v.literal("NAAC"),
                v.literal("MOV"),
                v.literal("SP")
            )
        ),
        specialDiscountId: v.optional(v.string()),

        // items
        items: v.array(v.object({
            description: v.string(),
            quantity: v.number(),
            unitPrice: v.number(),
            vatType: v.union(
                v.literal("VATABLE"),
                v.literal("NON_VAT"),
                v.literal("VAT_EXEMPT"),
                v.literal("ZERO_RATED"),
            ),
            isSpecialDiscountEligible: v.boolean(),
        })),

        // status
        status: v.optional(v.union(
            v.literal("DRAFT"),
            v.literal("SENT"),
            v.literal("PAID"),
            v.literal("UNPAID")
        )),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Not authenticated!")
        }

        const user = await ctx.db
            .get(userId)

        if (!user) {
            throw new ConvexError("User not found")
        }

        const client = await ctx.db.get(args.clientId)
        if (!client || client.userId !== user._id) {
            throw new Error("Client not found or unauthorized")
        }

        // calculation

        let subTotal = 0;
        let taxableAmount = 0;
        let vatExemptAmount = 0;
        let zeroRatedAmount = 0;

    }
})