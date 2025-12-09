import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

const CustomPassword = Password({
  profile(params) {
    return {
      email: params.email as string,
      role: params.role as "admin" | "subscriber",
      updatedAt: params.updatedAt as number,
      onboarding: params.onboarding as boolean,
    }
  }
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
});
