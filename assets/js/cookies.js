(function () {
  const KEY = "consent_marketing"; // ein Key, sauber
  const ACCEPT = "1";
  const REJECT = "0";

  // AdSense
  const ADS_CLIENT = "ca-pub-4852698472752437";
  const ADS_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch {}
  }

  function qs(id) {
    return document.getElementById(id);
  }

  function showBanner(banner) {
    banner.classList.remove("is-hidden");
  }

  function hideBanner(banner) {
    banner.classList.add("is-hidden");
  }

  function loadAdsOnce() {
    if (window.__adsLoaded) return;
    window.__adsLoaded = true;

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = ADS_SRC;
    document.head.appendChild(s);

    // Wenn Script geladen: alle AdSlots rendern
    s.onload = function () {
      try {
        document.querySelectorAll("ins.adsbygoogle").forEach(() => {
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
        });
      } catch {}
    };
  }

  function init() {
    const banner = qs("cookie-banner");
    const btnAccept = qs("cookie-accept");
    const btnReject = qs("cookie-reject");

    if (!banner || !btnAccept || !btnReject) return;

    const consent = getConsent();

    if (consent === ACCEPT) {
      hideBanner(banner);
      loadAdsOnce();         // Ads nur nach Zustimmung
      return;
    }

    if (consent === REJECT) {
      hideBanner(banner);
      return;
    }

    // Noch keine Entscheidung -> Banner zeigen, keine Ads
    showBanner(banner);

    btnAccept.addEventListener("click", () => {
      setConsent(ACCEPT);
      hideBanner(banner);
      loadAdsOnce();
    });

    btnReject.addEventListener("click", () => {
      setConsent(REJECT);
      hideBanner(banner);
      // keine Ads
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
