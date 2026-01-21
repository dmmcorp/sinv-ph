"use client";
import NewInvoiceForm from "@/components/subscriber/form/invoice/new-invoice-form";
import { Form } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useClientSelection from "@/stores/client/useClientSelection";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import ActionsCard from "./actions-card";
import { animate, motion } from "motion/react";
import { useTemplate } from "@/hooks/use-templates";

export interface SelectedItemType {
  id: number;
  description: string;
  price: number;
  quantity: number;
}

export const BusinessProfile = {
  _id: "123asd1asd",
  userId: "123asd1asd",
  businessName: "123asd1asd",
  tin: "123asd1asd",
  address: "123asd1asd",
  logoUrl: "123asd1asd",
};

const invoiceFormSchema = z.object({
  clientName: z
    .string({ error: "Client name is required" })
    .min(2, "Client name must be at least 2 characters")
    .max(50, "Client name must be at most 50 characters"),

  clientAddress: z
    .string({ error: "Client address is required" })
    .min(2, "Client address must be at least 2 characters")
    .max(50, "Client address must be at most 50 characters"),

  clientTIN: z.string().optional(),

  date: z.string({ error: "Invoice date is required" }),

  invoiceNo: z
    .string({ error: "Invoice number is required" })
    .min(1, "Invoice number cannot be empty"),

  items: z
    .array(
      z.object({
        description: z
          .string({ error: "Item description is required" })
          .min(1, "Item description cannot be empty"),
        quantity: z
          .number({ error: "Quantity is required" })
          .min(1, "Quantity must be at least 1"),
        price: z
          .number({ error: "Price is required" })
          .min(0, "Price cannot be negative"),
        total: z
          .number({ error: "Total is required" })
          .min(0, "Total cannot be negative"),
      }),
    )
    .min(1, "At least one item is required"),

  subTotal: z
    .number({ error: "Subtotal is required" })
    .min(0, "Subtotal cannot be negative"),

  discount: z
    .number({ error: "Discount is required" })
    .min(0, "Discount cannot be negative"),

  total: z
    .number({ error: "Total amount is required" })
    .min(0, "Total cannot be negative"),
});

function NewInvoice() {
  const { selectedClient } = useClientSelection();
  const { selectedItems } = useInvoiceStore();

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: selectedClient?.name ?? "",
      clientAddress: selectedClient?.address ?? "",
      clientTIN: "",
      date: new Date().toISOString().split("T")[0],
      invoiceNo: "",
      items: selectedItems,
      subTotal: 0,
      discount: 0,
      total: 0,
    },
  });

  function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 1,
              ease: "backInOut",
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10"
        >
          <motion.div className="col-span-1 lg:col-span-9">
            <NewInvoiceForm form={form} />
          </motion.div>

          <motion.div className="contents max-h-fit">
            <ActionsCard />
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}

export default NewInvoice;
