import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createItem = mutation({
  args: {
    unitPrice: v.number(),
    description: v.string(), // goods or nature of service

    vatType: v.union(
      v.literal("VATABLE"), // Subject to 12% VAT
      v.literal("VAT_EXEMPT"), // Legally exempt (fresh goods, books, etc.)
      v.literal("ZERO_RATED"), // 0% VAT (exports)
      v.literal("NON_VAT") // Not subject to VAT
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }
    const id = await ctx.db.insert("itemCatalog", {
      userId,
      isActive: true,
      ...args,
    });

    console.log(id);
    if (id) {
      const newItem = await ctx.db.get(id);
      if (!newItem) {
        return {
          messeage: "Can't Find the newly created item id in the db.",
          newItem: null,
        };
      }
      return { messeage: "Success", newItem: newItem };
    }

    return { messeage: "Error Creating new item", newItem: null };
  },
});

export const getAllItem = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    return await ctx.db
      .query("itemCatalog")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});
