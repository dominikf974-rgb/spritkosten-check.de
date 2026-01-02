(() => {
  const KEY = "consent_marketing";

  function loadAdsOnce({ npa } = { npa: false }) {
    if (window.__adsLoaded) return;
    window.__adsLoaded = true;

    // NPA vor Script-Load setzen
    if (npa) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4852698472752437";
    document.head.appendChild(s);

    s.onload = () => {
      try {
        document.querySelectorAll("ins.adsbygoogle").forEach(() => {
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        });
      } catch (e) {}
    };
  }

  function init() {
    const banner = document.getElementById("cookieBanner");
    const btnAccept = document.getElementById("cookieAccept");
    const btnReject = document.getElementById("cookieReject");
    
    if (!banner || !btnAccept || !btnReject) {
  // Footer/Partial evtl. noch nicht geladen -> später nochmal probieren
  setTimeout(init, 150);
  return;
}
    let consent = null;
    try { consent = localStorage.getItem(KEY); } catch (e) {}

    // bereits entschieden
    if (consent === "1") {
      banner.remove();
      loadAdsOnce({ npa: false });
      return;
    }
    if (consent === "0") {
      banner.remove();
      loadAdsOnce({ npa: true });
      return;
    }

    // keine Entscheidung -> Banner zeigen, keine Ads
    banner.classList.remove("is-hidden");

    btnAccept.addEventListener("click", () => {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      banner.remove();
      loadAdsOnce({ npa: false });
    });

    btnReject.addEventListener("click", () => {
      try { localStorage.setItem(KEY, "0"); } catch (e) {}
      banner.remove();
      loadAdsOnce({ npa: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
