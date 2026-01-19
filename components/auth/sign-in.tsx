"use client";

import SinvphLogo from "../sinvph-logo";
import { AuthFlow } from "./auth-flow";
import SignInForm from "./form/sign-in-form";

function SignIn({
  setAuthFlowState,
}: {
  setAuthFlowState: (value: AuthFlow) => void;
}) {
  return (
    <main className="signin min-h-screen flex justify-center items-center">
      <section className="container mx-auto w-100 space-y-8 px-2">
        <div className="space-y-2">
          <p className="text-left text-accent leading-none text-2xl font-semibold">
            Sign in to SINVPH
          </p>
          <p className="text-muted-foreground text-sm">
            Create and send invoices, then track everything in one dashboard.
          </p>
        </div>
        <div className="border-accent/20 rounded-lg border p-8 shadow-lg bg-white">
          <SignInForm />
        </div>
        <div className="flex items-center gap-1 w-full justify-center">
          <p className="text-muted-foreground">
            Don&apos;t have an account yet?
          </p>
          <button
            onClick={() => setAuthFlowState("signUp")}
            className="text-primary"
          >
            Sign up now
          </button>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
