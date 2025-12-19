"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
function AddNewInvoiceBtn() {
  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      whileHover={{
        opacity: 1,
        scale: 1.03,
        translateX: -10,
      }}
      whileTap={{ opacity: 1, scale: 0.9 }}
    >
      <Link href={"/subscriber/invoices/new"}>
        <Button className="h-13 text-sm lg:text-2xl font-semibold">
          <Plus className="size-8 lg:text-8" /> Create new invoice
        </Button>
      </Link>
    </motion.div>
  );
}

export default AddNewInvoiceBtn;
