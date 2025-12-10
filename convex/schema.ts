import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    users: defineTable({
        email: v.string(),
        emailVerified: v.optional(v.boolean()),
        role: v.union(
            v.literal("admin"),
            v.literal("subscriber"),
        ),

        onboarding: v.boolean(),
        updatedAt: v.number(),
    }).index("by_email", ["email"]),
    // bussiness profile
    business_profile: defineTable({

        //onboarding todo flow: add a selection for type of business / individual.
        userId: v.id("users"), // business or subscriber ID

        // business infos
        businessName: v.string(),
        tin: v.string(),
        address: v.string(),
        logoUrl: v.string(),

        updatedAt: v.number(),
    }).index("by_user", ["userId"]),
    // clients
    clients: defineTable({
        userId: v.id("users"), // para sa subscribers (their client)

        // client infos
        name: v.string(),
        email: v.optional(v.string()),
        address: v.optional(v.string()),
        // TODO add contact 
    }).index("by_user", ["userId"]),
    // invoices

    // if this business have already 3 si client1 3values .count() = 3 + 1 = sequential number 
    invoices: defineTable({
        userId: v.id("users"), // subscribers id
        clientId: v.id("clients"), // subscribers client id

        // sellers (store pa rin, because as per BIR old invoices should remain the same business name even if that specific business changed its name, address or tin already.)
        sellerBusinessName: v.string(),
        sellerTin: v.optional(v.string()),
        sellerAddress: v.optional(v.string()),
        sellerVatStatus: v.union(
            v.literal("VAT"),
            v.literal("NON_VAT")
        ),

        invoiceType: v.union(
            v.literal("SALES"), // SI-00003 = sales i
            v.literal("SERVICE"),
            v.literal("COMMERCIAL"),
        ), // from bir sales invoice format
        invoiceNumber: v.string(), // serial number

        // tax infos
        taxType: v.union(
            v.literal("NON_VAT"), //
            v.literal("VAT"), // 
            v.literal("VAT_EXEMPT"),
            v.literal("ZERO_RATED"),
            v.literal("MIXED"),
            v.literal("PAYMENT_RECEIPT")
        ),
        discountType: v.optional(
            v.union(v.literal("PERCENT"), v.literal("FIXED"))
        ),
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

        // buyer info
        buyerName: v.string(),
        buyerTin: v.optional(v.string()), // if b2c usually no tin.
        buyerAddress: v.optional(v.string()), // same case if b2c usually no tin.

        // totality
        subTotal: v.number(),
        taxAmount: v.number(),
        totalAmount: v.number(),

        // draft = wag ibilang
        status: v.union(
            v.literal("DRAFT"),
            v.literal("SENT"),
            v.literal("PAID"),
            v.literal("UNPAID")
        ),
        pdfUrl: v.optional(v.string()),
        updatedAt: v.number(),
    }).index("by_user", ["userId"]),
    // items
    items: defineTable({
        invoiceId: v.id("invoices"),

        description: v.string(), // goods or nature of service
        quantity: v.number(),
        unitPrice: v.number(),
        amount: v.number(), // quantity * unitPrice = amount vlaue

        vatType: v.union(
            v.literal("VATABLE"),
            v.literal("NON_VAT"),
            v.literal("VAT_EXEMPT"),
            v.literal("ZERO_RATED"),
        ),

        isSpecialDiscountEligible: v.boolean(),
    }).index("by_invoice", ["invoiceId"]),
    // branding
    branding: defineTable({
        userId: v.id("users"), //subscriber

        // visuals
        accentColor: v.string(),
        headerLayout: v.string(),
        logoUrl: v.optional(v.string()),
        digitalSignatureUrl: v.optional(v.string()),
    }),
});