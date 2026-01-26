import { mutation as rawMutation, internalMutation as rawInternalMutation } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { aggregateInvoiceByUser, aggregateInvoiceVat, aggregateInvoiceVatableSales, aggregateInvoiceVatExemptSales, aggregateInvoiceZeroRatedSales, aggregateRevenueByUser } from "./aggregate";

const triggers = new Triggers<DataModel>();

triggers.register("invoices", async (ctx, change) => {

    // insert means mag rrun lang to kapag .insert ang ginamit sa mutation
    if (change.operation === "insert") {
        // when creating invoice, insert the new doc to the aggregate table para ma-save and ma-count
        await aggregateInvoiceByUser.insert(ctx, change.newDoc);
    }

    // update means mag rrun lang to kapag .patch ang ginamit na mutation
    if (change.operation === "update") {
        // for changing of invoice status, dapat mag cchange din si aggregate
        await aggregateInvoiceByUser.replace(ctx, change.oldDoc, change.newDoc);
        await aggregateRevenueByUser.insert(ctx, change.newDoc!);
        await aggregateInvoiceVatableSales.insert(ctx, change.newDoc!)
        await aggregateInvoiceVat.insert(ctx, change.newDoc!);
        await aggregateInvoiceZeroRatedSales.insert(ctx, change.newDoc!)
        await aggregateInvoiceVatExemptSales.insert(ctx, change.newDoc!)
    }
})

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));