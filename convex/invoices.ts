import { calculateInvoiceAmounts } from "@/../../lib/utils";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { TaxType } from "../lib/constants/TAX_TYPES";
import { Id } from "./_generated/dataModel";

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
    invoiceType: v.optional(
      v.union(v.literal("SALES"), v.literal("SERVICE"), v.literal("COMMERCIAL"))
    ), // 12/16/2025
  },
  handler: async (ctx, { invoiceType }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }
    if (!invoiceType) {
      return;
    } // 12/16/2025
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

    // return `${prefix}-${currentYear}-${nextSerialNumber.toString().padStart(5, "0")}`;
    return `${prefix}-${nextSerialNumber.toString().padStart(8, "0")}`;
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
    sellerBusinessName: v.optional(v.string()), //nadadag 12/17/2025
    sellerName: v.string(), //nadadag 12/17/2025
    sellerTin: v.optional(v.string()),
    sellerAddress: v.optional(v.string()),
    sellerVatStatus: v.union(v.literal("VAT"), v.literal("NON_VAT")),

    // buyer infos
    buyerName: v.string(),
    buyerTin: v.optional(v.string()),
    buyerAddress: v.optional(v.string()),

    // tax infos - this is auto generated here in the backend. Will depend on the items
    // freelancer = non_vat
    // small business = non_vat

    // vat-registered businesses
    // vat if and only if all items are VATABLE
    // vat_exempt if and only if all items are VAT_EXEMPT
    // zero_rated if and only if all items are ZERO_RATED
    // mixed if and only if the items are VATABLE with VAT_EXEMPT or VATABLE with ZERO_RATED or VAT_EXEMPT with ZERO_RATED
    // taxType: v.optional(
    //   v.union(
    //     v.literal("NON_VAT"),
    //     v.literal("VAT"),
    //     v.literal("VAT_EXEMPT"),
    //     v.literal("ZERO_RATED"),
    //     v.literal("MIXED"),
    //     v.literal("PAYMENT_RECEIPT")
    //   )
    // ),

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

        vatType: v.union(
          v.literal("VATABLE"),
          v.literal("VAT_EXEMPT"),
          v.literal("ZERO_RATED")

          // v.literal("NON_VAT"),
        ),
      })
    ),
    currency: v.string(),
    dueDate: v.optional(v.number()),

    // visuals x templates
    userTemplateId: v.optional(v.id("userTemplates")),

    // status
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("PAID"),
        v.literal("OPEN"),
        v.literal("OVERDUE"),
      ),
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

    if (!args.items || args.items.length === 0) {
      throw new ConvexError("An invoice must have at least one item.");
    }

    const businessProfile = user.businessProfileId
      ? await ctx.db.get(user.businessProfileId)
      : null;
    const isSellerVatRegistered = Boolean(
      businessProfile && businessProfile.vatRegistration
    );

    const itemTypes = new Set(args.items.map((i) => i.vatType));
    let taxType: TaxType;
    for (const item of args.items) {
      // normal checks
      if (item.unitPrice < 0)
        throw new ConvexError("Price cannot be negative.");
      if (item.quantity <= 0)
        throw new ConvexError("Quantity cannot be less than 0");
      if (!item.description.trim())
        throw new ConvexError("Description cannot be empty on an item");
    }

    if (!isSellerVatRegistered) {
      // if seller is not vat-registered they cant create vat or zero-rated sales (ITEM-BASED)
      if (itemTypes.has("VATABLE") || itemTypes.has("ZERO_RATED")) {
        throw new ConvexError(
          "Seller is not VAT-registered; items cannot be VATABLE or ZERO_RATED."
        );
      }

      taxType = "NON_VAT";
    } else {
      if (itemTypes.size === 1) {
        const only = [...itemTypes][0]; // just get the value of first element dahil sure naman na tayo na iisa lang ang item type dahil sa code na itemTypes.size === 1
        taxType =
          only === "VATABLE"
            ? "VAT"
            : only === "VAT_EXEMPT"
              ? "VAT_EXEMPT"
              : "ZERO_RATED";
      } else {
        // else mixed na kaagad since type size is 2 or many
        taxType = "MIXED";
      }
    }

    if (!taxType) {
      throw new ConvexError("A tax type is required for an invoice"); //nadadag 12/17/2025
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
      taxType,
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

    // !! Changed to a more robust and bir compliant invoice numbering
    // const invoiceNumber = `${prefix}-${currentYear}-${serialNumber.toString().padStart(5, "0")}`;
    const invoiceNumber = `${prefix}-${serialNumber.toString().padStart(8, "0")}`;

    // invoice date created
    const invoiceDate = Math.floor(Date.now() / 1000) // unix timestamp today

    const invoiceId = await ctx.db.insert("invoices", {
      // relationships
      userId: user._id,
      clientId: args.clientId,

      // seller (subscriber infos)
      sellerBusinessName: args.sellerBusinessName,
      sellerName: args.sellerName, //nadadag 12/17/2025 //fix spelling 12/18/2025
      sellerTin: args.sellerTin,
      sellerAddress: args.sellerAddress,
      sellerVatStatus: args.sellerVatStatus,

      // invoice infos
      invoiceType: args.invoiceType,
      invoiceNumber: invoiceNumber,

      // if vat, nonvat, etc.
      taxType,

      // buyer infos
      buyerName: args.buyerName,
      buyerTin: args.buyerTin,
      buyerAddress: args.buyerAddress,

      // items
      items: args.items,
      currency: args.currency, //12/19/2025
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
      userTemplateId: args.userTemplateId,
      status: args.status ?? "DRAFT",
      invoiceDate,
      dueDate: args.dueDate,
      updatedAt: Math.floor(Date.now() / 1000),
    });

    return invoiceId;
  },
});

// jh7553c3mahj1m82grmk02rj0d7z3es3
export const getInvoiceById = query({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, { invoiceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) {
      throw new ConvexError("Couldn't find invoice.")
    }

    if (invoice.userId !== userId) {
      throw new ConvexError("Access denied.");
    }

    let userTemplate = null;
    if (invoice.userTemplateId) {
      userTemplate = await ctx.db
        .get(invoice.userTemplateId)
    }

    return {
      invoice,
      userTemplate,
    }
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

export const handleInvoiceStatus = mutation({
  args: {
    invoiceId: v.id("invoices"),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PAID"),
      v.literal("OPEN"),
      v.literal("OVERDUE"),
    ),
  },
  handler: async (ctx, { invoiceId, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) {
      throw new ConvexError("Invoice not found");
    }

    if (invoice.userId !== userId) {
      throw new ConvexError("You are unauthorized to modify this invoice.");
    }

    // const client = await ctx.db.get(clientId);
    // if (!client) {
    //   throw new ConvexError("Client not found!");
    // }

    // // if this loggedin user is not authorized to modify this client then throw an error
    // if (client.userId !== userId) {
    //   throw new ConvexError("You are unauthorized to modify this invoice.")
    // }

    return await ctx.db.patch(invoiceId, {
      status,
      updatedAt: Math.floor(Date.now() / 1000), // unix timestamp today
    });
  },
});
