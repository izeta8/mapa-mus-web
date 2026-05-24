import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js internals, static assets, and home page pass without checking
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Handle /admin root path: redirect to /admin/panel
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/panel", request.url));
  }

  // Only run session/DB checks on admin routes (/admin/login, /admin/onboarding, /admin/panel/*)
  const isAdminRoute = pathname.startsWith("/admin/");
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection logic
  if (!user) {
    // If not logged in and trying to access panel or onboarding, redirect to login
    if (pathname.startsWith("/admin/panel") || pathname === "/admin/onboarding") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // User is logged in
  if (pathname === "/admin/login") {
    // Check if organization exists to decide where to redirect the logged-in user
    const { data: organizer } = await supabase
      .from("organizers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (organizer) {
      return NextResponse.redirect(new URL("/admin/panel", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/onboarding", request.url));
    }
  }

  // Check if organization exists for the logged in user
  const { data: organizer } = await supabase
    .from("organizers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!organizer) {
    // If no organization and not already on onboarding page, redirect to onboarding
    if (pathname.startsWith("/admin/panel") && pathname !== "/admin/onboarding") {
      return NextResponse.redirect(new URL("/admin/onboarding", request.url));
    }
  } else {
    // If organization exists and on onboarding, redirect to panel
    if (pathname === "/admin/onboarding") {
      return NextResponse.redirect(new URL("/admin/panel", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/torneos/:path*", "/tv/:path*"],
};
