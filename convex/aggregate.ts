import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { DataModel, Id } from "./_generated/dataModel";
import { STATUSTYPE } from "../lib/constants/STATUS_TYPES"

export const aggregateInvoiceByUser = new TableAggregate<{
    Namespace: Id<"users">;
    Key: STATUSTYPE; // STATUS
    DataModel: DataModel;
    TableName: "invoices";
}>(components.aggregateInvoices, {
    namespace: (doc) => doc.userId,
    sortKey: (doc) => doc.status,
})