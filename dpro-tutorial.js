/* DPRO TUTORIAL STANDARD V1.0 / generic in-app runtime
 * PHASE 4: PET SALON first 10 minutes.
 * Safety: no fetch, no form submit, no business-action auto click.
 */
(() => {
  "use strict";
  if (window.__DPRO_TUTORIAL_RUNTIME_INSTALLED__) return;
  window.__DPRO_TUTORIAL_RUNTIME_INSTALLED__ = true;

  const content = window.DPRO_TUTORIAL_CONTENT;
  if (!content?.tutorial?.steps?.length) return;

  const PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (PAGE !== String(content.tutorial.start_page || "owner.html").toLowerCase()) return;

  const cfg = window.DPRO_PETSALON_CONFIG || {};
  const params = new URLSearchParams(location.search);
  const facility = String(params.get("shop_code") || cfg.SHOP_CODE || "pet_salon_demo").trim();
  const guideVersion = String(content.guideVersion || content.tutorial.guide_version || "V1");
  const tutorialId = String(content.tutorial.id || "first10");
  const progressKey = `dpro_tutorial_progress:${content.productId || "SYSTEM"}:${facility}:owner`;
  const sessionPrefix = `dpro_tutorial_session:${content.productId || "SYSTEM"}:${facility}`;
  const state = { active:false, index:0, target:null, lastFocus:null, repositionRaf:0, missing:[] };

  const safeParse = value => { try { return JSON.parse(value || "null"); } catch { return null; } };
  const readProgress = () => safeParse(localStorage.getItem(progressKey)) || { state:"NOT_STARTED", guide_version:guideVersion, step_index:0 };
  const writeProgress = patch => {
    const prev = readProgress();
    const next = { ...prev, ...patch, guide_version:guideVersion, tutorial_id:tutorialId, updated_at:new Date().toISOString() };
    localStorage.setItem(progressKey, JSON.stringify(next));
    return next;
  };
  const writeSession = index => {
    sessionStorage.setItem(`${sessionPrefix}:tutorial_session_id`, tutorialId);
    sessionStorage.setItem(`${sessionPrefix}:journey_id`, "first10-owner");
    sessionStorage.setItem(`${sessionPrefix}:step_index`, String(index));
    sessionStorage.setItem(`${sessionPrefix}:guide_version`, guideVersion);
  };
  const clearSession = () => {
    for (const k of ["tutorial_session_id","journey_id","step_index","guide_version"]) sessionStorage.removeItem(`${sessionPrefix}:${k}`);
  };

  function addGuideId(el, id) {
    if (!el || !id) return false;
    el.setAttribute("data-dpro-guide-id", id);
    return true;
  }
  function bindTargets() {
    const misses=[];
    for (const b of content.bindings || []) {
      let el;
      try { el = document.querySelector(b.existing_locator); } catch { el = null; }
      if (!el) { misses.push(b.guide_id); continue; }
      if (b.phase4_action === "ADD_TO_NEAREST_CARD") el = el.closest(".card") || el;
      addGuideId(el, b.guide_id);
    }
    addGuideId(document.body, "petsalon.owner.page");
    state.missing = misses;
    return misses;
  }
  const targetByGuideId = id => {
    if (!id) return null;
    if (id.startsWith("existing-id:#")) return document.getElementById(id.slice("existing-id:#".length));
    try { return document.querySelector(`[data-dpro-guide-id="${CSS.escape(id)}"]`); } catch { return null; }
  };

  function buildUi() {
    if (document.getElementById("dproTutorialLayer")) return;
    const launcher=document.createElement("button");
    launcher.type="button";
    launcher.id="dproTutorialLauncher";
    launcher.className="dpro-tutorial-launcher";
    launcher.textContent="？ 10分ガイド";
    launcher.setAttribute("aria-label","最初の10分操作ガイドを開く");
    (document.querySelector(".hero-actions") || document.body).appendChild(launcher);

    const welcome=document.createElement("section");
    welcome.id="dproTutorialWelcome";
    welcome.className="dpro-tutorial-welcome";
    welcome.hidden=true;
    welcome.setAttribute("aria-label","最初の10分ガイド");
    document.body.appendChild(welcome);

    const layer=document.createElement("div");
    layer.id="dproTutorialLayer";
    layer.className="dpro-tutorial-layer";
    layer.hidden=true;
    layer.innerHTML=`
      <div class="dpro-tutorial-dim" aria-hidden="true"></div>
      <div class="dpro-tutorial-focus" id="dproTutorialFocus" aria-hidden="true"></div>
      <section class="dpro-tutorial-card" id="dproTutorialCard" role="dialog" aria-modal="true" aria-labelledby="dproTutorialTitle">
        <div class="dpro-tutorial-card-top">
          <div><div class="dpro-tutorial-kicker" id="dproTutorialKicker"></div><h2 id="dproTutorialTitle"></h2></div>
          <button class="dpro-tutorial-close" id="dproTutorialClose" type="button" aria-label="ガイドを閉じる">×</button>
        </div>
        <p id="dproTutorialBody"></p>
        <div class="dpro-tutorial-hint" id="dproTutorialHint" aria-live="polite"></div>
        <div class="dpro-tutorial-progress"><div class="dpro-tutorial-progress-track"><div class="dpro-tutorial-progress-bar" id="dproTutorialProgress"></div></div><div class="dpro-tutorial-progress-text" id="dproTutorialProgressText"></div></div>
        <div class="dpro-tutorial-actions" id="dproTutorialActions"></div>
      </section>
      <div class="dpro-tutorial-live" id="dproTutorialLive" aria-live="polite"></div>`;
    document.body.appendChild(layer);

    launcher.addEventListener("click", openWelcome);
    document.getElementById("dproTutorialClose").addEventListener("click", closeTour);
    window.addEventListener("resize", queuePosition, {passive:true});
    window.addEventListener("scroll", queuePosition, {passive:true});
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("click", guardClicks, true);
    document.addEventListener("submit", guardSubmit, true);
  }

  function welcomeMarkup(progress) {
    const resumable = progress.state === "IN_PROGRESS" && Number.isFinite(Number(progress.step_index)) && Number(progress.step_index) > 0;
    const completed = progress.state === "COMPLETED";
    const title = completed ? "基本操作をもう一度確認できます" : resumable ? "ガイドの続きがあります" : "最初の10分で基本操作を確認";
    const text = completed ? "予約や顧客データを変更せず、基本画面の場所だけをもう一度確認できます。" : "「今日の管理」からLINE案内まで、毎日使う場所を15枚の短い案内で確認します。予約登録やLINE送信は自動で行いません。";
    return `<h2>${title}</h2><p>${text}</p><div class="dpro-tutorial-actions">
      ${resumable?'<button type="button" class="dpro-tutorial-btn" data-dpro-welcome="resume">続きから</button>':''}
      <button type="button" class="dpro-tutorial-btn ${resumable?'secondary':''}" data-dpro-welcome="start">${completed?'もう一度見る':'最初から'}</button>
      <button type="button" class="dpro-tutorial-btn ghost" data-dpro-welcome="later">あとで見る</button>
    </div>`;
  }
  function openWelcome() {
    if (state.active) return;
    const box=document.getElementById("dproTutorialWelcome");
    const progress=readProgress();
    box.innerHTML=welcomeMarkup(progress);
    box.hidden=false;
    box.querySelector('[data-dpro-welcome="resume"]')?.addEventListener("click",()=>startTour(Number(progress.step_index)||0));
    box.querySelector('[data-dpro-welcome="start"]')?.addEventListener("click",()=>startTour(0));
    box.querySelector('[data-dpro-welcome="later"]')?.addEventListener("click",()=>{writeProgress({state:"SKIPPED",step_index:Number(progress.step_index)||0,skipped_at:new Date().toISOString()});box.hidden=true;});
    box.querySelector("button")?.focus();
  }
  function maybeShowWelcome() {
    const progress=readProgress();
    if (progress.guide_version !== guideVersion) {
      writeProgress({state:"NOT_STARTED",step_index:0,completed_at:null,skipped_at:null});
      return openWelcome();
    }
    if (progress.state === "NOT_STARTED" || progress.state === "IN_PROGRESS") openWelcome();
  }

  function startTour(index=0) {
    document.getElementById("dproTutorialWelcome").hidden=true;
    state.lastFocus=document.activeElement;
    state.active=true;
    state.index=Math.max(0,Math.min(Number(index)||0,content.tutorial.steps.length-1));
    document.getElementById("dproTutorialLayer").hidden=false;
    writeProgress({state:"IN_PROGRESS",step_index:state.index,started_at:readProgress().started_at||new Date().toISOString()});
    writeSession(state.index);
    renderStep();
  }
  function closeTour() {
    if (!state.active) return;
    cleanupTarget();
    state.active=false;
    document.getElementById("dproTutorialLayer").hidden=true;
    writeProgress({state:"IN_PROGRESS",step_index:state.index});
    writeSession(state.index);
    try { state.lastFocus?.focus?.(); } catch {}
  }
  function completeTour() {
    cleanupTarget();
    state.active=false;
    document.getElementById("dproTutorialLayer").hidden=true;
    writeProgress({state:"COMPLETED",step_index:content.tutorial.steps.length,completed_at:new Date().toISOString()});
    clearSession();
    const box=document.getElementById("dproTutorialWelcome");
    box.innerHTML='<h2>最初の10分ガイド 完了</h2><p>毎日は「今日の管理」から始めれば大丈夫です。必要な時は右上の「？ 10分ガイド」から何度でも確認できます。</p><div class="dpro-tutorial-actions"><button type="button" class="dpro-tutorial-btn" data-dpro-done>閉じる</button></div>';
    box.hidden=false;
    box.querySelector('[data-dpro-done]').addEventListener('click',()=>{box.hidden=true;document.getElementById("dproTutorialLauncher")?.focus();});
    box.querySelector('button')?.focus();
  }
  function cleanupTarget() {
    state.target?.classList?.remove("dpro-tutorial-target-active");
    state.target=null;
  }

  function chapterLabel(step) {
    const labels={"01_LOGIN":"1. ログイン","02_TODAY":"2. 今日の管理","03_MANUAL_BOOKING":"3. 電話受付","04_CUSTOMER_SEARCH":"4. 顧客検索","05_TREATMENT_FLOW":"5. 施術の流れ","06_REBOOK":"6. 次回予約","07_LINE":"7. LINE案内","COMPLETE":"完了"};
    return labels[step.chapter] || "操作ガイド";
  }
  function renderStep() {
    cleanupTarget();
    const steps=content.tutorial.steps;
    const step=steps[state.index];
    if (!step) return completeTour();
    let target=targetByGuideId(step.target);
    if (!target && step.target === "existing-id:#dproAuthSessionBar") target=document.getElementById("dproAuthSessionBar");
    state.target=target;
    if (target) {
      target.classList.add("dpro-tutorial-target-active");
      target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center',inline:'nearest'});
    } else if (!state.missing.includes(step.target)) state.missing.push(step.target);

    document.getElementById("dproTutorialKicker").textContent=`${chapterLabel(step)} ・ ${state.index+1}/${steps.length}`;
    document.getElementById("dproTutorialTitle").textContent=step.title;
    document.getElementById("dproTutorialBody").textContent=step.body;
    document.getElementById("dproTutorialProgress").style.width=`${Math.round(((state.index+1)/steps.length)*100)}%`;
    document.getElementById("dproTutorialProgressText").textContent=`${state.index+1} / ${steps.length}`;
    document.getElementById("dproTutorialLive").textContent=`${step.title}。${step.body}`;
    const hint=document.getElementById("dproTutorialHint");
    hint.className="dpro-tutorial-hint";
    hint.textContent="";
    if (!target) { hint.textContent="この案内位置を確認できなかったため、説明だけ表示しています。通常操作には影響しません。"; hint.classList.add("show"); }

    const actions=document.getElementById("dproTutorialActions");
    actions.innerHTML="";
    if (state.index>0) actions.appendChild(button("戻る","secondary",()=>goTo(state.index-1)));
    if (step.advance === "TARGET_CLICK" && target) {
      const b=button("このボタンを押してください","",()=>{hint.textContent="画面上で強調されているボタンを押してください。";hint.classList.add("show");});
      b.setAttribute("aria-describedby","dproTutorialHint");
      actions.appendChild(b);
    } else if (step.advance === "COMPLETE_BUTTON") {
      actions.appendChild(button("完了する","",completeTour));
    } else {
      actions.appendChild(button("次へ","",()=>goTo(state.index+1)));
    }
    actions.appendChild(button("閉じる","ghost",closeTour));
    queuePosition();
    setTimeout(queuePosition,220);
    document.getElementById("dproTutorialClose")?.focus();
  }
  function button(label,variant,fn){const b=document.createElement("button");b.type="button";b.className=`dpro-tutorial-btn ${variant||""}`.trim();b.textContent=label;b.addEventListener("click",fn);return b;}
  function goTo(next){state.index=Math.max(0,Math.min(next,content.tutorial.steps.length-1));writeProgress({state:"IN_PROGRESS",step_index:state.index});writeSession(state.index);renderStep();}

  function queuePosition(){if(!state.active)return;cancelAnimationFrame(state.repositionRaf);state.repositionRaf=requestAnimationFrame(positionUi);}
  function positionUi(){
    const focus=document.getElementById("dproTutorialFocus"),card=document.getElementById("dproTutorialCard");
    if (!focus||!card) return;
    const target=state.target;
    if (!target || !target.isConnected) { focus.className="dpro-tutorial-focus is-fallback";card.style.left="50%";card.style.top="50%";card.style.right="auto";card.style.bottom="auto";card.style.transform="translate(-50%,-50%)";return; }
    focus.className="dpro-tutorial-focus";
    focus.style.transform="none";
    const r=target.getBoundingClientRect(),pad=7;
    focus.style.left=`${Math.max(4,r.left-pad)}px`;focus.style.top=`${Math.max(4,r.top-pad)}px`;focus.style.width=`${Math.max(18,Math.min(innerWidth-8,r.width+pad*2))}px`;focus.style.height=`${Math.max(18,r.height+pad*2)}px`;
    if (innerWidth<=760) {card.style.left="8px";card.style.right="8px";card.style.bottom="8px";card.style.top="auto";card.style.transform="none";return;}
    const cw=380,ch=Math.min(card.offsetHeight||300,620),gap=16;
    let left=r.right+gap,top=Math.max(12,Math.min(r.top,innerHeight-ch-12));
    if (left+cw>innerWidth-12) left=Math.max(12,r.left-cw-gap);
    if (left<12) left=Math.max(12,(innerWidth-cw)/2);
    card.style.left=`${left}px`;card.style.top=`${top}px`;card.style.right="auto";card.style.bottom="auto";card.style.transform="none";
  }

  function currentStep(){return content.tutorial.steps[state.index]||null;}
  function guardClicks(event){
    if(!state.active)return;
    if(event.target.closest?.("#dproTutorialCard,#dproTutorialWelcome,#dproTutorialLauncher"))return;
    const step=currentStep(),target=state.target;
    if(step?.advance==="TARGET_CLICK" && target && target.contains(event.target)){
      setTimeout(()=>goTo(state.index+1),0);
      return;
    }
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    const hint=document.getElementById("dproTutorialHint");if(hint){hint.textContent=step?.advance==="TARGET_CLICK"?"今は強調されているタブだけを押してください。予約登録・進捗変更などの業務操作はガイド中に行いません。":"ガイド中は業務データを変更しないため、画面操作を一時的に保護しています。「次へ」で進めてください。";hint.classList.add("show");}
  }
  function guardSubmit(event){if(!state.active)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();}
  function onKeyDown(event){
    if(!state.active)return;
    if(event.key==="Escape"){event.preventDefault();closeTour();return;}
    if(event.key==="Tab") trapFocus(event);
  }
  function trapFocus(event){
    const card=document.getElementById("dproTutorialCard");if(!card)return;
    const nodes=[...card.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);
    if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }

  async function waitForAuthUi(timeout=5000){
    const start=Date.now();
    while(Date.now()-start<timeout){if(document.getElementById("dproAuthSessionBar")||window.DPRO_AUTH?.session)return true;await new Promise(r=>setTimeout(r,80));}
    return false;
  }
  async function boot(){
    bindTargets();buildUi();
    await waitForAuthUi();bindTargets();
    window.DPRO_TUTORIAL={version:"DPRO-TUTORIAL-STANDARD-V1.0",product:content.productId,guideVersion,progressKey,start:()=>startTour(0),resume:()=>startTour(Number(readProgress().step_index)||0),open:openWelcome,bindTargets};
    maybeShowWelcome();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
