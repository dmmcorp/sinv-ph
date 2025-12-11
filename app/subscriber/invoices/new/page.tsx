"use client";
import CreateNewInvoiceGuard from "@/components/guards/invoice/create-new-invoice-guard";
import { useState } from "react";
import { ClientSelector } from "../_components/client-selector";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function Page() {
  const [step, setStep] = useState<number>(0);
  return (
    <div className="">
      {step === 0 && (
        <>
          <div className="flex flex-col h-dvh max-h-[90vh] w-full ">
            <div className="flex-1 ">
              <ClientSelector onSetStep={setStep} />
            </div>
          </div>
        </>
      )}
      {step === 1 && (
        <div className="space-y-10">
          <div className="">
            <Button
              variant={"secondary"}
              onClick={() => setStep(0)}
              className=""
            >
              <ChevronLeft />
              Select a Client
            </Button>
          </div>
          <CreateNewInvoiceGuard onSetCurrentStep={setStep} />
        </div>
      )}
    </div>
  );
}

export default Page;
