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

    if (!tournament || !tournament.poster_url) {
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    const response = await fetch(tournament.poster_url);

    if (!response.ok) {
      return NextResponse.redirect(new URL("/logo.png", request.url));
    }

    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    const TARGET_WIDTH = 1200;
    const TARGET_HEIGHT = 630;

    const background = await sharp(originalBuffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover" })
      .blur(40)
      .toBuffer();

    const foreground = await sharp(originalBuffer)
      .resize({
        height: TARGET_HEIGHT,
        fit: "inside",
      })
      .toBuffer();

    const finalImageBuffer = await sharp(background)
      .composite([
        {
          input: foreground,
          gravity: "center",
        },
      ])
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

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
