"use client";
import React, { useState } from "react";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
export type AuthFlow = "signIn" | "signUp";
function AuthFlow() {
  const [state, setState] = useState<AuthFlow>("signIn");
  // check if the user is authenticated

  const isSigningIn = state === "signIn";
  return (
    <div>
      {isSigningIn ? (
        <SignIn setAuthFlowState={setState} />
      ) : (
        <SignUp setAuthFlowState={setState} />
      )}
    </div>
  );
}

export default AuthFlow;
