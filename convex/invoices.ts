import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { VAT_RATE } from "@/../../lib/VAT_RATE"

// COUNTER SYNTAX:
// INVOCE - TYPE OF INVOICE - BUSINESS ID - YEAR
const getCounterName = (userId: string, year: number, type: "SALES" | "SERVICE" | "COMMERCIAL") => {
    return `invoice_${type}_${userId}_${year}`
}


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
        // invoiceNumber: v.string(), // This is auto generated and incremental (CHECK DOCS MHF for rules) 

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

        let subTotal = 0;

        for (const item of args.items) {
            const itemAmount = item.unitPrice * item.quantity
            subTotal += itemAmount
        }

        let taxAmount = 0;

        // for VAT
        if (args.taxType === "VAT") {
            taxAmount = subTotal * VAT_RATE;
        }

        // TODO OTHER TAXTYPE (IF IBA YUNG COMPUTATION)

        const totalAmount = subTotal + taxAmount;

        // SERIAL/INVOICE NUMBER GENERATION:
        const currentYear = new Date().getFullYear()
        const counterName = getCounterName(user._id, currentYear, args.invoiceType)

        // counter table
        const existingCounter = await ctx.db
            .query("invoiceCounters")
            .withIndex("by_name", q => q.eq("name", counterName))
            .first()

        let serialNumber: number;

        if (existingCounter) {
            serialNumber = existingCounter.value + 1;
            await ctx.db.patch(existingCounter._id, {
                value: serialNumber
            })
        } else {
            serialNumber = 1; ``
            await ctx.db.insert("invoiceCounters", {
                name: counterName,
                value: serialNumber, // this means first invoice
            })
        }

        const prefix = args.invoiceType === "SALES" ? "SI"
            : args.invoiceType === "SERVICE" ? "SV"
                : "CM"

        const invoiceNumber = `${prefix}-${currentYear}-${serialNumber.toString().padStart(5, "0")}`

        const invoiceId = await ctx.db
            .insert("invoices", {
                // relationships
                userId: user._id,
                clientId: args.clientId,

                // seller (subscriber infos)
                sellerBusinessName: args.sellerBusinessName,
                sellerTin: args.sellerTin,
                sellerAddress: args.sellerAddress,
                sellerVatStatus: args.sellerVatStatus,

                // invoice infos
                invoiceType: args.invoiceType,
                invoiceNumber: invoiceNumber,

                // if vat, nonvat, etc.
                taxType: args.taxType,

                // buyer infos
                buyerName: args.buyerName,
                buyerTin: args.buyerTin,
                buyerAddress: args.buyerAddress,

                // totals
                subTotal,
                taxAmount,
                totalAmount,

                // miscs.
                status: args.status ?? "DRAFT",
                updatedAt: Math.floor(Date.now() / 1000),
            })

        for (const item of args.items) {
            await ctx.db.insert("items", {
                userId,
                invoiceId,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                vatType: args.taxType === "VAT" ? "VATABLE" : "NON_VAT",
                isSpecialDiscountEligible: false, // TODO DISCOUNTS
            })
        }

        return invoiceId;
    }
})