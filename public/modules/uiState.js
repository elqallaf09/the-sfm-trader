const VALID_KINDS = new Set(["loading", "empty", "error", "stale", "offline", "unauthorized"]);

export function renderUiState({ kind = "empty", title = "", message = "", actionLabel = "", actionId = "", compact = false } = {}) {
  const safeKind = VALID_KINDS.has(kind) ? kind : "empty";
  const role = safeKind === "error" || safeKind === "offline" || safeKind === "unauthorized" ? "alert" : "status";
  const busy = safeKind === "loading" ? "true" : "false";
  const icon = { loading: "↻", empty: "—", error: "!", stale: "◷", offline: "⌁", unauthorized: "⊘" }[safeKind];
  const action = actionLabel && actionId
    ? `<button type="button" class="ui-state-action" data-ui-state-action="${escapeHtml(actionId)}">${escapeHtml(actionLabel)}</button>`
    : "";

  return `<section class="ui-state ui-state-${safeKind}${compact ? " ui-state-compact" : ""}" data-ui-state="${safeKind}" role="${role}" aria-live="polite" aria-busy="${busy}">
    <span class="ui-state-icon" aria-hidden="true">${icon}</span>
    <div class="ui-state-copy">
      ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
      ${message ? `<p>${escapeHtml(message)}</p>` : ""}
    </div>
    ${action}
  </section>`;
}

export function setUiState(element, state) {
  if (!element) return;
  element.innerHTML = renderUiState(state);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
