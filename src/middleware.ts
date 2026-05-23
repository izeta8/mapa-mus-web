import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block and redirect B2B admin and torneos paths to the home landing page
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/torneos" ||
    pathname.startsWith("/torneos/") ||
    pathname === "/tv" ||
    pathname.startsWith("/tv/")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/torneos", "/torneos/:path*", "/tv", "/tv/:path*"],
};
