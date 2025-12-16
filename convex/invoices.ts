import { calculateInvoiceAmounts } from "@/../../lib/utils";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// COUNTER SYNTAX:
// INVOCE - TYPE OF INVOICE - BUSINESS ID - YEAR
const getCounterName = (
  userId: string,
  year: number,
  type: "SALES" | "SERVICE" | "COMMERCIAL"
) => {
  return `invoice_${type}_${userId}_${year}`;
};

export const getNextInvoiceNumber = query({
  args: {
    invoiceType: v.union(
      v.literal("SALES"),
      v.literal("SERVICE"),
      v.literal("COMMERCIAL")
    ),
  },
  handler: async (ctx, { invoiceType }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const currentYear = new Date().getFullYear();
    const counterName = getCounterName(userId, currentYear, invoiceType);

    const existingCounter = await ctx.db
      .query("invoiceCounters")
      .withIndex("by_name", (q) => q.eq("name", counterName))
      .first();

    // fetch next serial number if doesnt exist then 1st invoice
    const nextSerialNumber = existingCounter ? existingCounter.value + 1 : 1;

    const prefix =
      invoiceType === "SALES" ? "SI" : invoiceType === "SERVICE" ? "SV" : "CM";

    return `${prefix}-${currentYear}-${nextSerialNumber.toString().padStart(5, "0")}`;
  },
});

export const createInvoice = mutation({
  args: {
    // client
    clientId: v.id("clients"),

    // invoice infos
    invoiceType: v.union(
      v.literal("SALES"),
      v.literal("SERVICE"),
      v.literal("COMMERCIAL")
    ),
    // invoiceNumber: v.string(), // This is auto generated and incremental (CHECK DOCS MHF for rules)

    // seller infos (subscribers)
    sellerBusinessName: v.string(),
    sellerTin: v.optional(v.string()),
    sellerAddress: v.optional(v.string()),
    sellerVatStatus: v.union(v.literal("VAT"), v.literal("NON_VAT")),

    // buyer infos
    buyerName: v.string(),
    buyerTin: v.optional(v.string()),
    buyerAddress: v.optional(v.string()),

    // tax infos
    taxType: v.optional(
      v.union(
        v.literal("NON_VAT"),
        v.literal("VAT"),
        v.literal("VAT_EXEMPT"),
        v.literal("ZERO_RATED"),
        v.literal("MIXED"),
        v.literal("PAYMENT_RECEIPT")
      )
    ),

    // discounts
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

    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        amount: v.number(),

        vatType: v.optional(
          v.union(
            v.literal("VATABLE"),
            v.literal("VAT_EXEMPT"),
            v.literal("ZERO_RATED")

            // v.literal("NON_VAT"),
          )
        ),
      })
    ),

    // status
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("SENT"),
        v.literal("PAID"),
        v.literal("UNPAID")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError("User not found");
    }

    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== user._id) {
      throw new ConvexError("Client not found or unauthorized");
    }

    if (!args.items) {
      throw new ConvexError("An invoice should have atleast 1 item to create.");
    }

    if (!args.taxType) {
      throw new ConvexError("A tax type is required for an invoice");
    }

    if (!args.invoiceType) {
      throw new ConvexError(
        `Sales invoice format required. i.e "Sales", "Commercial" or "Service"  `
      );
    }

    // let subTotal = 0;

    // for (const item of args.items) {
    //     const itemAmount = item.unitPrice * item.quantity
    //     subTotal += itemAmount
    // }

    // let taxAmount = 0;

    // // for VAT
    // if (args.taxType === "VAT") {
    //     taxAmount = subTotal * VAT_RATE;
    // }

    // // TODO OTHER TAXTYPE (IF IBA YUNG COMPUTATION)

    // const totalAmount = subTotal + taxAmount;

    const amounts = calculateInvoiceAmounts({
      items: args.items,
      taxType: args.taxType,
      discountType: args.discountType,
      discountValue: args.discountValue,
      specialDiscountType: args.specialDiscountType,
    });

    // SERIAL/INVOICE NUMBER GENERATION:
    const currentYear = new Date().getFullYear();
    const counterName = getCounterName(user._id, currentYear, args.invoiceType);
    let serialNumber: number;

    // counter table
    const existingCounter = await ctx.db
      .query("invoiceCounters")
      .withIndex("by_name", (q) => q.eq("name", counterName))
      .first();

    if (existingCounter) {
      serialNumber = existingCounter.value + 1;

      await ctx.db.patch(existingCounter._id, {
        value: serialNumber,
      });
    } else {
      serialNumber = 1;
      await ctx.db.insert("invoiceCounters", {
        name: counterName,
        value: serialNumber, // this means first invoice
      });
    }

    const prefix =
      args.invoiceType === "SALES"
        ? "SI"
        : args.invoiceType === "SERVICE"
          ? "SV"
          : "CM";

    const invoiceNumber = `${prefix}-${currentYear}-${serialNumber.toString().padStart(5, "0")}`;

    const invoiceId = await ctx.db.insert("invoices", {
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

      // items
      items: args.items,

      // discount fields
      discountType: args.discountType,
      discountValue: args.discountValue,
      discountAmount: amounts.regularDiscountAmount,
      specialDiscountType: args.specialDiscountType,
      specialDiscountId: args.specialDiscountId,
      specialDiscountAmount: amounts.specialDiscountAmount,

      // totals
      grossTotal: amounts.grossTotal,
      lessDiscount: amounts.regularDiscountAmount,
      lessSpecialDiscount: amounts.specialDiscountAmount,

      vatableSales: amounts.vatableSales,
      vatExemptSales: amounts.vatExemptSales,
      zeroRatedSales: amounts.zeroRatedSales,

      vatAmount: amounts.vatAmount,

      netAmount: amounts.netAmount,
      totalAmount: amounts.totalAmount,

      // miscs.
      status: args.status ?? "DRAFT",
      updatedAt: Math.floor(Date.now() / 1000),
    });

    return invoiceId;
  },
});

export const getAllInvoices = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getSpecificInvoiceFromClient = query({
  args: {
    clientId: v.id("clients"),
  },
  handler: async (ctx, { clientId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const client = await ctx.db.get(clientId);
    if (!client) {
      throw new ConvexError("Client not found!");
    }

    if (client.userId !== userId) {
      throw new ConvexError("Error: Unauthorized!");
    }

    return await ctx.db
      .query("invoices")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .order("desc")
      .collect();
  },
});
