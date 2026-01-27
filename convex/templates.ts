import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { randomHexColor } from "../lib/utils";

export const getAllTemplates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const existingUserTemplates = await ctx.db
      .query("userTemplates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const templates = await ctx.db.query("templates").collect();

    return {
      templates,
      existingUserTemplates,
    };
  },
});

// const existingUserTemplates: {
//     _id: Id<"userTemplates">;
//     _creationTime: number;
//     layoutConfig?: {
//         headerPosition?: "top" | "left" | undefined;
//         logoPosition?: "top-left" | "center" | undefined;
//         showFooterTotals?: boolean | undefined;
//         itemTableStyle?: "grid" | "list" | "compact" | undefined;
//         font?: string | undefined;
//     } | undefined;

//     primaryColor: string;
//     secondaryColor: string;
//     headerColor: string;
//     backgroundColor: string;
//     templateName: string;
//     userId: Id<"users">;
//     templateId: Id<"templates">;
// }[]

// const templates: {
//     _id: Id<"templates">;
//     _creationTime: number;
//     primaryColor: string;
//     secondaryColor: string;
//     headerColor: string;
//     backgroundColor: string;
//     layoutConfig: {
//         headerPosition: "top" | "left";
//         logoPosition: "top-left" | "center";
//         showFooterTotals: boolean;
//         itemTableStyle: "grid" | "list" | "compact";
//         font: string;
//     };
//     templateName: string;
// }[]

export const createUserTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    primaryColor: v.string(), // hex values // usually bold 10% of sales invoice template
    secondaryColor: v.string(), // hex values // usually normal text
    headerColor: v.string(), // hex values (header color for template)
    backgroundColor: v.string(), // hex values (background color)

    templateName: v.string(),

    layoutConfig: v.optional(
      v.object({
        headerPosition: v.optional(
          v.union(v.literal("top"), v.literal("left")),
        ),
        logoPosition: v.optional(
          v.union(v.literal("top-left"), v.literal("center")),
        ),
        showFooterTotals: v.optional(v.boolean()),
        itemTableStyle: v.optional(
          v.union(v.literal("grid"), v.literal("list"), v.literal("compact")),
        ),
        font: v.optional(v.string()),
      }),
    ),

    isSaved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const userTemplateId = await ctx.db.insert("userTemplates", {
      userId,
      templateId: args.templateId,
      primaryColor: args.primaryColor,
      secondaryColor: args.secondaryColor,
      headerColor: args.headerColor,
      backgroundColor: args.backgroundColor,
      layoutConfig: args.layoutConfig,
      templateName: args.templateName,
    });

    if (args.isSaved) {
      const businessProfile = await ctx.db
        .query("business_profile")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (!businessProfile) {
        throw new ConvexError(
          "Couldn't find business profile, make sure onboarding is complete.",
        );
      }

      await ctx.db.patch(businessProfile._id, {
        defaultTemplate: userTemplateId,
        updatedAt: Math.floor(Date.now() / 1000), // unix timestamp,
      });
    }

    return userTemplateId;
  },
});

