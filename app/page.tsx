import SinvphLogo from "@/components/sinvph-logo";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Badge } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const DOCUMENTTYPE = [
 "Billing Invoices",
 "Sale Invoices",
 "Official Receipts",
] as const;
  return (
    <section className="flex min-h-screen items-center justify-center bg-background font-sans dark:bg-black">
      <div className="container grid grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2 lg:px-24 lg:py-24">

        <div className="text-center">
          <h1 className="headline font-bold text-left leading-none">Create <span className="text-primary">Invoices</span> <br />In Minutes</h1>
          <p className="subhead my-6 text-left">Easily make simple invoices for <span className="font-semibold">freelancers</span> and <span className="font-semibold">Philippine businesses</span>, with support for <span className="font-semibold">BIR-registered setups</span>.</p>
          <div className="text-left">
          <Link href="/subscriber/invoices/new">
          
            <Button variant={'default'} >Start Invoicing <ArrowRightIcon className="ml-2 h-4 w-4" /></Button>
          </Link>
          </div>
          
          <h5 className="my-4 text-left text-xs leading-loose">Choose the document that matches your situation.</h5>
          <div className="flex items-start gap-3">
            {DOCUMENTTYPE.map((type) => (
              <div key={type} className="border text-xs text-primary/70 hover:text-primary hover:cursor-default border-primary/80 rounded-full px-2 py-1">{type}</div>
            ))}
              
          </div>
        </div>
        <div className="flex items-center justify-center">
          <SinvphLogo/>
        </div>
      </div>
    </section>
  );
}
