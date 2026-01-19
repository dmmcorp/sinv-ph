"use client";

import { AuthFlow } from "./auth-flow";
import SignInForm from "./form/sign-in-form";
import SignUpForm from "./form/sign-up-form";

function SignUp({
  setAuthFlowState,
}: {
  setAuthFlowState: (value: AuthFlow) => void;
}) {
  return (
    <main className="signin min-h-screen flex flex-col justify-center items-center">
      <section className="container mx-auto w-full lg:w-120 space-y-8 px-2">
        <div className="space-y-2">
          <p className="text-left text-accent leading-none text-2xl font-semibold">
            Create Account
          </p>
          <p className="text-muted-foreground text-sm">
            Enter your information to get started
          </p>
        </div>

        <div className="space-y-2"></div>
        <div className="border-accent/20 rounded-lg border p-8 shadow-sm bg-white">
          <SignUpForm />
        </div>
        <div className="flex items-center gap-1 w-full justify-center">
          <p className="text-muted-foreground text-xs">
            Already have an account?
          </p>
          <button
            onClick={() => setAuthFlowState("signIn")}
            className="text-blue-500"
          >
            Sign In
          </button>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
