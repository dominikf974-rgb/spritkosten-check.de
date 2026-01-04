(() => {
  const KEY = "consent_marketing";          // "1" oder "0"
  const KEY_DATE = "consent_marketing_date"; // Timestamp (ms)
  const REASK_DAYS = 90;                    // <- HIER: 90 Tage

  function daysToMs(d) {
    return d * 24 * 60 * 60 * 1000;
  }

  function hasAdSlots() {
    return !!document.querySelector("ins.adsbygoogle");
  }

  function loadAdsOnce({ npa } = { npa: false }) {
    if (window.__adsLoaded) return;
    if (!hasAdSlots()) return; // keine Slots -> Script nicht laden
    window.__adsLoaded = true;

    // NPA-Flag immer explizit setzen
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = npa ? 1 : 0;

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8454646193293670";
    document.head.appendChild(s);

    s.onload = () => {
      try {
        document.querySelectorAll("ins.adsbygoogle").forEach(() => {
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        });
      } catch (e) {}
    };
  }

  function getStoredConsent() {
    try {
      return localStorage.getItem(KEY); // "1" | "0" | null
    } catch (e) {
      return null;
    }
  }

  function getStoredTs() {
    try {
      return Number(localStorage.getItem(KEY_DATE) || 0);
    } catch (e) {
      return 0;
    }
  }

  function storeConsent(value) {
    // value: "1" oder "0"
    try {
      localStorage.setItem(KEY, value);
      localStorage.setItem(KEY_DATE, String(Date.now()));
    } catch (e) {}
  }

  function isTooOld(ts) {
    if (!ts) return true;
    return (Date.now() - ts) > daysToMs(REASK_DAYS);
  }

  function init() {
    // OPTIONAL: Auf Datenschutz/Impressum gar nicht laufen lassen
    // (Wenn du cookies.js dort sowieso NICHT einbindest, kannst du das weglassen.)
    if (document.body && document.body.dataset.page === "legal") return;

    const banner = document.getElementById("cookieBanner");
    const btnAccept = document.getElementById("cookieAccept");
    const btnReject = document.getElementById("cookieReject");

    // Banner evtl. noch nicht im DOM -> später nochmal probieren
    if (!banner || !btnAccept || !btnReject) {
      setTimeout(init, 150);
      return;
    }

    const consent = getStoredConsent(); // "1"|"0"|null
    const ts = getStoredTs();
    const expired = isTooOld(ts);

    // Bereits entschieden UND noch gültig -> Banner weg, Ads gemäß Auswahl laden
    if ((consent === "1" || consent === "0") && !expired) {
      banner.remove();
      loadAdsOnce({ npa: consent === "0" });
      return;
    }

    // Entscheidung fehlt oder ist abgelaufen -> Banner zeigen, KEINE Ads bis Entscheidung
    banner.classList.remove("is-hidden");

    btnAccept.addEventListener("click", () => {
      storeConsent("1");
      banner.remove();
      loadAdsOnce({ npa: false });
    });

    btnReject.addEventListener("click", () => {
      storeConsent("0");
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
