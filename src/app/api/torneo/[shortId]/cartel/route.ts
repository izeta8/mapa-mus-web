import { NextRequest, NextResponse } from "next/server";
import { getTournamentFullDataByShortId } from "@/services/tournaments";

interface RouteParams {
  params: Promise<{ shortId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { shortId } = await params;

  try {
    const tournament = await getTournamentFullDataByShortId(shortId);

    if (!tournament || !tournament.poster_url) {
      // Redirect to the default logo if no poster exists
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    // Fetch the poster image from Supabase Storage
    const response = await fetch(tournament.poster_url);

    if (!response.ok) {
      // Fallback to default logo if the fetch fails
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const contentLength = response.headers.get("content-length") || blob.size.toString();

    // Serve the image directly, overriding the restrictive x-robots-tag header from Supabase Storage
    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": contentLength,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        "X-Robots-Tag": "all",
      },
    });
  } catch (error) {
    console.error("Error proxying tournament poster:", error);
    return NextResponse.redirect(new URL("/logo.png", request.url));
  }
}
