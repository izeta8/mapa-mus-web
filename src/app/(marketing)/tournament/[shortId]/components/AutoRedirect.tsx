interface AutoRedirectProps {
  shortId: string;
}

export function AutoRedirect({ shortId }: AutoRedirectProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
              window.location.href = "mapamus://tournament/${shortId}";
              setTimeout(function() {
                if (document.hasFocus()) {
                  window.location.href = "https://play.google.com/store/apps/details?id=com.izeta.mapamus";
                }
              }, 2500);
            }
          })();
        `
      }}
    />
  );
}
