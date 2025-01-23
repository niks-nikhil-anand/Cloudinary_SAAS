import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/video",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const pathname = currentUrl.pathname;

  const isApiRequest = pathname.startsWith("/api");

  // If the user is logged in and accessing a public route, do NOT redirect to "/home" if already on "/home"
  if (userId && isPublicRoute(req) && pathname !== "/home") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If the user is not logged in:
  if (!userId) {
    // For non-public API routes, redirect to "/sign-in" (avoid looping)
    if (isApiRequest && !isPublicApiRoute(req) && pathname !== "/sign-in") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // For non-public web routes, redirect to "/sign-in" (avoid looping)
    if (!isApiRequest && !isPublicRoute(req) && pathname !== "/sign-in") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
