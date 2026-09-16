const SHELL_STYLE_ID = "sfm-shell-interaction-integrity";

function installShellStyles() {
  if (document.getElementById(SHELL_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SHELL_STYLE_ID;
  style.textContent = `
    .rail-link:focus-visible,
    .top-actions button:focus-visible,
    .ios-tab-link:focus-visible {
      outline: 2px solid var(--ui-accent, #2fd6c0) !important;
      outline-offset: 3px !important;
    }
    @media (max-width: 760px) {
      body[data-app-view="home"] #notification-button {
        position: relative !important;
        width: 44px !important;
        min-width: 44px !important;
        padding: 0 !important;
        justify-content: center !important;
      }
      body[data-app-view="home"] #notification-button strong {
        position: absolute !important;
        inset-block-start: 3px !important;
        inset-inline-end: 3px !important;
        width: 18px !important;
        min-width: 18px !important;
        height: 18px !important;
        padding: 0 !important;
        display: grid !important;
        place-items: center !important;
        border-radius: 999px !important;
        font-size: 10px !important;
        line-height: 1 !important;
        transform: none !important;
      }
    }
    #mobile-more-button { display: none; }
    #mobile-navigation { width: min(460px, calc(100% - 24px)); max-height: calc(100dvh - 100px); overflow: auto; padding: 18px; border: 1px solid var(--ui-border); border-radius: 18px; background: var(--ui-surface, #081827); color: var(--ui-text, #fff); }
    #mobile-navigation::backdrop { background: rgba(0,0,0,.65); }
    #mobile-navigation header { display: flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    #mobile-navigation h2 { font-size:18px; margin:0; }
    #mobile-navigation nav { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
    #mobile-navigation a, #mobile-navigation button { min-height:44px; padding:10px; color:inherit; border:1px solid var(--ui-border); border-radius:10px; background:var(--ui-raised,#102638); text-decoration:none; }
    @media (max-width: 1023px) {
      body .ios-tabbar { display:grid !important; grid-template-columns:repeat(4,minmax(0,1fr)) !important; }
      body .ios-tab-link[data-tab="voice"], body .ios-tab-link[data-tab="scalp"] { display:none !important; }
      body #mobile-more-button { display:grid !important; place-items:center; min-width:44px; min-height:48px; padding:6px; border:0; background:transparent; color:var(--ui-text,#fff); font:inherit; font-size:12px; cursor:pointer; }
      body #mobile-more-button span { font-size:20px; line-height:20px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .rail-link,
      .top-actions button,
      .ios-tab-link {
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  document.head.append(style);
}

export function installShellInteractions({navigate = () => {}} = {}) {
  if (typeof document === "undefined") return;
  installShellStyles();
  const nav = document.querySelector(".ios-tabbar");
  if (!nav || document.getElementById("mobile-more-button")) return;
  const button = document.createElement("button");
  button.id = "mobile-more-button"; button.type = "button";
  button.setAttribute("aria-controls", "mobile-navigation"); button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<span aria-hidden="true">•••</span><strong>المزيد</strong>';
  const dialog = document.createElement("dialog"); dialog.id = "mobile-navigation";
  dialog.setAttribute("aria-labelledby", "mobile-navigation-title");
  const routes = [["watchlist","قائمة المراقبة","Watchlist"],["portfolio","المحفظة","Portfolio"],["history","سجل الصفقات","Trade log"],["news","الأخبار","News"],["calendar","التقويم","Calendar"],["ai","التحليل الذكي","AI analysis"],["education","التعليم","Education"],["voice","الصوت","Voice"],["scalp","المضاربة","Scalping"],["alerts","التنبيهات","Alerts"]];
  const translate = () => {
    const english = document.documentElement.lang === "en";
    button.querySelector("strong").textContent = english ? "More" : "المزيد";
    dialog.innerHTML = '<header><h2 id="mobile-navigation-title">'+(english ? 'Navigation' : 'التنقل')+'</h2><button type="button" data-mobile-close aria-label="'+(english ? 'Close' : 'إغلاق')+'">×</button></header><nav>'+routes.map(([id,ar,en])=>'<a href="#view-'+id+'" data-mobile-view="'+id+'">'+(english ? en : ar)+'</a>').join('')+'</nav>';
  };
  translate();
  button.addEventListener("click", () => { translate(); dialog.showModal(); button.setAttribute("aria-expanded","true"); });
  dialog.addEventListener("close", () => button.setAttribute("aria-expanded","false"));
  dialog.addEventListener("click", event => {
    if (event.target.closest("[data-mobile-close]")) dialog.close();
    const link = event.target.closest("[data-mobile-view]");
    if (!link) return;
    event.preventDefault(); dialog.close(); navigate(link.dataset.mobileView);
  });
  new MutationObserver(() => { if (!dialog.open) translate(); }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  nav.append(button); document.body.append(dialog);
}
