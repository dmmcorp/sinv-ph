"use client";
import { ClientSelector } from "../_components/client-selector";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Created from "./_components/created";
import { useInvoiceStore } from "@/stores/invoice/useInvoiceStore";
import NewInvoice from "./_components/new-invoice";

function Page() {
  const { step, setStep } = useInvoiceStore();
  return (
    <div className="pb-10 w-full">
      {step === 0 && (
        <div className="flex flex-col h-dvh max-h-[90vh] w-full  ">
          <div className="flex-1 ">
            <ClientSelector onSetStep={setStep} />
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-4  ">
          <div className="">
            <Button
              variant={"ghost"}
              onClick={() => setStep(0)}
              className="font-semibold"
            >
              <ChevronLeft className="size-8"/>
              Select a Client
            </Button>
          </div>
          <NewInvoice />
        </div>
      )}

      {step === 2 && (
        <div className="flex-1">
          <Created />
        </div>
      )}
    </div>
  );
}

export default Page;
