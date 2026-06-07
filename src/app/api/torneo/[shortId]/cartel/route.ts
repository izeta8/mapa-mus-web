import { NextRequest, NextResponse } from "next/server";
import { getTournamentFullDataByShortId } from "@/services/tournaments";
import sharp from "sharp";

interface RouteParams {
  params: Promise<{ shortId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { shortId } = await params;

  try {
    const tournament = await getTournamentFullDataByShortId(shortId);

    if (!tournament || (tournament.status !== "planned" && tournament.status !== "ongoing")) {
      return new Response("Not Found", { status: 404 });
    }

    if (!tournament.poster_url) {
      // Redirect to the default logo if no poster exists
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    // Fetch the poster image from Supabase Storage
    const response = await fetch(tournament.poster_url);

    if (!response.ok) {
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Target dimensions for WhatsApp large preview (1200x630, aspect ratio 1.91:1)
    const TARGET_WIDTH = 1200;
    const TARGET_HEIGHT = 630;

    // Create the blurred background covering the entire 1200x630 canvas
    const background = await sharp(originalBuffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover" })
      .blur(40) // Strong gaussian blur for the background
      .toBuffer();

    // Resize the original portrait poster to fit inside the height of 630px
    const foreground = await sharp(originalBuffer)
      .resize({
        height: TARGET_HEIGHT,
        fit: "inside",
      })
      .toBuffer();

    // Composite the centered poster on top of the blurred background
    const finalImageBuffer = await sharp(background)
      .composite([
        {
          input: foreground,
          gravity: "center",
        },
      ])
      .jpeg({ quality: 80, mozjpeg: true }) // Optimize size to guarantee it's under 300KB
      .toBuffer();

    // Serve the processed image directly with correct headers
    return new Response(new Uint8Array(finalImageBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": finalImageBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        "X-Robots-Tag": "all",
      },
    });
  } catch (error) {
    console.error("Error generating horizontal tournament poster proxy:", error);
    return NextResponse.redirect(new URL("/logo.png", request.url));
  }
}
