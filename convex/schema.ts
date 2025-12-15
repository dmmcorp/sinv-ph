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

        // onboarding todo flow: add a selection for type of business / individual.
        userId: v.id("users"), // business or subscriber ID


        // nature of business
        // BIR REGISTERED OR NOT?
        // items have category (if vege vat exempt)
        // businessTaxType: v.union(
        //     v.literal("NON_VAT"), // 
        //     v.literal("VAT"), // 
        //     v.literal("VAT_EXEMPT"),
        //     v.literal("ZERO_RATED"),
        //     v.literal("MIXED"), // some items vat, some exempt
        //     v.literal("PAYMENT_RECEIPT")
        // ),

        // nature of business
        businessType: v.union(
            v.literal("Freelancer/Individual"),
            v.literal("Small Business"), // create validation for backend
            v.literal("VAT-Registered Business"),
        ),
        vatRegistration: v.boolean(),

        // business infos
        businessName: v.string(),
        tin: v.optional(v.string()), //
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
            v.literal("VAT_EXEMPT"), // 
            v.literal("ZERO_RATED"), // 
            v.literal("MIXED"), // some items vat, some exempt
            v.literal("PAYMENT_RECEIPT") // 
        ),

        // discounts
        discountType: v.optional(
            v.union(
                v.literal("PERCENT"),
                v.literal("FIXED")
            )
        ),
        discountValue: v.optional(v.number()),
        discountAmount: v.optional(v.number()),

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
        specialDiscountAmount: v.optional(v.number()),

        // items
        items: v.array(
            v.object({
                unitPrice: v.number(),
                description: v.string(),
                quantity: v.number(),
                amount: v.number(),
                vatType: v.union(
                    v.literal("VATABLE"),
                    v.literal("VAT_EXEMPT"),  // VAT-EXEMPT = “This sale is exempt from VAT even though the business is VAT-registered.”
                    v.literal("ZERO_RATED"),
                    v.literal("NON_VAT"), // NON-VAT = “This business does not deal with VAT at all.”
                ),
            })
        ),

        // buyer info
        buyerName: v.string(),
        buyerTin: v.optional(v.string()), // if b2c usually no tin.
        buyerAddress: v.optional(v.string()), // same case if b2c usually no tin.

        // currency
        currency: v.optional(v.string()), // currency used in invoice

        // totality
        vatableSales: v.number(), // products without tax
        vatAmount: v.number(), // 12% of vatable sales (vatableSales * 0.12)
        vatExemptSales: v.optional(v.number()), // Sales exempt from VAT
        zeroRatedSales: v.optional(v.number()), // Sales with 0% VAT

        grossTotal: v.number(), // before any discounts (vat inclusive price)
        lessDiscount: v.optional(v.number()),    // Regular discount
        lessSpecialDiscount: v.optional(v.number()), // SC/PWD discount
        netAmount: v.number(),          // After discounts, before tax
        totalAmount: v.number(),        // Final amount

        // draft = wag ibilang sa mga successful invoices
        status: v.union(
            v.literal("DRAFT"),
            v.literal("SENT"),
            v.literal("PAID"),
            v.literal("UNPAID")
        ),
        pdfUrl: v.optional(v.string()),
        updatedAt: v.number(),
    }).index("by_user", ["userId"]),

    // items catalog table
    itemCatalog: defineTable({
        userId: v.id("users"), // business/subscriber who owns this item
        // invoiceId: v.id("invoices"),

        unitPrice: v.number(),
        description: v.string(), // goods or nature of service
        isActive: v.boolean(), // soft delete
        // quantity: v.number(),
        // amount: v.number(), // quantity * unitPrice = amount vlaue

        vatType: v.union(
            v.literal("VATABLE"), // Subject to 12% VAT
            v.literal("NON_VAT"), // Seller not VAT-registered (usually for small businesses < 3MPHP ANNUAL SALES)
            v.literal("VAT_EXEMPT"), // No VAT (usually educational services, books, newspapers)
            v.literal("ZERO_RATED"), // 0% VAT (for export / international transport) 
        ),
        //

        // isSpecialDiscountEligible: v.boolean(),
    })
        // .index("by_invoice", ["invoiceId"])
        .index("by_user", ["userId"]),
    // branding
    branding: defineTable({
        userId: v.id("users"), //subscriber

        // visuals
        accentColor: v.string(),
        headerLayout: v.string(),
        logoUrl: v.optional(v.string()),
        digitalSignatureUrl: v.optional(v.string()),
    }),
    // invoice counter table for better scalability
    invoiceCounters: defineTable({
        name: v.string(),
        value: v.number(),
    }).index("by_name", ["name"]),
});