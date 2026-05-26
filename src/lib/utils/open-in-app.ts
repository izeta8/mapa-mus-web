const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.izeta.mapamus";

export function openInApp(shortId: string): void {
  const fallbackUrl = encodeURIComponent(PLAY_STORE_URL);

  const timer = setTimeout(() => {
    if (!document.hidden) window.location.href = PLAY_STORE_URL;
  }, 1500);

  document.addEventListener(
    "visibilitychange",
    () => { if (document.hidden) clearTimeout(timer); },
    { once: true }
  );

  window.location.href = `intent://tournament/${shortId}#Intent;scheme=mapamus;package=com.izeta.mapamus;S.browser_fallback_url=${fallbackUrl};end;`;
}
