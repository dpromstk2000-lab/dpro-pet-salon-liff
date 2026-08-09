/* DPRO OWNER AUTH GUARD
 * Version: DPRO-AUTH-5-R3-GUARD-20260809
 * Common login/session guard + Authorization header injection.
 * R3: validate session immediately and gate protected API calls until auth is ready.
 */
(() => {
  "use strict";

  const cfg = window.DPRO_AUTH_CONFIG || {};
  const PROJECT = String(cfg.project || "GENERAL").toUpperCase();
  const SYSTEM = String(cfg.system || "").toUpperCase();
  const FACILITY = String(cfg.facility || "");
  const LOGIN_URL = String(cfg.loginUrl || "https://dpromstk2000-lab.github.io/dpro-owner-auth/login.html");
  const AUTH_APIS = Object.freeze({
    GENERAL: "https://dpro-owner-auth-general.dpromstk2000.workers.dev",
    MEDICAL: "https://dpro-owner-auth-medical.dpromstk2000.workers.dev"
  });
  const AUTH_API = AUTH_APIS[PROJECT] || "";
  const PROTECTED_ORIGINS = new Set((cfg.protectedApiOrigins || []).map(value => {
    try { return new URL(value).origin; } catch { return ""; }
  }).filter(Boolean));
  const nativeFetch = window.fetch.bind(window);

  const style = document.createElement("style");
  style.id = "dpro-auth-guard-style";
  style.textContent = `
    html[data-dpro-auth="checking"] body{visibility:hidden!important}
    .dpro-auth-legacy-admin{display:none!important}
    #dproAuthSessionBar{position:fixed;right:12px;bottom:12px;z-index:2147483646;display:flex;gap:8px;align-items:center;background:rgba(17,24,39,.92);color:#fff;padding:8px 10px;border-radius:999px;box-shadow:0 8px 28px rgba(0,0,0,.18);font:700 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #dproAuthSessionBar button{border:0;border-radius:999px;background:#fff;color:#1f2937;padding:7px 10px;font-weight:800;cursor:pointer}
  `;
  document.head.appendChild(style);
  document.documentElement.dataset.dproAuth = "checking";

  let authState = "checking";
  let authSession = null;
  let resolveAuthGate;
  const authGate = new Promise(resolve => { resolveAuthGate = resolve; });

  function storageKeys() {
    const scope = `${PROJECT}:${SYSTEM}:${FACILITY}`;
    return {
      token: `dpro_owner_session:${scope}`,
      expires: `dpro_owner_session_expires_at:${scope}`,
      project: `dpro_owner_auth_project:${scope}`
    };
  }

  function getToken() {
    const k = storageKeys();
    return localStorage.getItem(k.token) || sessionStorage.getItem(k.token) || "";
  }

  function clearToken() {
    const k = storageKeys();
    for (const s of [localStorage, sessionStorage]) {
      s.removeItem(k.token); s.removeItem(k.expires); s.removeItem(k.project);
    }
  }

  function currentNext() {
    return location.pathname + location.search + location.hash;
  }

  function loginRedirect() {
    if (authState === "redirecting") return;
    authState = "redirecting";
    const p = new URLSearchParams({ project: PROJECT, system: SYSTEM, facility: FACILITY, next: currentNext() });
    location.replace(`${LOGIN_URL}?${p.toString()}`);
  }

  function requestUrl(input) {
    try {
      if (input instanceof Request) return new URL(input.url, location.href);
      return new URL(String(input), location.href);
    } catch { return null; }
  }

  function shouldAttachAuth(url) {
    return Boolean(url && PROTECTED_ORIGINS.has(url.origin) && url.pathname.startsWith("/api/admin/"));
  }

  async function sendProtected(input, init = {}) {
    const gate = await authGate;
    if (!gate.ok) throw new Error("DPRO_OWNER_SESSION_REQUIRED");

    const token = getToken();
    if (!token) {
      loginRedirect();
      throw new Error("DPRO_OWNER_SESSION_REQUIRED");
    }

    if (input instanceof Request) {
      const headers = new Headers(input.headers);
      headers.set("Authorization", `Bearer ${token}`);
      const req = new Request(input, { headers });
      return nativeFetch(req, init).then(handleProtectedResponse);
    }

    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    return nativeFetch(input, { ...init, headers }).then(handleProtectedResponse);
  }

  // Install synchronously before page scripts run. R3 intentionally queues
  // /api/admin/* calls until /auth/session has completed successfully.
  window.fetch = function dproAuthenticatedFetch(input, init = {}) {
    const url = requestUrl(input);
    if (!shouldAttachAuth(url)) return nativeFetch(input, init);
    return sendProtected(input, init);
  };

  async function handleProtectedResponse(response) {
    if (response.status === 401) {
      const copy = response.clone();
      const data = await copy.json().catch(() => ({}));
      const code = String(data.error || data.code || data.detail?.code || "");
      if (["DPRO_AUTH_REQUIRED", "DPRO_AUTH_INVALID", "SESSION_REQUIRED", "SESSION_INVALID", "SESSION_EXPIRED"].includes(code)) {
        clearToken();
        loginRedirect();
      }
    }
    return response;
  }

  async function authRequest(path, options = {}) {
    const token = getToken();
    if (!token) throw Object.assign(new Error("SESSION_REQUIRED"), { code: "SESSION_REQUIRED" });
    const res = await nativeFetch(`${AUTH_API}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok || data.ok === false) {
      const err = new Error(data.message || "AUTH_FAILED");
      err.code = data.error || "AUTH_FAILED";
      err.status = res.status;
      throw err;
    }
    return data;
  }

  async function logout() {
    try { await authRequest("/auth/logout", { method: "POST" }); } catch {}
    clearToken();
    loginRedirect();
  }

  function hideLegacyAdminControls() {
    localStorage.removeItem("petsalon_admin_code");
    const input = document.getElementById("adminCode");
    if (input) {
      input.value = "";
      const box = input.closest(".field") || input.parentElement;
      if (box) box.classList.add("dpro-auth-legacy-admin");
    }
    document.getElementById("clearAdminCodeBtn")?.classList.add("dpro-auth-legacy-admin");
  }

  function addSessionBar() {
    if (document.getElementById("dproAuthSessionBar")) return;
    const bar = document.createElement("div");
    bar.id = "dproAuthSessionBar";
    bar.innerHTML = `<span>DPRO認証中</span><button type="button">ログアウト</button>`;
    bar.querySelector("button").addEventListener("click", logout);
    document.body.appendChild(bar);
  }

  function finishUi() {
    hideLegacyAdminControls();
    addSessionBar();
    document.documentElement.dataset.dproAuth = "ready";
    if (document.body) document.body.style.visibility = "visible";
    window.dispatchEvent(new CustomEvent("dpro-auth-ready", { detail: authSession }));
  }

  function scheduleFinishUi() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", finishUi, { once: true });
    } else {
      finishUi();
    }
  }

  async function boot() {
    if (!AUTH_API || !SYSTEM || !FACILITY) {
      authState = "error";
      resolveAuthGate({ ok: false, code: "CONFIG_INCOMPLETE" });
      document.documentElement.dataset.dproAuth = "error";
      if (document.body) document.body.style.visibility = "visible";
      console.error("DPRO_AUTH_CONFIG is incomplete");
      return;
    }

    if (!getToken()) {
      resolveAuthGate({ ok: false, code: "SESSION_REQUIRED" });
      return loginRedirect();
    }

    try {
      // One retry protects the immediate post-login handoff from a transient edge/network hiccup.
      let session;
      let lastError;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          session = await authRequest("/auth/session");
          break;
        } catch (e) {
          lastError = e;
          if (attempt === 0) await new Promise(r => setTimeout(r, 250));
        }
      }
      if (!session) throw lastError || new Error("AUTH_FAILED");

      if (String(session.systemCode || "").toUpperCase() !== SYSTEM || String(session.facilityCode || "") !== FACILITY) {
        const e = new Error("SESSION_SCOPE_MISMATCH");
        e.code = "SESSION_SCOPE_MISMATCH";
        throw e;
      }

      authSession = session;
      authState = "ready";
      window.DPRO_AUTH = Object.freeze({
        version: "DPRO-AUTH-5-R3-GUARD-20260809",
        project: PROJECT, system: SYSTEM, facility: FACILITY, session,
        getToken, logout,
        authHeaders(extra = {}) { return { ...extra, Authorization: `Bearer ${getToken()}` }; }
      });
      resolveAuthGate({ ok: true, session });
      scheduleFinishUi();
    } catch (e) {
      console.error("DPRO AUTH GUARD SESSION CHECK FAILED", e?.code || e?.message || e);
      authState = "failed";
      resolveAuthGate({ ok: false, code: e?.code || "AUTH_FAILED" });
      clearToken();
      loginRedirect();
    }
  }

  // R3 starts session validation immediately while <head> is still parsing.
  // Protected API calls made by later page scripts are queued on authGate.
  boot();
})();
