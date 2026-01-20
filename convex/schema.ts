import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.string(),
    emailVerified: v.optional(v.boolean()),
    role: v.union(v.literal("admin"), v.literal("subscriber")),

    onboarding: v.boolean(),
    updatedAt: v.number(),
    businessProfileId: v.optional(v.id("business_profile")), // para madaling makuha ang business profile ni user hindi na mag fifilter sa buong list
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
    // if selected freelancer then vatReg is automatically false.
    // if selected small business then vatReg is automatically false.
    // if selected VAT-Registered Business then vatReg is automatically true.
    businessType: v.union(
      v.literal("Freelancer/Individual"), // freelancer = automatic vat-exempt on items vatType (mapupunta sa NON-VAT taxtype)
      v.literal("Small Business"), // Scenario 1: If BIR Registered but not met 3m threshold then (mapupunta sa VAT_EXEMPT). Scenario 2: Not BIR Registered (NON-VAT)
      v.literal("VAT-Registered Business") // FOR 3M PATAAS (SHOULD BE VAT-REGISTERED)
    ),
    vatRegistration: v.boolean(), // SCENARIO 1: small business is registered OR (true) -> small business is not registered v.literal("VAT-Registered Business")

    //OWNER NAME

    // business infos
    businessName: v.optional(v.string()),
    sellerName: v.string(),
    tin: v.optional(v.string()),
    address: v.string(),
    logoUrl: v.string(),
    defaultTemplate: v.optional(v.id("userTemplates")), // existing

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

    // template related fields
    userTemplateId: v.optional(v.id("userTemplates")), // template invoice
    templateSnapshot: v.optional(
      v.object({
        // colors
        primaryColor: v.string(),
        secondaryColor: v.string(),
        headerColor: v.string(),
        backgroundColor: v.string(),

        // layout
        layoutConfig: v.optional(v.object({
          headerPosition: v.union(v.literal("top"), v.literal("left")),
          logoPosition: v.union(v.literal("top-left"), v.literal("center")),
          showFooterTotals: v.boolean(),
          itemTableStyle: v.union(v.literal("grid"), v.literal("list"), v.literal("compact")),
          font: v.string(),

          // sourceUserTemplateId: v.optional(v.id("userTemplates")),
          // sourceTemplateId: v.optional(v.id("templates")),
        })),
      })
    ),

    // sellers (store pa rin, because as per BIR old invoices should remain the same business name even if that specific business changed its name, address or tin already.)
    sellerBusinessName: v.optional(v.string()), //nadadag 12/17/2025
    sellerName: v.string(), //nadadag 12/17/2025 //fix spelling 12/18/2025
    sellerTin: v.optional(v.string()),
    sellerAddress: v.optional(v.string()),
    sellerVatStatus: v.union(v.literal("VAT"), v.literal("NON_VAT")),

    invoiceType: v.union(
      v.literal("SALES"), // SI-00003 = sales i
      v.literal("SERVICE"),
      v.literal("COMMERCIAL")
    ), // from bir sales invoice format
    invoiceNumber: v.string(), // serial number

    // tax infos
    taxType: v.optional(
      v.union(
        v.literal("NON_VAT"), // NON-VAT INVOICE (LAHAT NG ITEMS AY NON VAT)  IF !VATREGISTERED
        v.literal("VAT"), // FOR VAT-REGISTERED BUSINESSES (LAHAT NG ITEMS AY VATABLE)
        v.literal("VAT_EXEMPT"), // FOR VAT-REGISTERED BUSINESSES (LAHAT NG ITEMS AY VAT-EXEMPT)
        v.literal("ZERO_RATED"), // FOR EXPORTS (NOT SURE)
        v.literal("MIXED"), // FOR VAT-REGISTERED BUSINESSES (MAY PC TAS MAY GULAY)
        v.literal("PAYMENT_RECEIPT") // (TO STUDY)
      )
    ),

    // discounts
    discountType: v.optional(v.union(v.literal("PERCENT"), v.literal("FIXED"))),
    discountValue: v.optional(v.number()),
    discountAmount: v.optional(v.number()),

    specialDiscountType: v.optional(
      v.union(
        v.literal("SC"),
        v.literal("PWD"),
        v.literal("NAAC"),
        v.literal("MOV"),
        v.literal("SP"),
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
          v.literal("VAT_EXEMPT"), // VAT-EXEMPT = “This sale is exempt from VAT even though the business is VAT-registered.”
          v.literal("ZERO_RATED")
          // v.literal("NON_VAT"), // NON-VAT = “This business does not deal with VAT at all.” this is a seller status not a vat item type
        ),

        // needed to identify if the item is eligible for special discount or not.
        legalFlags: v.optional(
          v.object({
            scPwdEligible: v.optional(v.boolean()),
            soloParentEligible: v.optional(v.boolean()),
            naacEligible: v.optional(v.boolean()),
            movEligible: v.optional(v.boolean()),
          })
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
    lessDiscount: v.optional(v.number()), // Regular discount
    lessSpecialDiscount: v.optional(v.number()), // SC/PWD discount
    netAmount: v.number(), // After discounts, before tax
    totalAmount: v.number(), // Final amount

    // draft = wag ibilang sa mga successful invoices
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PAID"), // HAS OR = PAID
      v.literal("OPEN"), // NO OR = NOT PAID
      v.literal("OVERDUE"),
    ),
    pdfUrl: v.optional(v.string()),
    invoiceDate: v.number(),
    dueDate: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_userTemplates", ["userTemplateId"])
    .index("by_client", ["clientId"]),

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
      // v.literal("NON_VAT"), // Seller not VAT-registered (usually for small businesses < 3MPHP ANNUAL SALES)
      v.literal("VAT_EXEMPT"), // No VAT (usually educational services, books, newspapers)
      v.literal("ZERO_RATED") // 0% VAT (for export / international transport)
    ),
    // bio flu
    legalFlags: v.optional(
      v.object({
        scPwdEligible: v.optional(v.boolean()),
        soloParentEligible: v.optional(v.boolean()),
        naacEligible: v.optional(v.boolean()),
        movEligible: v.optional(v.boolean()),
      })
    ),

    normalizedName: v.optional(v.string()),


    // TODO: Need to assess how to handle category properly and check if it is needed to be put in invoice
    // category: v.optional(
    //     v.union(
    //         v.literal("GOODS"),
    //         v.literal("SERVICE"),
    //         v.literal("PROFESSIONAL_FEE"),
    //         v.literal("VEGETABLES"),
    //         v.literal("FRUITS"),
    //         v.literal("OTHER"),
    //     )
    // ),
    //

    // isSpecialDiscountEligible: v.boolean(),
  })
    // .index("by_invoice", ["invoiceId"])
    .index("by_user", ["userId"])
    .index("by_normalizedName", ["normalizedName"]),
  // branding

  // 1st - 5 value (forest, sky)
  // // 6th value
  // TEMPLATES = POSITIONING OF ITEMS / FONTS

  templates: defineTable({
    // DEFAULT TEMPLATES

    // userId: v.id("users"),     // subscriber
    templateName: v.string(),       // TEMPLATE NAME
    layoutConfig: v.object({      // new field
      headerPosition: v.union(v.literal("top"), v.literal("left")),
      logoPosition: v.union(v.literal("top-left"), v.literal("center")),
      showFooterTotals: v.boolean(),
      itemTableStyle: v.union(v.literal("grid"), v.literal("list"), v.literal("compact")),
      font: v.string(),
    }),
    // visuals color customization
    primaryColor: v.string(),         // hex values // usually bold 10% of sales invoice template
    secondaryColor: v.string(),       // hex values // usually normal text
    headerColor: v.string(),          // hex values (header color for template)
    backgroundColor: v.string(),      // hex values (background color)
    // logoUrl: v.optional(v.string()),
    // digitalSignatureUrl: v.optional(v.string()),
  })
    .index("by_template", ["templateName"]),
  userTemplates: defineTable({
    userId: v.id("users"),
    templateId: v.id("templates"),

    templateName: v.string(),

    primaryColor: v.string(),     // hex values // usually bold 10% of sales invoice template
    secondaryColor: v.string(),   // hex values // usually normal text
    headerColor: v.string(),      // hex values (header color for template)
    backgroundColor: v.string(),  // hex values (background color)
    // colors
    // font weight
    // font design (sans-serif, etc..)
    // font size

    layoutConfig: v.optional(
      v.object({
        headerPosition: v.optional(v.union(v.literal("top"), v.literal("left"))),
        logoPosition: v.optional(v.union(v.literal("top-left"), v.literal("center"))),
        showFooterTotals: v.optional(v.boolean()),
        itemTableStyle: v.optional(
          v.union(v.literal("grid"), v.literal("list"), v.literal("compact"))
        ),
        font: v.optional(v.string()),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_template", ["templateId"]),
  // invoice counter table for better scalability
  invoiceCounters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index("by_name", ["name"]),
});
