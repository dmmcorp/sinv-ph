"use client";
import React, { useState } from "react";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import SinvphLogo from "../sinvph-logo";
export type AuthFlow = "signIn" | "signUp";
function AuthFlow() {
  const [state, setState] = useState<AuthFlow>("signIn");
  // check if the user is authenticated
  console.log(state);
  const isSigningIn = state === "signIn";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block bg-linear-to-br from-accent/10 to-accent/10 p-10 ">
        <div className="flex flex-col justify-center items-center h-full">
          <div className="w-full flex justify-center">
            <SinvphLogo width={400} />
          </div>
          <p className="text-2xl font-semibold mt-4 text-primary">
            Invoicing Made Simple.
          </p>
        </div>
      </div>
      {isSigningIn ? (
        <SignIn setAuthFlowState={setState} />
      ) : (
        <SignUp setAuthFlowState={setState} />
      )}
    </div>
  );
}

export default AuthFlow;
