const PUBLIC_SITE_URL = "https://www.mapamus.site";

/**
 * Canonical public URL for a tournament. Single source of truth shared by the share
 * flow, the TV QR code and any deep link, so the address never drifts between them.
 */
export function getTournamentPublicUrl(shortId: string): string {
  return `${PUBLIC_SITE_URL}/torneo/${shortId}`;
}
