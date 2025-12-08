"use client";

import SignInForm from "./form/sign-in-form";

function SignIn() {
  return (
    <main className="signin min-h-screen flex justify-center items-center">
      <section className="container mx-auto w-[400px] space-y-8">
        <h1 className="text-center">LOGO</h1>
        <div className="space-y-2">
          <h1 className="text-center leading-none">Welcome Back!</h1>
          <div className="flex items-center gap-1 w-full justify-center">
            <p>Don&apos;t have an account yet?</p>
            <button className="text-blue-500">Sign up now</button>
          </div>
        </div>
        <SignInForm />
      </section>
    </main>
  );
}

export default SignIn;
