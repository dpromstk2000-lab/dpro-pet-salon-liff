/* DPRO GUIDE CENTER / PET SALON / PHASE 5 */
(()=>{
  "use strict";
  if(window.__DPRO_GUIDE_CENTER_INSTALLED__) return;
  window.__DPRO_GUIDE_CENTER_INSTALLED__=true;
  const content=window.DPRO_GUIDE_CENTER_CONTENT;
  if(!content?.articles?.length) return;
  const $=id=>document.getElementById(id);
  const params=new URLSearchParams(location.search);
  const config=window.DPRO_PETSALON_CONFIG||{};
  const shop=String(params.get("shop_code")||config.SHOP_CODE||"pet_salon_demo").trim();
  const state={category:params.get("section")||"all",query:"",article:null,lastFocus:null};
  const sections=new Map(content.sections.map(x=>[x.id,x]));
  const articlesById=new Map(content.articles.map(x=>[x.id,x]));
  const faqById=new Map(content.faq.map(x=>[x.id,x]));
  const norm=v=>String(v??"").toLowerCase().normalize("NFKC").replace(/[\s　\-－ー―_/・]+/g,"");
  const includesQuery=(parts,q)=>!q||norm(parts.filter(Boolean).join(" ")).includes(norm(q));
  const el=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;};
  const setShop=(path,extra={})=>{const u=new URL(path,location.href);u.searchParams.set("shop_code",shop);Object.entries(extra).forEach(([k,v])=>{if(v!==null&&v!==undefined&&v!=="")u.searchParams.set(k,String(v));});return u.toString();};

  function launchFor(a){
    const owner=(tab,extra={})=>({label:"この機能を開く",url:setShop("owner.html",{open_tab:tab,...extra})});
    const custom={
      "P0-01":owner("dashboard"),"P0-02":{label:"10分ガイドを開く",url:setShop("owner.html",{guide:"first10"})},"P0-03":owner("dashboard"),
      "P0-04":owner("dashboard"),"P0-05":owner("dashboard"),"P0-06":owner("manual"),"P0-07":owner("customerSearch"),"P1-01":owner("day"),
      "P0-08":owner("dashboard"),"P0-09":{label:"今日の管理からカルテを開く",url:setShop("owner.html",{open_tab:"dashboard"})},"P0-10":owner("followups"),
      "P0-11":{label:"次回予約希望管理を開く",url:setShop("rebook-admin.html")},
      "P1-02":{label:"今日の管理からカルテを開く",url:setShop("owner.html",{open_tab:"dashboard"})},"P1-03":{label:"今日の管理からカルテを開く",url:setShop("owner.html",{open_tab:"dashboard"})},"P1-04":{label:"今日の管理からカルテを開く",url:setShop("owner.html",{open_tab:"dashboard"})},"P1-05":{label:"今日の管理からカルテを開く",url:setShop("owner.html",{open_tab:"dashboard"})},
      "P1-06":{label:"受付専用画面を開く",url:setShop("reception.html")},"P1-07":{label:"受付専用画面を開く",url:setShop("reception.html")},"P1-08":{label:"受付履歴を開く",url:setShop("reception.html")},
      "P1-09":owner("hotel"),"P1-10":{label:"現場用iPadを開く",url:setShop("owner-ipad.html")},"P2-05":{label:"ホテル営業設定を開く",url:setShop("hotel-settings.html")},"P2-06":{label:"ホテル営業設定を開く",url:setShop("hotel-settings.html")},
      "P2-01":owner("settings"),"P2-02":owner("settings"),"P2-03":owner("settings"),"P2-04":owner("settings"),
      "P1-11":{label:"お客様LINEメニューを開く",url:setShop("menu.html")},"P1-14":{label:"お客様予約画面を開く",url:setShop("index.html")},"P1-15":{label:"お客様会員証を開く",url:setShop("member.html")},"P1-12":{label:"変更・キャンセル画面を開く",url:setShop("manage.html")},"P1-16":{label:"ホテル申込画面を開く",url:setShop("hotel.html")},"P1-17":{label:"QR来店受付を開く",url:setShop("checkin.html")},"P1-13":{label:"次回予約希望画面を開く",url:setShop("repeat-booking.html")},
      "P2-07":owner("dashboard")
    };
    return custom[a.id]||{label:"対象画面を開く",url:setShop(a.page||"owner.html")};
  }
  const priorityLabel=p=>({P0:"基本",P1:"機能別",P2:"設定・困ったとき"}[p]||p);
  const sectionTitle=id=>sections.get(id)?.title||"操作ガイド";
  const quickIcon=id=>({"P0-02":"⏱","P0-04":"☀","P0-06":"☎","P0-07":"🔎","P0-08":"✂","P2-07":"？"}[id]||"📖");

  function updateBaseLinks(){
    for(const id of ["guideBackOwner","guideFooterOwner"]){const a=$(id);if(a)a.href=setShop("owner.html");}
    const first=$("guideStartFirst10");if(first)first.href=setShop("owner.html",{guide:"first10"});
    $("guideVersionLabel").textContent=`${content.guideVersion} / 更新 ${content.updatedAt}`;
    $("guideArticleCount").textContent=String(content.articles.length);$("guideFaqCount").textContent=String(content.faq.length);
  }
  function renderCategories(){
    const nav=$("guideCategories");nav.replaceChildren();
    const all=categoryButton("all","すべて",content.articles.length);nav.append(all);
    [...content.sections].sort((a,b)=>a.order-b.order).forEach(s=>nav.append(categoryButton(s.id,s.title,s.article_ids.length)));
  }
  function categoryButton(id,title,count){
    const b=el("button","guide-category");b.type="button";b.dataset.category=id;b.setAttribute("aria-pressed",String(state.category===id));if(state.category===id)b.classList.add("active");
    b.append(document.createTextNode(title));const small=el("small","",String(count));b.append(small);b.addEventListener("click",()=>{state.category=id;syncUrl();render();});return b;
  }
  function filteredArticles(){
    return content.articles.filter(a=>(state.category==="all"||a.section===state.category)&&includesQuery([a.title,...(a.keywords||[]),a.what_you_can_do,a.when_to_use,...(a.steps||[]),...(a.cautions||[])],state.query));
  }
  function filteredFaq(){
    if(state.category!=="all"&&state.category!=="trouble") return [];
    return content.faq.filter(f=>includesQuery([f.question,f.category,f.first_check,...(f.steps||[]),f.unresolved],state.query));
  }
  function renderQuick(){
    const grid=$("guideQuickGrid");grid.replaceChildren();
    if(state.query||state.category!=="all"){$("guideQuickSection").hidden=true;return;}$("guideQuickSection").hidden=false;
    content.quickArticleIds.map(id=>articlesById.get(id)).filter(Boolean).forEach(a=>{
      const b=el("button","guide-quick-card");b.type="button";b.append(el("span","guide-quick-icon",quickIcon(a.id)));
      const copy=el("div");copy.append(el("div","guide-card-title",a.title),el("div","guide-card-desc",a.what_you_can_do),el("div","guide-card-more","詳しく見る →"));b.append(copy);b.addEventListener("click",()=>openArticle(a.id));grid.append(b);
    });
  }
  function renderArticles(){
    const rows=filteredArticles(),grid=$("guideArticleGrid");grid.replaceChildren();
    rows.forEach(a=>{const b=el("button","guide-article-card");b.type="button";b.dataset.articleId=a.id;const main=el("div");const meta=el("div","guide-article-meta");meta.append(el("span","guide-chip",sectionTitle(a.section)),el("span","guide-chip priority",priorityLabel(a.priority)));main.append(meta,el("div","guide-card-title",a.title),el("div","guide-card-desc",a.what_you_can_do));b.append(main,el("span","guide-open-mark","›"));b.addEventListener("click",()=>openArticle(a.id));grid.append(b);});
    $("guideArticleEmpty").hidden=rows.length>0;$("guideArticleSummary").textContent=`${rows.length}件の操作ガイドを表示しています。`;
    return rows.length;
  }
  function renderFaq(){
    const rows=filteredFaq(),list=$("guideFaqList");list.replaceChildren();
    rows.forEach(f=>{const d=el("details","guide-faq");d.id=`faq-${f.id}`;const s=el("summary");const left=el("span");left.append(el("span","guide-faq-tag",f.category),document.createTextNode(`  ${f.question}`));s.append(left);const body=el("div","guide-faq-body");
      body.append(el("h4","","最初に確認"),el("p","",f.first_check),el("h4","","確認手順"));const ol=el("ol");(f.steps||[]).forEach(x=>ol.append(el("li","",x)));body.append(ol,el("h4","","解決しない場合"),el("p","",f.unresolved));d.append(s,body);list.append(d);});
    $("guideFaqEmpty").hidden=rows.length>0;$("guideFaqSection").hidden=(state.category!=="all"&&state.category!=="trouble"&&!state.query);
    return rows.length;
  }
  function render(){
    renderCategories();renderQuick();const ac=renderArticles(),fc=renderFaq();
    const label=state.query?`「${state.query}」の検索結果：操作ガイド ${ac}件 / FAQ ${fc}件`:`${state.category==="all"?"すべて":sectionTitle(state.category)}：操作ガイド ${ac}件${(state.category==="all"||state.category==="trouble")?` / FAQ ${fc}件`:""}`;
    $("guideResultSummary").textContent=label;
  }
  function articleBlock(title,contentNode){const w=el("section","guide-article-block");w.append(el("h3","",title),contentNode);return w;}
  function openArticle(id,focus=true){
    const a=articlesById.get(id);if(!a)return;state.article=id;state.lastFocus=document.activeElement;syncUrl();
    $("guideDialogKicker").textContent=`${sectionTitle(a.section)} / ${priorityLabel(a.priority)}`;$("guideDialogTitle").textContent=a.title;const body=$("guideDialogBody");body.replaceChildren();
    body.append(articleBlock("何ができるか",el("p","",a.what_you_can_do)),articleBlock("いつ使うか",el("p","",a.when_to_use)));
    const ol=el("ol");(a.steps||[]).forEach(x=>ol.append(el("li","",x)));body.append(articleBlock("操作手順",ol),articleBlock("完了したら",el("p","",a.completion)));
    if(a.cautions?.length){const c=el("div","guide-caution");a.cautions.forEach((x,i)=>{if(i)c.append(el("br"));c.append(document.createTextNode(`・${x}`));});body.append(articleBlock("注意",c));}
    if(a.related?.length){const rel=el("div","guide-related");a.related.forEach(r=>{const target=articlesById.get(r)||faqById.get(r);if(!target)return;const b=el("button","",target.title||target.question);b.type="button";b.addEventListener("click",()=>{if(articlesById.has(r))openArticle(r,false);else{closeArticle(false);openFaq(r);}});rel.append(b);});body.append(articleBlock("関連",rel));}
    const actions=$("guideDialogActions");actions.replaceChildren();const launch=launchFor(a);const go=el("a","guide-btn brand",launch.label);go.href=launch.url;actions.append(go);const copy=el("button","guide-btn soft","この記事のリンクをコピー");copy.type="button";copy.addEventListener("click",()=>copyArticleLink(a.id));actions.append(copy);const close=el("button","guide-btn soft","閉じる");close.type="button";close.addEventListener("click",()=>closeArticle());actions.append(close);
    const dialog=$("guideArticleDialog");if(!dialog.open)dialog.showModal();if(focus)setTimeout(()=>$("guideDialogClose").focus(),0);
  }
  function closeArticle(restore=true){const d=$("guideArticleDialog");if(d.open)d.close();state.article=null;syncUrl();if(restore)try{state.lastFocus?.focus?.();}catch{};}
  function openFaq(id){state.category="trouble";state.query="";$("guideSearch").value="";render();const d=$(`faq-${id}`);if(d){d.open=true;d.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});}}
  async function copyArticleLink(id){const u=new URL(location.href);u.searchParams.set("shop_code",shop);u.searchParams.set("article",id);u.searchParams.delete("section");try{await navigator.clipboard.writeText(u.toString());toast("記事リンクをコピーしました");}catch{toast("ブラウザのアドレス欄からURLをコピーしてください");}}
  let toastTimer;function toast(msg){const t=$("guideToast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
  function syncUrl(){const u=new URL(location.href);u.searchParams.set("shop_code",shop);if(state.category!=="all")u.searchParams.set("section",state.category);else u.searchParams.delete("section");if(state.article)u.searchParams.set("article",state.article);else u.searchParams.delete("article");history.replaceState(null,"",u);}
  function buildPrint(){const root=$("guidePrintManual");root.replaceChildren();const cover=el("section","guide-print-cover");cover.append(el("div","guide-eyebrow","DPRO PET SALON / OPERATION MANUAL"),el("h1","","DPRO PET SALON 操作マニュアル"),el("p","","オンライン操作ガイドと同じ内容から生成した印刷用マニュアルです。"));const meta=el("div","guide-print-meta");meta.append(el("p","",`版：${content.guideVersion}`),el("p","",`更新：${content.updatedAt}`),el("p","guide-print-url",`オンライン操作ガイド：https://dpromstk2000-lab.github.io/dpro-pet-salon-liff/guide-center.html?shop_code=${shop}`));cover.append(meta);root.append(cover);
    [...content.sections].sort((a,b)=>a.order-b.order).forEach(s=>{const sec=el("section","guide-print-section");sec.append(el("h2","",s.title));s.article_ids.map(id=>articlesById.get(id)).filter(Boolean).forEach(a=>{const art=el("article","guide-print-article");art.append(el("h3","",a.title),el("h4","","何ができるか"),el("p","",a.what_you_can_do),el("h4","","いつ使うか"),el("p","",a.when_to_use),el("h4","","操作手順"));const ol=el("ol");a.steps.forEach(x=>ol.append(el("li","",x)));art.append(ol,el("h4","","完了したら"),el("p","",a.completion));if(a.cautions?.length){art.append(el("h4","","注意"));const c=el("div","guide-print-caution",a.cautions.map(x=>`・${x}`).join("\n"));art.append(c);}sec.append(art);});root.append(sec);});
    const faqSec=el("section","guide-print-section");faqSec.append(el("h2","","困ったとき / FAQ"));content.faq.forEach(f=>{const d=el("article","guide-print-faq");d.append(el("h3","",f.question),el("p","",f.first_check));const ol=el("ol");f.steps.forEach(x=>ol.append(el("li","",x)));d.append(ol,el("p","",`解決しない場合：${f.unresolved}`));faqSec.append(d);});root.append(faqSec);
  }
  function printGuide(){buildPrint();window.print();}
  function bind(){
    updateBaseLinks();renderCategories();renderQuick();render();buildPrint();
    $("guideSearch").addEventListener("input",e=>{state.query=e.target.value.trim();render();});$("guideSearchClear").addEventListener("click",()=>{state.query="";$("guideSearch").value="";$("guideSearch").focus();render();});
    $("guidePrintBtn").addEventListener("click",printGuide);$("guideDialogClose").addEventListener("click",()=>closeArticle());$("guideArticleDialog").addEventListener("cancel",e=>{e.preventDefault();closeArticle();});$("guideArticleDialog").addEventListener("click",e=>{if(e.target===$("guideArticleDialog"))closeArticle();});
    const initial=params.get("article");if(initial&&articlesById.has(initial))setTimeout(()=>openArticle(initial),0);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
