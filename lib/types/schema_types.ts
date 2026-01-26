import { v } from "convex/values";

export const HeaderLeftObject = v.object({

    // CONTAINER
    container: v.object({
        alignment: v.union(
            v.literal("left"),
            v.literal("center"),
            v.literal("right")
        ),
        padding: v.object({
            top: v.number(),
            right: v.number(),
            bottom: v.number(),
            left: v.number(),
        }),
        backgroundColor: v.optional(v.string()),
        borderBottom: v.object({
            enabled: v.boolean(),
            color: v.string(),
            width: v.number(),
        }),
    }),
    // END OF CONTAINER

    // LOGO
    logo: v.object({
        display: v.union(
            v.literal("none"),
            v.literal("block"),
        ),
        position: v.union(
            v.literal("left"),
            v.literal("center"),
            v.literal("right"),
        ),
        maxWidth: v.number(),
        maxHeight: v.number(),
    }),
    // END OF LOGO

    // BUSINESS NAME
    businessName: v.object({
        visible: v.boolean(),
        style: v.object({
            fontFamily: v.string(),
            fontSize: v.number(),
            fontWeight: v.number(),
            color: v.string(),
            textTransform: v.union(
                v.literal("none"),
                v.literal("uppercase"),
                v.literal("lowercase"),
                v.literal("capitalize"),
            ),
            textAlign: v.union(
                v.literal("left"),
                v.literal("center"),
                v.literal("right"),
            ),
            lineHeight: v.number(),
        }),
    }),
    // END OF BUSINESS NAME

    // BUSINESS META
    businessMeta: v.object({
        visible: v.boolean(),
        style: v.object({
            fontFamily: v.string(),
            fontSize: v.number(),
            fontWeight: v.number(),
            color: v.string(),
            lineHeight: v.number(),
            textAlign: v.union(
                v.literal("left"),
                v.literal("center"),
                v.literal("right")
            ),
        }),
        spacingTop: v.number(),
    }),
    // END OF BUSINESS META

    // INVOICE TITLE
    invoiceTitle: v.object({
        visible: v.boolean(),
        variant: v.string(),
        style: v.object({
            fontFamily: v.string(),
            fontSize: v.number(),
            fontWeight: v.number(),
            color: v.string(),
            textAlign: v.union(
                v.literal("left"),
                v.literal("center"),
                v.literal("right")
            ),
        }),
    }),
    // END OF INVOICE TITLE

    // INVOICE META
    invoiceMeta: v.object({
        layout: v.string(),
        style: v.object({
            fontFamily: v.string(),
            fontSize: v.number(),
            fontWeight: v.number(),
            color: v.string(),
            lineHeight: v.number(),
            textAlign: v.union(
                v.literal("left"),
                v.literal("center"),
                v.literal("right")
            ),
        }),
    }),
    // END OF INVOICE META

})

export const HeaderContainerObject = v.object({
    display: v.union(
        v.literal("flex"),
        v.literal("grid"),
        v.literal("inline-flex"),
        v.literal("inline-grid"),
    ),
    flexDirection: v.union(
        v.literal("row"),
        v.literal("col"),
    ),
    justifyContent: v.union(
        v.literal("center"),
        v.literal("flex-start"),
        v.literal("flex-end"),
        v.literal("space-between"),
        v.literal("space-around"),
        v.literal("space-evenly"),
        v.literal("normal"),
        v.literal("stretch"),
    ),
    alignItems: v.string(),
    padding: v.string(),
    backgroundColor: v.string(),
})