import NavBar from "@/components/subscriber/navigation/nav-bar";
import { Toaster } from "sonner";

export default function SubcriberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <div className="container mx-auto px-2">
        <NavBar />
        {children}
      </div>
      <Toaster />
    </main>
  );
}
