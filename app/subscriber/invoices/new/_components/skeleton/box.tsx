import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Box() {
  return (
    <div className="flex justify-center size-full">
      <Skeleton className="max-h-full w-full max-w-full" />
    </div>
  );
}

export default Box;
