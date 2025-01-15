import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/videos",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const pathname = currentUrl.pathname;


  // Check if the user is accessing a protected dashboard or API route
  const isAccessingDashboard = pathname === "/home";
  const isApiRequest = pathname.startsWith("/api");


  

  // If all checks pass, allow the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except static files and Next.js internals
    "/", // Match the root route
    "/(api|trpc)(.*)", // Match API and tRPC routes
  ],
};
