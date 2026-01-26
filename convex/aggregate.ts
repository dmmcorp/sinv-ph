import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { DataModel, Id } from "./_generated/dataModel";
import { STATUSTYPE } from "../lib/constants/STATUS_TYPES"

function monthKey(issuedAt: number) {
    const d = new Date(issuedAt);
    // 2026-01 - transforming unix
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// ex: 2026
function yearKey(issuedAt: number) {
    const d = new Date(issuedAt);

    return `${d.getUTCFullYear()}`
}

export const aggregateInvoiceByUser = new TableAggregate<{
    Namespace: Id<"users">;
    Key: [string, STATUSTYPE]; // STATUS
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoices, {
    namespace: (doc) => doc.userId,
    sortKey: (doc) => [yearKey(doc._creationTime), doc.status],
})

export const aggregateRevenueByUser = new TableAggregate<{
    Key: [Id<"users">, string, STATUSTYPE];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoices, {
    sortKey: (doc) => [doc.userId, monthKey(doc._creationTime), doc.status],
    sumValue: (doc) => doc.totalAmount,
})

export const aggregateInvoiceVat = new TableAggregate<{
    Key: [Id<"users">, string];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoiceVat, {
    sortKey: (doc) => [doc.userId, yearKey(doc._creationTime)],
    sumValue: (doc) => doc.vatAmount,
})

export const aggregateInvoiceVatableSales = new TableAggregate<{
    Key: [Id<"users">, string];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoiceVatableSales, {
    sortKey: (doc) => [doc.userId, yearKey(doc._creationTime)],
    sumValue: (doc) => doc.vatableSales,
})

export const aggregateInvoiceZeroRatedSales = new TableAggregate<{
    Key: [Id<"users">, string];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoiceZeroRatedSales, {
    sortKey: (doc) => [doc.userId, yearKey(doc._creationTime)],
    sumValue: (doc) => doc.zeroRatedSales ?? 0,
})

export const aggregateInvoiceVatExemptSales = new TableAggregate<{
    Key: [Id<"users">, string];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoiceVatExemptSales, {
    sortKey: (doc) => [doc.userId, yearKey(doc._creationTime)],
    sumValue: (doc) => doc.vatExemptSales ?? 0,
})