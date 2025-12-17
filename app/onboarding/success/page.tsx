"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function OnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <motion.div
        initial={{
          y: 20,
          scale: 0.8,
        }}
        animate={{
          y: 0,
          scale: 1,
          transition: { duration: 1, ease: "backInOut" },
        }}
        className="max-w-1/2 w-1/2"
      >
        <div className=" text-center space-y-6">
          <div className="text-5xl">🎉</div>

          <h1 className=" font-semibold">You’re all set!</h1>

          <p className="text-muted-foreground text-sm lg:text-2xl">
            Let&apos;s take the next step — what would you like to do first?
          </p>

          <div className="space-y-3 w-full flex flex-col">
            <Link href={"/subscriber/invoices/new"}>
              <Button
                variant={"default"}
                className="w-full lg:w-1/2 h-11 text-sm lg:text-2xl "
              >
                Create your first invoice
              </Button>
            </Link>
            <Link href={"/subscriber"}>
              <Button
                variant={"ghost"}
                className="w-full lg:w-1/2 h-11 text-sm lg:text-2xl underline"
              >
                Go to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
