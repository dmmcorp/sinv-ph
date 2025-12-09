import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-amber-200">
      <Link href={"/subscriber/invoices/new"}>
        <Button>
          <Plus /> Create invoice
        </Button>
      </Link>
    </div>
  );
}

export default Dashboard;
