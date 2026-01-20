import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { DataModel, Id } from "./_generated/dataModel";
import { STATUSTYPE } from "../lib/constants/STATUS_TYPES"

function monthKey(issuedAt: number) {
    const d = new Date(issuedAt);
    // 2026-01
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export const aggregateInvoiceByUser = new TableAggregate<{
    Namespace: Id<"users">;
    Key: STATUSTYPE; // STATUS
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoices, {
    namespace: (doc) => doc.userId,
    sortKey: (doc) => doc.status,
})

export const aggregateRevenueByUser = new TableAggregate<{
    Key: [Id<"users">, string];
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoices, {
    sortKey: (doc) => [doc.userId, monthKey(doc._creationTime)],
    sumValue: (doc) => doc.totalAmount,
})