export const editUserTemplate = mutation({
  args: {
    userTemplateId: v.id("userTemplates"),
    primaryColor: v.optional(v.string()), // hex values // usually bold 10% of sales invoice template
    secondaryColor: v.optional(v.string()), // hex values // usually normal text
    headerColor: v.optional(v.string()), // hex values (header color for template)
    backgroundColor: v.optional(v.string()), // hex values (background color)
    templateName: v.optional(v.string()),

    layoutConfig: v.optional(
      v.object({
        headerPosition: v.optional(
          v.union(v.literal("top"), v.literal("left")),
        ),
        logoPosition: v.optional(
          v.union(v.literal("top-left"), v.literal("center")),
        ),
        showFooterTotals: v.optional(v.boolean()),
        itemTableStyle: v.optional(
          v.union(v.literal("grid"), v.literal("list"), v.literal("compact")),
        ),
        font: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const userTemplate = await ctx.db.get(args.userTemplateId);
    if (!userTemplate) {
      throw new ConvexError("No user template found.");
    }

    if (userTemplate.userId !== userId) {
      throw new ConvexError(
        "Invalid action. You are editing a user template that does not belong to you.",
      );
    }

    // const invoice = await ctx.db
    //     .query("invoices")
    //     .withIndex("by_userTemplates", q => q.eq("userTemplateId", userTemplate._id))
    //     .first()
    // if (!invoice) {
    //     throw new ConvexError("Couldn't find invoice.")
    // }

    // if (invoice.status === "PAID") {
    //     throw new ConvexError("Invalid aciton. You can't redesign template")
    // }

    // patching only those values provided
    const update: Partial<typeof userTemplate> = {};

    if (args.primaryColor !== undefined)
      update.primaryColor = args.primaryColor;

    if (args.secondaryColor !== undefined)
      update.secondaryColor = args.secondaryColor;

    if (args.headerColor !== undefined) update.headerColor = args.headerColor;

    if (args.backgroundColor !== undefined)
      update.backgroundColor = args.backgroundColor;

    if (args.templateName !== undefined)
      update.templateName = args.templateName;

    if (args.layoutConfig !== undefined) {
      update.layoutConfig = {
        ...(userTemplate.layoutConfig ?? {}),
        ...args.layoutConfig,
      };
    }

    return await ctx.db.patch(userTemplate._id, update);
  },
});

export const getDefaultTemplate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const businessProfile = await ctx.db
      .query("business_profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!businessProfile?.defaultTemplate) {
      return null;
    }

    return await ctx.db.get(
      businessProfile.defaultTemplate as Id<"userTemplates">,
    );
  },
});

