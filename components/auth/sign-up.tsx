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
    <main className="signin min-h-screen flex justify-center items-center">
      <section className="container mx-auto w-[400px] space-y-8">
        <div className="space-y-2">
          <h2 className="text-center leading-none text-nowrap">
            Become a SINV Member
          </h2>
          <div className="flex items-center gap-1 w-full justify-center">
            <p>Already have an account?</p>
            <button
              onClick={() => setAuthFlowState("signIn")}
              className="text-blue-500"
            >
              Sign In
            </button>
          </div>
        </div>
        <SignUpForm />
      </section>
    </main>
  );
}

export default SignUp;
