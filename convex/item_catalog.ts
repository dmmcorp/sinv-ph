import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";

const getNameValue = (
  userId: string,
  value: string,
) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const normalizedName = `item_${normalized}_${userId}`;

  return normalizedName
};

const inferVatTypeFromSellerProfile = async (
  ctx: QueryCtx,
  businessProfileId: Id<"business_profile"> | undefined,
): Promise<"VATABLE" | "VAT_EXEMPT"> => {

  // meaning hindi nag onboarding
  if (!businessProfileId) {
    return "VAT_EXEMPT"
  }

  const userBusinessProfile = await ctx.db.get(businessProfileId)
  if (!userBusinessProfile) {
    return "VAT_EXEMPT"
  }

  // meaning freelancer or small business
  if (userBusinessProfile.vatRegistration === false) {
    return "VAT_EXEMPT"
  }

  // else VAT Registered Business
  return "VATABLE"
}

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
    ),
    legalFlags: v.optional(
      v.object({
        scPwdEligible: v.optional(v.boolean()),
        soloParentEligible: v.optional(v.boolean()),
        naacEligible: v.optional(v.boolean()),
        movEligible: v.optional(v.boolean()),
      })
    ),
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
    legalFlags,
  }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    // unit price and description validation
    if (unitPrice < 0) {
      throw new ConvexError("Value cannot be negative.")
    }

    if (!description.trim()) {
      throw new ConvexError("Description is required.")
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("No user found.")
    }

    const normalizedName = getNameValue(userId, description);

    const existing = await ctx.db
      .query("itemCatalog")
      .withIndex("by_normalizedName", q => q.eq("normalizedName", normalizedName))
      .first()

    if (existing) {
      throw new ConvexError(`An item named ${description} already exists in your catalog`);
    }

    let inferredVatType = vatType
    if (!inferredVatType) {
      inferredVatType = await inferVatTypeFromSellerProfile(
        ctx,
        user.businessProfileId,
      )
    }

    const businessProfile = user.businessProfileId
      ? await ctx.db.get(user.businessProfileId)
      : null

    // freelancer = !complete onboarding

    // user has not completed onboarding then he cant create vatable sales and zero rated sales
    if (!user.businessProfileId && inferredVatType === "VATABLE") {
      throw new ConvexError("Please complete onboarding to create a vatable item.")
    }

    // user has completed onboarding but they are a freelancer or small business that somehow bypassed the system to get an input of VATABLE
    if (businessProfile && businessProfile.vatRegistration === false && (inferredVatType === "VATABLE" || inferredVatType === "ZERO_RATED")) {
      throw new ConvexError(
        "Your business is not VAT-registered; you cannot create a VATABLE item. Update your business profile or choose a different VAT type."
      )
    }


    const itemId = await ctx.db.insert("itemCatalog", {
      userId,
      description: description.trim(),
      unitPrice,
      vatType: inferredVatType,
      isActive: true,
      legalFlags,
      normalizedName,
    });

    if (itemId) {
      const newItem = await ctx.db.get(itemId);
      if (!newItem) {
        return {
          message: "Can't Find the newly created item id in the db.",
          newItem: null,
        };
      }
      return { message: "Success", newItem: newItem };
    }


    return { messeage: "Error Creating new item", newItem: null };

    // return { message: "Failed to create an item." }

    // if vat type is existing in the arguments then .....
    // if (vatType) {
    //   const id = await ctx.db.insert("itemCatalog", {
    //     userId,
    //     description,
    //     unitPrice,
    //     vatType,
    //     isActive: true,
    //   });

    //   if (id) {
    //     const newItem = await ctx.db.get(id);
    //     if (!newItem) {
    //       return {
    //         messeage: "Can't Find the newly created item id in the db.",
    //         newItem: null,
    //       };
    //     }
    //     return { messeage: "Success", newItem: newItem };
    //   }
    // } 
    // else {
    //   // else ... for freelancer / small business
    //   // if the user has not finished onboarding PARA MAKUHA YUNG VAT TYPE BUMASE SA BUSINESS TYPE
    //   // let businessType = "Freelancer/Individual"; // default if the user is skip the onboarding process

    //   // if user has not completed onboarding DEFAULT to Freelancer/Individual
    //   if (!user.businessProfileId) {
    //     const id = await ctx.db.insert("itemCatalog", {
    //       userId,
    //       description,
    //       unitPrice,
    //       vatType: "VAT_EXEMPT",
    //       isActive: true,
    //     });

    //     if (id) {
    //       const newItem = await ctx.db.get(id);
    //       if (!newItem) {
    //         return {
    //           messeage: "Can't Find the newly created item id in the db.",
    //           newItem: null,
    //         };
    //       }
    //       return { messeage: "Success", newItem: newItem };
    //     }
    //   } else if (user && user.businessProfileId) {
    //     const userBusinessProfile = await ctx.db.get(user.businessProfileId);
    //     if (userBusinessProfile?.businessType === "Small Business") {
    //       const id = await ctx.db.insert("itemCatalog", {
    //         userId,
    //         description,
    //         unitPrice,
    //         vatType: "VAT_EXEMPT",
    //         isActive: true,
    //       });

    //       if (id) {
    //         const newItem = await ctx.db.get(id);
    //         if (!newItem) {
    //           return {
    //             messeage: "Can't Find the newly created item id in the db.",
    //             newItem: null,
    //           };
    //         }
    //         return { messeage: "Success", newItem: newItem };
    //       }
    //     }
    //   }
    // }



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
  },
});

export const getAllItems = query({
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

export const updateItem = mutation({
  args: {
    itemCatalogId: v.id("itemCatalog"),
    unitPrice: v.number(),
    description: v.string(), // goods or nature of service
    vatType: v.union(
      v.literal("VATABLE"), // Subject to 12% VAT
      v.literal("VAT_EXEMPT"), // Legally exempt (fresh goods, books, etc.)
      v.literal("ZERO_RATED") // 0% VAT (exports)
      // v.literal("NON_VAT") // Not subject to VAT
    ),
  },
  handler: async (ctx, {
    description,
    itemCatalogId,
    unitPrice,
    vatType,
  }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated!");
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      throw new ConvexError("No user found.")
    }

    const businessProfile = user.businessProfileId ?
      await ctx.db.get(user.businessProfileId)
      : null

    // unit price and description validation
    if (unitPrice < 0) {
      throw new ConvexError("Value cannot be negative.")
    }

    if (!description.trim()) {
      throw new ConvexError("Description is required.")
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

    let inferredVatType = vatType
    // if user is trying to update the item to vatable or zero rated but they have not completed onboarding.
    if ((inferredVatType === "VATABLE" || inferredVatType === "ZERO_RATED") && !user.businessProfileId) {
      throw new ConvexError(`Cant update this item to ${inferredVatType}, you have not completed onboarding yet.`)
    }

    // if user is trying to update the item to vatable and they have completed onboarding BUT is freelancer or small business.
    if (businessProfile && businessProfile.vatRegistration === false && (inferredVatType === "VATABLE" || inferredVatType === "ZERO_RATED")) {
      throw new ConvexError(`Cant update this item to ${inferredVatType}. Only VAT-Registered Businesses can do this.`)
    }

    return await ctx.db.patch(itemCatalog._id, {
      description: description.trim(),
      unitPrice,
      vatType: inferredVatType,
    })

  }
})