export const makeDefaultTemplate = mutation({
  args: {
    userTemplateId: v.id("userTemplates"),
  },
  handler: async (ctx, { userTemplateId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const businessProfile = await ctx.db
      .query("business_profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!businessProfile) {
      throw new ConvexError(
        "Couldn't find business profile, make sure onboarding is complete.",
      );
    }

    await ctx.db.patch(businessProfile._id, {
      defaultTemplate: userTemplateId,
    });

    return true;
  },
});

export const changeInvoiceUserTemplate = mutation({
  args: {
    invoiceId: v.id("invoices"),
    userTemplateId: v.id("userTemplates"), // the user template id na magiging
  },
  handler: async (ctx, { invoiceId, userTemplateId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) {
      throw new ConvexError("Couldn't find invoice.");
    }

    if (invoice.status !== "DRAFT") {
      throw new ConvexError("Issued invoices cannot be modified.");
    }

    if (invoice.userId !== userId) {
      throw new ConvexError("Access denied.");
    }

    if (invoice.userTemplateId === userTemplateId) {
      throw new ConvexError("Invoice already uses this template.");
    }

    await ctx.db.patch(invoice._id, { userTemplateId });
    return true;
  },
});

// ------------ generating random templates for testing (with helpers) -----------------

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBool() {
  return Math.random() > 0.5;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T extends readonly string[]>(values: T): T[number] {
  return values[Math.floor(Math.random() * values.length)];
}

const HEADER_LAYOUT = ["left", "right", "split"] as const;
const DENSITY = ["compact", "normal", "spacious"] as const;
const PADDING = ["none", "sm", "md", "lg", "xl"] as const;
const RADIUS = ["none", "sm", "md", "lg", "xl"] as const;
const COLOR_TOKEN = ["default", "muted", "primary", "accent"] as const;
const FONT_SIZE = ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"] as const;
const FONT_WEIGHT = ["light", "normal", "medium", "semibold", "bold"] as const;
const TEXT_ALIGN = ["left", "center", "right"] as const;


function generateHeaderSection() {
  return {
    layout: pick(HEADER_LAYOUT),
    density: pick(DENSITY),
    padding: pick(PADDING),
    radius: pick(RADIUS),
    background: pick(COLOR_TOKEN),
    border: pick(["none", "light", "strong"] as const),
    textColor: randomHexColor(),

    businessInfo: {
      visibility: {
        logo: Math.random() > 0.2,
        businessName: true,
        address: Math.random() > 0.3,
        contactDetails: Math.random() > 0.4,
      },
      styleTokens: {
        logoSize: pick(["sm", "md", "lg", "xl"] as const),
        businessNameSize: pick(FONT_SIZE),
        businessNameWeight: pick(FONT_WEIGHT),
        businessMetaSize: pick(FONT_SIZE),
        businessMetaWeight: pick(FONT_WEIGHT),
        textAlign: pick(TEXT_ALIGN),
      },
    },

    invoiceMeta: {
      visibility: {
        invoiceNumber: true,
        issueDate: true,
        dueDate: Math.random() > 0.5,
      },
      styleTokens: {
        invoiceTitleSize: pick(FONT_SIZE),
        invoiceTitleWeight: pick(FONT_WEIGHT),
        metaSize: pick(FONT_SIZE),
        metaWeight: pick(FONT_WEIGHT),
        textAlign: pick(TEXT_ALIGN),
      },
    },
  };
}

function generateCustomerSection() {
  return {
    layout: pick(HEADER_LAYOUT),
    density: pick(DENSITY),
    padding: pick(PADDING),

    visibility: {
      name: true,
      address: Math.random() > 0.2,
      email: Math.random() > 0.3,
      phone: Math.random() > 0.5,
    },

    styleTokens: {
      nameSize: pick(FONT_SIZE),
      nameWeight: pick(FONT_WEIGHT),
      metaSize: pick(FONT_SIZE),
      metaWeight: pick(FONT_WEIGHT),
      textAlign: pick(TEXT_ALIGN),
    },
  };
}

function generateLineItemsSection() {
  return {
    layout: pick(["table", "stacked", "card"] as const),
    density: pick(DENSITY),
    padding: pick(PADDING),

    header: {
      backgroundColor: pick(COLOR_TOKEN),
      textColor: pick(COLOR_TOKEN),
      fontSize: pick(FONT_SIZE),
      fontWeight: pick(FONT_WEIGHT),
      textAlign: pick(TEXT_ALIGN),
    },

    visibility: {
      lineNumber: Math.random() > 0.5,
    },

    row: {
      style: pick(["plain", "striped", "bordered"] as const),
      styleTokens: {
        fontSize: pick(FONT_SIZE),
        fontWeight: pick(FONT_WEIGHT),
        textAlign: pick(TEXT_ALIGN),
      },
    },

    data: {
      fontSize: pick(FONT_SIZE),
      fontWeight: pick(FONT_WEIGHT),
      textAlign: pick(TEXT_ALIGN),
      textColor: "#111827",
    },
  };
}

function generateTotalsTextStyle() {
  return {
    fontSize: pick(FONT_SIZE),
    fontWeight: pick(FONT_WEIGHT),
    textColor: "#111827",
    textAlign: pick(TEXT_ALIGN),
    backgroundColor: Math.random() > 0.7 ? pick(COLOR_TOKEN) : undefined,
  };
}

function generateTotalsSection() {
  return {
    layout: pick(["table", "stacked", "card"] as const),
    density: pick(DENSITY),
    padding: pick(PADDING),
    backgroundColor: Math.random() > 0.6 ? pick(COLOR_TOKEN) : undefined,
    border: pick(["none", "light", "strong"] as const),
    radius: pick(RADIUS),

    subtotal: generateTotalsTextStyle(),
    taxBreakdown: generateTotalsTextStyle(),
    discount: generateTotalsTextStyle(),
    grandTotal: generateTotalsTextStyle(),
  };
}

export const createRandomTemplate = mutation({
  args: {
    templateKey: v.string(),
  },
  handler: async (ctx, { templateKey }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const templateId = await ctx.db.insert("templates", {
      templateKey,

      headerSection: generateHeaderSection(),
      customerSection: generateCustomerSection(),
      lineItemsSection: generateLineItemsSection(),
      totalsSection: generateTotalsSection(),
    });

    return templateId;
  },
});
