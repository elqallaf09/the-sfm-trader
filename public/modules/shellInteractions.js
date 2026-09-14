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

function openNotificationPanelFromRail(event) {
  const link = event.target.closest?.('.rail-link[data-nav-key="alerts"]');
  if (!link) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const trigger = document.querySelector("#notification-button, #mobile-notification-button");
  if (trigger instanceof HTMLElement) {
    trigger.click();
    history.replaceState(history.state, "", "#notification-panel");
  }
}

function openPanelForNotificationHash() {
  if (!String(location.hash || "").includes("notification-panel")) return;
  const panel = document.querySelector("#notification-panel");
  if (panel && !panel.hidden) return;
  const trigger = document.querySelector("#notification-button, #mobile-notification-button");
  if (trigger instanceof HTMLElement) trigger.click();
}

function installShellInteractions() {
  installShellStyles();
  document.addEventListener("click", openNotificationPanelFromRail, true);
  window.addEventListener("hashchange", openPanelForNotificationHash);
  queueMicrotask(openPanelForNotificationHash);
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installShellInteractions, { once: true });
  else installShellInteractions();
}
