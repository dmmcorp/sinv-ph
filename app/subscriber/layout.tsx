import { SubscriberGuard } from "@/components/guards/SubscriberGuard";
import NavBar from "@/components/subscriber/navigation/nav-bar";
import { Toaster } from "sonner";

export default function SubcriberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriberGuard>
      <main className=" px-2 sm:px-4  lg:px-8 xl:px-16 2xl:px-32 flex  min-h-dvh flex-col justify-between">
        <NavBar />
        <div className="flex-1 flex items-center justify-center ">
          {children}
        </div>
        <footer className="w-full border-t bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            {/* Left */}
            <p>© {new Date().getFullYear()} SINVPH. All rights reserved.</p>

            {/* Right */}
            <div className="flex items-center gap-4">
              <button className="hover:text-foreground transition">
                Privacy Policy
              </button>
              <button className="hover:text-foreground transition">
                Terms of Service
              </button>
              <span className="hidden sm:inline">•</span>
              <span>BIR-compliant invoices</span>
            </div>
          </div>
        </footer>
      </main>
      <Toaster />
    </SubscriberGuard>
  );
}
