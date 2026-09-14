import { renderAssetLogo } from "./assetBranding.js?v=20260914-audit-repair-1";

export function normalizeSearchText(value) {
  return String(value || "").normalize("NFKD").toLowerCase()
    .replace(/[\u064b-\u065f\u0670\u0640\u0300-\u036f]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[\u0660-\u0669\u06f0-\u06f9]/g, digit => String(digit.charCodeAt(0) % 16))
    .trim().replace(/\s+/g, " ");
}

export function searchInstruments(items, query) {
  const q = normalizeSearchText(query);
  if (!q) return [];
  const tokens = q.split(" ");
  return items.map(item => {
    const symbol = normalizeSearchText(item.symbol);
    const names = [item.name, item.nameAr, ...(item.aliases || [])].map(normalizeSearchText);
    const text = [symbol, ...names, normalizeSearchText(item.marketLabel), normalizeSearchText(item.marketLabelEn)].join(" ");
    const score = symbol === q ? 0 : names.includes(q) ? 1 : symbol.startsWith(q) ? 2
      : names.some(name => name.startsWith(q)) ? 3 : tokens.every(token => text.includes(token)) ? 4 : 99;
    return { item, score };
  }).filter(row => row.score < 99)
    .sort((a, b) => a.score - b.score || a.item.symbol.localeCompare(b.item.symbol))
    .slice(0, 8).map(row => row.item);
}

export function createInstrumentSearch({ form, input, fetchCatalog, openInstrument, isEnglish }) {
  if (!form || !input) return null;
  const popup = document.createElement("div");
  popup.className = "instrument-search-popup";
  popup.hidden = true;
  const list = document.createElement("div");
  list.id = "terminal-search-options";
  list.setAttribute("role", "listbox");
  const status = document.createElement("p");
  status.className = "instrument-search-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  popup.append(status, list);
  form.append(popup);
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", list.id);
  input.setAttribute("aria-expanded", "false");
  let catalog = null, pending = null, results = [], selected = -1, failed = false;
  let generation = 0;
  const text = (ar, en) => isEnglish() ? en : ar;
  const close = () => {
    generation += 1; // Cancel both pending display work and pending Enter intent.
    results = [];
    popup.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    selected = -1;
  };
  const show = () => {
    popup.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };
  const ensureCatalog = async () => {
    if (catalog) return catalog;
    if (!pending) pending = Promise.resolve().then(fetchCatalog).then(data => {
      if (!Array.isArray(data?.instruments)) throw new Error("Invalid instrument catalog");
      catalog = data.instruments.filter(item => item && typeof item.symbol === "string");
      failed = false;
      return catalog;
    }).catch(() => { failed = true; return []; }).finally(() => { pending = null; });
    return pending;
  };
  function choose(index) {
    const item = results[index];
    if (!item || popup.hidden) return;
    close();
    openInstrument(item.symbol);
  }
  function select(index) {
    selected = index;
    [...list.children].forEach((el, i) => el.setAttribute("aria-selected", String(i === selected)));
    const option = list.children[selected];
    if (option) {
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    }
  }
  function render() {
    popup.querySelector(".instrument-search-direct")?.remove();
    const query = input.value.trim();
    results = searchInstruments(catalog || [], query);
    selected = -1;
    input.removeAttribute("aria-activedescendant");
    list.replaceChildren();
    status.textContent = failed
      ? text("تعذر تحميل قائمة البحث. اضغط Enter لإعادة المحاولة.", "Search is unavailable. Press Enter to retry.")
      : results.length ? text("اختر الأصل لفتح التحليل", "Choose an instrument to open its analysis")
      : text("لم نعثر على نتيجة. جرّب اسم الشركة أو رمزها الكامل.", "No matches. Try the company name or full symbol.");
    results.forEach((item, index) => {
      const option = document.createElement("div");
      option.id = "instrument-option-" + index;
      option.className = "instrument-search-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      const mark = document.createElement("span");
      mark.className = "instrument-search-mark";
      mark.innerHTML = renderAssetLogo(item);
      const copy = document.createElement("span");
      copy.className = "instrument-search-copy";
      const name = document.createElement("strong");
      name.textContent = isEnglish() ? item.name : item.nameAr || item.name;
      const meta = document.createElement("small");
      meta.textContent = item.symbol + " · " + (isEnglish() ? item.marketLabelEn : item.marketLabel) + " · " + item.currency;
      meta.dir = "auto";
      copy.append(name, meta);
      option.append(mark, copy);
      option.addEventListener("pointerdown", event => event.preventDefault());
      option.addEventListener("click", () => { const currentIndex = results.indexOf(item); if (currentIndex >= 0) choose(currentIndex); });
      list.append(option);
    });
    if (!failed && !results.length && /^[A-Za-z^][A-Za-z0-9.^=\-]{0,17}$/.test(query)) {
      const attempt = document.createElement("button");
      attempt.type = "button";
      attempt.className = "instrument-search-direct";
      attempt.textContent = text("محاولة تحليل الرمز ", "Try analyzing symbol ") + query.toUpperCase();
      attempt.addEventListener("click", () => { close(); openInstrument(query.toUpperCase()); });
      popup.append(attempt);
    }
    show();
  }
  async function update() {
    const id = ++generation;
    const query = input.value;
    popup.querySelector(".instrument-search-direct")?.remove();
    selected = -1;
    results = [];
    input.removeAttribute("aria-activedescendant");
    if (!query.trim()) { close(); return null; }
    if (!catalog) {
      status.textContent = text("جارٍ تحميل قائمة البحث…", "Loading search catalog…");
      list.replaceChildren();
      show();
      await ensureCatalog();
    }
    if (id !== generation || input.value !== query || !form.contains(document.activeElement)) return null;
    render();
    return { id, query };
  }
  input.addEventListener("input", update);
  input.addEventListener("focus", () => { ensureCatalog(); if (input.value.trim()) update(); });
  input.addEventListener("keydown", event => {
    if (event.key === "Escape" && !popup.hidden) { event.preventDefault(); close(); }
    if (["ArrowDown", "ArrowUp"].includes(event.key) && results.length && !popup.hidden) {
      event.preventDefault();
      select((selected + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    }
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!input.value.trim()) { input.focus(); return; }
    if (selected >= 0 && !popup.hidden) { choose(selected); return; }
    const intent = await update();
    if (!intent || intent.id !== generation || intent.query !== input.value || popup.hidden) return;
    const query = normalizeSearchText(intent.query);
    const exact = results.findIndex(item => [item.symbol, item.name, item.nameAr, ...(item.aliases || [])]
      .some(value => normalizeSearchText(value) === query));
    if (exact >= 0) choose(exact);
    else if (results.length === 1) choose(0);
  });
  window.addEventListener("pagehide", close);
  document.addEventListener("pointerdown", event => { if (!form.contains(event.target)) close(); });
  form.addEventListener("focusout", event => { if (!form.contains(event.relatedTarget)) close(); });
  window.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); input.focus(); input.select();
    }
  });
  return {
    load: ensureCatalog,
    matches(item, query) {
      const metadata = catalog?.find(entry => entry.symbol === item.symbol) || item;
      return searchInstruments([metadata], query).length > 0;
    },
    refresh() {
      input.placeholder = text("ابحث باسم الشركة أو رمزها…", "Search company name or symbol…");
      input.setAttribute("aria-label", text("البحث عن أصل مالي", "Search instruments"));
      if (!popup.hidden) update();
    }
  };
}
