/* DPRO GUIDE CENTER ENTRY / PET SALON / PHASE 5 */
(()=>{
  "use strict";
  if(window.__DPRO_GUIDE_ENTRY_INSTALLED__) return;
  window.__DPRO_GUIDE_ENTRY_INSTALLED__=true;
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const cfg=window.DPRO_PETSALON_CONFIG||{};
  const qs=new URLSearchParams(location.search);
  const shop=String(qs.get("shop_code")||cfg.SHOP_CODE||"pet_salon_demo").trim();
  const guideUrl=()=>{const u=new URL("guide-center.html",location.href);u.searchParams.set("shop_code",shop);return u.toString();};
  function ensureStyle(){
    if(document.getElementById("dproGuideEntryStyle"))return;
    const style=document.createElement("style");
    style.id="dproGuideEntryStyle";
    style.textContent=`
      .dpro-guide-entry{border:1px solid rgba(255,255,255,.38)!important;background:rgba(255,255,255,.14)!important;color:#fff!important;min-height:36px;padding:8px 12px!important;border-radius:999px!important;box-shadow:none!important;font-weight:900!important;text-decoration:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;font-size:12px!important;white-space:nowrap}
      .dpro-guide-entry:focus-visible{outline:3px solid rgba(49,95,143,.36);outline-offset:2px}
      .dpro-guide-inline-wrap{display:flex;justify-content:flex-end;gap:8px;margin:10px 0 0;padding:0 2px}
      .dpro-guide-inline-wrap .dpro-guide-entry{background:#fff!important;color:#6b422f!important;border-color:#dccbbf!important;box-shadow:0 7px 20px rgba(70,45,30,.08)!important}
      @media(max-width:640px){.dpro-guide-inline-wrap{justify-content:stretch}.dpro-guide-inline-wrap .dpro-guide-entry{width:100%!important}}
      @media print{#dproGuideCenterEntry,.dpro-guide-inline-wrap{display:none!important}}
    `;
    document.head.appendChild(style);
  }
  function addEntry(){
    ensureStyle();
    if(document.getElementById("dproGuideCenterEntry")) return;
    const a=document.createElement("a");
    a.id="dproGuideCenterEntry";
    a.className="dpro-guide-entry";
    a.href=guideUrl();
    a.textContent="？ 操作ガイド";
    a.setAttribute("aria-label","PET SALON操作ガイドを開く");
    const host=document.querySelector(".hero-actions,.hero .actions");
    if(host){host.appendChild(a);return;}
    // Never use a floating overlay as fallback. Insert an inline row after the hero.
    const hero=document.querySelector(".hero");
    const wrap=document.createElement("div");
    wrap.className="dpro-guide-inline-wrap";
    wrap.appendChild(a);
    if(hero?.parentNode)hero.insertAdjacentElement("afterend",wrap);
    else document.body.insertAdjacentElement("afterbegin",wrap);
  }
  async function startFirst10FromQuery(){
    if(page!=="owner.html"||qs.get("guide")!=="first10")return;
    const start=Date.now();
    while(Date.now()-start<6000){
      if(window.DPRO_TUTORIAL?.start){
        window.DPRO_TUTORIAL.start();
        const u=new URL(location.href);u.searchParams.delete("guide");history.replaceState(null,"",u);
        return;
      }
      await new Promise(r=>setTimeout(r,100));
    }
  }
  function boot(){addEntry();startFirst10FromQuery();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
