import { v } from "convex/values";


const HeaderLayoutField = v.union(
    v.literal("left"),
    v.literal("right"),
    v.literal("split"),
)

const DensityField = v.union(
    v.literal("compact"),
    v.literal("normal"),
    v.literal("spacious"),
)

const PaddingField = v.union(
    v.literal("none"),
    v.literal("sm"),
    v.literal("md"),
    v.literal("lg"),
    v.literal("xl"),
)

const RadiusField = v.union(
    v.literal("none"),
    v.literal("sm"),
    v.literal("md"),
    v.literal("lg"),
    v.literal("xl"),
)

const ColorTokenField = v.union(
    v.literal("default"),
    v.literal("muted"),
    v.literal("primary"),
    v.literal("accent"),
)

const FontSizeTokenField = v.union(
    v.literal("xs"),
    v.literal("sm"),
    v.literal("md"),
    v.literal("lg"),
    v.literal("xl"),
    v.literal("xxl"),
    v.literal("xxxl"),
)

const FontWeightTokenField = v.union(
    v.literal("light"),
    v.literal("normal"),
    v.literal("medium"),
    v.literal("semibold"),
    v.literal("bold"),
)

const TextAlignTokenField = v.union(
    v.literal("left"),
    v.literal("center"),
    v.literal("right"),
)

const TotalsTextStyleField = v.object({
    fontSize: FontSizeTokenField,
    fontWeight: FontWeightTokenField,
    textColor: v.string(),
    textAlign: TextAlignTokenField,
    backgroundColor: v.optional(ColorTokenField),
})

export const HeaderSectionObject = v.object({
    layout: HeaderLayoutField,
    density: DensityField,
    padding: PaddingField,
    radius: RadiusField,
    background: ColorTokenField,
    border: v.union(
        v.literal("none"),
        v.literal("light"),
        v.literal("strong"),
    ),
    textColor: v.string(),
    businessInfo: v.object({
        visibility: v.object({
            logo: v.boolean(),
            businessName: v.boolean(),
            address: v.boolean(),
            contactDetails: v.boolean(),
        }),

        styleTokens: v.object({
            logoSize: v.union(
                v.literal("sm"),
                v.literal("md"),
                v.literal("lg"),
                v.literal("xl"),
            ),
            businessNameSize: FontSizeTokenField,
            businessNameWeight: FontWeightTokenField,
            businessMetaSize: FontSizeTokenField,
            businessMetaWeight: FontWeightTokenField,
            textAlign: v.optional(TextAlignTokenField),
        }),
    }),
    invoiceMeta: v.object({
        visibility: v.object({
            invoiceNumber: v.boolean(),
            issueDate: v.boolean(),
            dueDate: v.boolean(),
        }),
        styleTokens: v.object({
            invoiceTitleSize: FontSizeTokenField,
            invoiceTitleWeight: FontWeightTokenField,
            metaSize: FontSizeTokenField,
            metaWeight: FontWeightTokenField,
            textAlign: TextAlignTokenField,
        })
    }),
})

export const CustomerSectionObject = v.object({
    layout: HeaderLayoutField,
    density: DensityField,
    padding: PaddingField,
    visibility: v.object({
        name: v.boolean(),
        address: v.boolean(),
        email: v.boolean(),
        phone: v.optional(v.boolean()),
    }),
    styleTokens: v.object({
        nameSize: FontSizeTokenField,
        nameWeight: FontWeightTokenField,
        metaSize: FontSizeTokenField,
        metaWeight: FontWeightTokenField,
        textAlign: TextAlignTokenField,
    }),
})

export const LineItemsSectionObject = v.object({
    layout: v.union(
        v.literal("table"),
        v.literal("stacked"),
        v.literal("card"),
    ),
    density: DensityField,
    padding: PaddingField,
    header: v.object({
        backgroundColor: ColorTokenField,
        textColor: ColorTokenField,
        fontSize: FontSizeTokenField,
        fontWeight: FontWeightTokenField,
        textAlign: v.optional(TextAlignTokenField),
    }),
    visibility: v.object({
        lineNumber: v.boolean(),
    }),
    row: v.object({
        style: v.union(
            v.literal("plain"),
            v.literal("striped"),
            v.literal("bordered"),
        ),
        styleTokens: v.object({
            fontSize: FontSizeTokenField,
            fontWeight: FontWeightTokenField,
            textAlign: v.optional(TextAlignTokenField),
        }),
    }),
    data: v.object({
        fontSize: FontSizeTokenField,
        fontWeight: FontWeightTokenField,
        textAlign: v.optional(TextAlignTokenField),
        textColor: v.string(),
    }),
})

export const TotalsSectionObject = v.object({
    // Container
    layout: v.union(
        v.literal("table"),
        v.literal("stacked"),
        v.literal("card"),
    ),
    density: DensityField,
    padding: PaddingField,
    backgroundColor: v.optional(ColorTokenField),
    border: v.optional(v.union(
        v.literal("none"),
        v.literal("light"),
        v.literal("strong"),
    )),
    radius: v.optional(RadiusField),

    // Rows
    subtotal: TotalsTextStyleField,
    taxBreakdown: TotalsTextStyleField,
    discount: TotalsTextStyleField,
    grandTotal: TotalsTextStyleField,
})