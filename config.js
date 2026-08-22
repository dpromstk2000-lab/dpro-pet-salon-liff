// STEP PETSALON-BRUSHUP-7 + DPRO-AUTH-5-R5 + DPRO-TUTORIAL-PHASE4-R2-NO-OVERLAP + DPRO-GUIDE-CENTER-PHASE5-V1
window.DPRO_PETSALON_CONFIG = Object.freeze({
  SHOP_CODE: "pet_salon_demo",
  LEGACY_WORKER_BASE_URL: "https://dpro-pet-salon-api.dpromstk2000.workers.dev",
  EXTENSION_WORKER_BASE_URL: "https://dpro-pet-salon-next-api.dpromstk2000.workers.dev",
  DEMO_ADMIN_CODE: "1234",
  PUBLIC_CHECKIN_PAGE: "checkin.html",
  RECEPTION_PAGE: "reception.html",
  CHECKIN_QR_IMAGE: "checkin-qr.png",
  REBOOK_PAGE: "repeat-booking.html",
  REBOOK_ADMIN_PAGE: "rebook-admin.html"
});

// DPRO-AUTH-5-R5:
// Existing admin sub-pages load config.js immediately before their page script.
// Inject the common auth guard synchronously here so their existing fetch()
// calls automatically receive the Bearer session without rewriting each page.
(() => {
  "use strict";

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const protectedPages = new Set([
    "owner.html",
    "owner-ipad.html",
    "reception.html",
    "rebook-admin.html",
    "pet-record.html",
    "guide-center.html"
  ]);
  if (!protectedPages.has(page)) return;

  const cfg = window.DPRO_PETSALON_CONFIG;
  const qs = new URLSearchParams(location.search);
  const facility = String(qs.get("shop_code") || cfg.SHOP_CODE || "pet_salon_demo").trim();

  if (!window.DPRO_AUTH_CONFIG) {
    window.DPRO_AUTH_CONFIG = {
      project: "GENERAL",
      system: "PETSALON",
      facility,
      protectedApiOrigins: [
        cfg.LEGACY_WORKER_BASE_URL,
        cfg.EXTENSION_WORKER_BASE_URL
      ]
    };
  }

  if (!document.querySelector('script[src*="dpro-auth-guard.js"]')) {
    document.write('<script src="./dpro-auth-guard.js?v=DPRO-AUTH-5-R5-20260809"><\/script>');
  }
})();

// DPRO TUTORIAL PHASE 4:
// owner.html only. The existing owner business logic remains untouched.
// Guide IDs are bound additively at runtime from stable selectors.
(() => {
  "use strict";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page !== "owner.html") return;
  if (window.__DPRO_PETSALON_TUTORIAL_ASSETS_REQUESTED__) return;
  window.__DPRO_PETSALON_TUTORIAL_ASSETS_REQUESTED__ = true;

  const version = "PETSALON-TUTORIAL-V1.0-PHASE4-R2-NO-OVERLAP-20260822";
  if (!document.querySelector('link[data-dpro-tutorial-style]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `./dpro-tutorial.css?v=${encodeURIComponent(version)}`;
    link.dataset.dproTutorialStyle = version;
    document.head.appendChild(link);
  }

  const loadScript = (src, marker) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dpro-tutorial-script="${marker}"]`);
    if (existing) return resolve();
    const script = document.createElement("script");
    script.src = `${src}?v=${encodeURIComponent(version)}`;
    script.defer = true;
    script.dataset.dproTutorialScript = marker;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`DPRO_TUTORIAL_ASSET_LOAD_FAILED:${marker}`));
    document.head.appendChild(script);
  });

  const boot = async () => {
    try {
      await loadScript("./petsalon-tutorial-content.js", "content");
      await loadScript("./dpro-tutorial.js", "runtime");
    } catch (error) {
      console.error("DPRO TUTORIAL LOAD FAILED", error);
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();

// DPRO GUIDE CENTER PHASE 5:
// Add a permanent operation-guide entry to protected PET SALON business screens.
// The Guide Center itself is owner-auth protected by the protectedPages list above.
(() => {
  "use strict";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const guideEntryPages = new Set([
    "owner.html",
    "owner-ipad.html",
    "reception.html",
    "rebook-admin.html",
    "pet-record.html"
  ]);
  if (!guideEntryPages.has(page)) return;
  if (window.__DPRO_PETSALON_GUIDE_ENTRY_REQUESTED__) return;
  window.__DPRO_PETSALON_GUIDE_ENTRY_REQUESTED__ = true;
  const script = document.createElement("script");
  script.src = "./dpro-guide-entry.js?v=PETSALON-GUIDE-CENTER-V1.0-20260822";
  script.defer = true;
  script.dataset.dproGuideEntry = "PETSALON-GUIDE-CENTER-V1.0";
  document.head.appendChild(script);
})();
