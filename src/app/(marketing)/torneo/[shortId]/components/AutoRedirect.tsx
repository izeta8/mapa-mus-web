import Script from 'next/script';

interface AutoRedirectProps {
  shortId: string;
}

export function AutoRedirect({ shortId }: AutoRedirectProps) {
  return (
    <Script id="auto-redirect-intent" strategy="afterInteractive">
      {`
        (function() {
          const isAndroid = /Android/i.test(navigator.userAgent);
          const hasNoRedirect = window.location.hash.includes('no-redirect');
          if (isAndroid && !hasNoRedirect) {
            // Intent URL oficial de Android para Chrome con fallback al propio hash de la página.
            // Si la app no está instalada, añade '#no-redirect' a la URL sin recargar la página
            // y evita redirigir al usuario a la Play Store.
            const fallbackUrl = encodeURIComponent(window.location.href.split('#')[0] + '#no-redirect');
            window.location.href = "intent://tournament/${shortId}#Intent;scheme=mapamus;package=com.izeta.mapamus;S.browser_fallback_url=" + fallbackUrl + ";end;";
          }
        })();
      `}
    </Script>
  );
}
