import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables in middleware configuration.");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Respuesta base para almacenar cookies inyectadas por Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Helper para redirigir preservando las cookies de sesión (refrescadas por Supabase)
  const redirect = (targetPath: string) => {
    const redirectResponse = NextResponse.redirect(new URL(targetPath, request.url));
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
      });
    });
    return redirectResponse;
  };

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
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

  // Caso 1: Usuario NO autenticado
  if (!user) {
    if (pathname.startsWith("/admin/panel") || pathname === "/admin/onboarding" || pathname === "/admin") {
      return redirect("/admin/login");
    }
    return response;
  }

  // Caso 2: Usuario SÍ autenticado
  const { data: organizer } = await supabase
    .from("organizers")
    .select("id")
    .eq("id", user.id)
    .single();

  // Redirección raíz /admin o login
  if (pathname === "/admin" || pathname === "/admin/login") {
    return redirect(organizer ? "/admin/panel" : "/admin/onboarding");
  }

  // Comprobación de panel sin perfil
  if (pathname.startsWith("/admin/panel") && !organizer) {
    return redirect("/admin/onboarding");
  }

  // Comprobación de onboarding con perfil
  if (pathname === "/admin/onboarding" && organizer) {
    return redirect("/admin/panel");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/torneos/:path*", "/tv/:path*"],
};