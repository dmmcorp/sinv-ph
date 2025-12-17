import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createItem = mutation({
  args: {
    unitPrice: v.number(),
    description: v.string(), // goods or nature of service

    vatType: v.optional(
      v.union(
        v.literal("VATABLE"), // Subject to 12% VAT
        v.literal("VAT_EXEMPT"), // Legally exempt (fresh goods, books, etc.)
        v.literal("ZERO_RATED") // 0% VAT (exports)
        // v.literal("NON_VAT") // Not subject to VAT
      ),
    )


    // category: v.optional(
    //   v.union(
    //     v.literal("GOODS"),
    //     v.literal("SERVICE"),
    //     v.literal("PROFESSIONAL_FEE"),
    //     v.literal("VEGETABLES"),
    //     v.literal("FRUITS"),
    //     v.literal("OTHER")
    //   )
    // ),
  },
  handler: async (ctx, {
    description,
    unitPrice,
    vatType,
  }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    // if vat type is existing in the arguments then .....
    if (vatType) {
      const id = await ctx.db.insert("itemCatalog", {
        userId,
        description,
        unitPrice,
        vatType,
        isActive: true,
      });

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
    } else {
      // else ... for freelancer / small business
      // if the user has not finished onboarding PARA MAKUHA YUNG VAT TYPE BUMASE SA BUSINESS TYPE
    }

    let businessType = "Freelancer/Individual"; // default if the user is skip the onboarding process

    const user = await ctx.db.get(userId);
    if (user && user.businessProfileId) {
      const userBusinessProfile = await ctx.db.get(user.businessProfileId);
      if (userBusinessProfile) {
        businessType = userBusinessProfile?.businessType;
      }
    }

    // const id = await ctx.db.insert("itemCatalog", {
    //   userId,
    //   isActive: true,
    // });

    // if (id) {
    //   const newItem = await ctx.db.get(id);
    //   if (!newItem) {
    //     return {
    //       messeage: "Can't Find the newly created item id in the db.",
    //       newItem: null,
    //     };
    //   }
    //   return { messeage: "Success", newItem: newItem };
    // }

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

export const changeItemCatalogStatus = mutation({
  args: {
    itemCatalogId: v.id("itemCatalog"),
    status: v.boolean(),
  },
  handler: async (ctx, { itemCatalogId, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    // does item exist
    const itemCatalog = await ctx.db.get(itemCatalogId);
    if (!itemCatalog) {
      throw new ConvexError("Error: Item not found");
    }

    // check ownership if it is their item or not
    if (itemCatalog.userId !== userId) {
      throw new ConvexError("Not authorized to modify this item");
    }

    return await ctx.db.patch(itemCatalogId, {
      isActive: status,
    });
  },
});
