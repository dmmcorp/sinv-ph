import React from "react";
import SinvphLogo from "./sinvph-logo";
import { Loader } from "lucide-react";

function LoadingWithLogo() {
  return (
    <div className="min-h-dvh w-full flex flex-col gap-2 items-center justify-center">
      <SinvphLogo width={200} />

      <Loader className="size-10 animate-spin duration-500" />
    </div>
  );
}

export default LoadingWithLogo;
