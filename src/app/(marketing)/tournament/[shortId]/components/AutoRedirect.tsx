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
          if (isAndroid) {
            // Intent URL oficial de Android para Chrome:
            // Intenta abrir el esquema "mapamus://tournament/${shortId}".
            // Si la app (com.izeta.mapamus) no está instalada, se queda silenciosamente en la página web.
            window.location.href = "intent://tournament/${shortId}#Intent;scheme=mapamus;package=com.izeta.mapamus;end;";
          }
        })();
      `}
    </Script>
  );
}
