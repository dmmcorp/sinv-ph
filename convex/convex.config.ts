// convex/convex.config.ts
import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config.js";

const app = defineApp();
app.use(aggregate, { name: "aggregateInvoices" });
app.use(aggregate, { name: "aggregateInvoiceVat" });
app.use(aggregate, { name: "aggregateInvoiceVatableSales" });
app.use(aggregate, { name: "aggregateInvoiceZeroRatedSales" });
app.use(aggregate, { name: "aggregateInvoiceVatExemptSales" });

export default app;