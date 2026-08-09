// STEP PETSALON-BRUSHUP-7 + DPRO-AUTH-5-R5
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
    "pet-record.html"
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
