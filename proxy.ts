import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const isSignInPage = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher(["/subscriber(.*)"]);
const isInLandingPage = createRouteMatcher(["/"]);
const isOnboardingPage = createRouteMatcher(["/onboarding"])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    // if nasa signin page and authenticated = redirect to /subscriber
    if (isSignInPage(request) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/subscriber");
    }

    // if nasa landing page and authenticated = redirect to /subscriber (for simplicity ginawa ko munang ganito)
    if (isInLandingPage(request) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/subscriber");
    }

    // if nasa protected route and hindi authenticated = redirect to /auth
    if (isProtectedRoute(request) && !isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};