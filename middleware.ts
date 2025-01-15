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

  if(userId && isPublicRoute(req) && !isAccessingDashboard){
    return NextResponse.redirect(new URL( "/home" , req.url))
  }

//   not logged In 

if(!userId){
    if(!isPublicApiRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/signin", req.url))
    }

    if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sigin" , req.url))
    }
}

return NextResponse.next()

});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
