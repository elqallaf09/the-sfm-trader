const RETURN_KEY = "the-sfm-trader-detail-return";
const MAX_AGE = 30 * 60 * 1000;

export function safeHomeUrl(value, origin = window.location.origin) {
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || !["/", "/index.html"].includes(url.pathname)) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}

export function saveDetailReturnContext(values) {
  const url = window.location.pathname + window.location.search + window.location.hash;
  const context = { ...values, url, scrollY: window.scrollY, savedAt: Date.now() };
  history.replaceState({ ...history.state, sfmReturn: context }, "", url);
  try { sessionStorage.setItem(RETURN_KEY, JSON.stringify(context)); } catch {}
  return url;
}

export function readDetailReturnContext() {
  try {
    const context = history.state?.sfmReturn || JSON.parse(sessionStorage.getItem(RETURN_KEY) || "null");
    const here = window.location.pathname + window.location.search + window.location.hash;
    if (!context || safeHomeUrl(context.url) !== here || Date.now() - context.savedAt > MAX_AGE) return null;
    sessionStorage.removeItem(RETURN_KEY);
    return context;
  } catch { return null; }
}

export function detailPageUrl(symbol, returnTo) {
  const query = new URLSearchParams({ symbol });
  const home = safeHomeUrl(returnTo);
  if (home) query.set("returnTo", home);
  return "/detail.html?" + query;
}

export function navigateBackFromDetail() {
  const target = safeHomeUrl(new URLSearchParams(location.search).get("returnTo")) || "/#view-home";
  try {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer?.origin === location.origin && safeHomeUrl(referrer.href) && history.length > 1) {
      history.back();
      return;
    }
  } catch {}
  location.assign(target);
}
