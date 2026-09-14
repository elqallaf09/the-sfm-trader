import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
function declaration(name) {
  const start = source.search(new RegExp('^function ' + name + '\\(', 'm'));
  assert.ok(start >= 0, name);
  const rest = source.slice(start);
  const next = rest.slice(1).search(/\n(?:async )?function \w+\(/);
  return next < 0 ? rest : rest.slice(0, next + 1);
}
function harness(t) {
  const dom = new JSDOM(`<button id="origin">Open</button>
    <button id="notification-button">Notifications</button><button id="settings-button">Settings</button>
    <aside id="notification-panel" hidden><button id="notification-close-button">Close</button><button id="notification-clear-button">Clear</button></aside>
    <aside id="settings-panel" hidden><input id="settings-display-name"><button id="settings-close-button">Close</button></aside>`, { url: 'https://test.invalid/#view-markets' });
  t.after(() => dom.window.close());
  const { document, HTMLElement, history, location } = dom.window;
  const queued = [];
  const context = vm.createContext({ document, HTMLElement, history, location,
    window: { setTimeout: callback => queued.push(callback) },
    syncSettingsForm() {}, clearNotificationLog() {}, getComputedStyle: dom.window.getComputedStyle,
    settingsButton: document.querySelector('#settings-button'), settingsPanel: document.querySelector('#settings-panel'),
    settingsDisplayName: document.querySelector('#settings-display-name'), settingsCloseButton: document.querySelector('#settings-close-button'),
    notificationButton: document.querySelector('#notification-button'), notificationPanel: document.querySelector('#notification-panel'),
    notificationCloseButton: document.querySelector('#notification-close-button'), notificationClearButton: document.querySelector('#notification-clear-button'),
    railSettingsButton: null, mobileSettingsButton: null, mobileNotificationButton: null,
    notificationPanelOpen: false, settingsReturnFocus: null, notificationReturnFocus: null, activeAppView: 'markets'
  });
  vm.runInContext(['setSettingsPanelOpen', 'setNotificationPanelOpen', 'handleModalKeydown', 'initModalPanelControls', 'toggleNotificationPanel'].map(declaration).join('\n'), context);
  for (const [panel, close] of [['notification-panel', () => context.setNotificationPanelOpen(false)], ['settings-panel', () => context.setSettingsPanelOpen(false)]]) {
    document.getElementById(panel).addEventListener('keydown', event => context.handleModalKeydown(event, document.getElementById(panel), close));
  }
  context.initModalPanelControls();
  const origin = document.querySelector('#origin'); origin.focus();
  return { context, document, origin, queued,
    escape: () => document.activeElement.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })) };
}
for (const [kind, openName, focusId] of [['notification', 'setNotificationPanelOpen', 'notification-close-button'], ['settings', 'setSettingsPanelOpen', 'settings-display-name']]) {
  test(`${kind}: focus is ready synchronously and immediate Escape closes before timers run`, t => {
    const h = harness(t); h.context[openName](true);
    assert.equal(h.document.activeElement.id, focusId);
    h.escape(); assert.equal(h.document.getElementById(kind + '-panel').hidden, true);
    assert.equal(h.document.activeElement, h.origin);
    assert.equal(h.queued.length, 0, 'Opening must not schedule stale focus callbacks');
  });
  test(`${kind}: duplicate opening does not replace the original return-focus target`, t => {
    const h = harness(t); h.context[openName](true); h.queued.splice(0).forEach(fn => fn());
    h.context[openName](true); h.queued.splice(0).forEach(fn => fn()); h.context[openName](false);
    assert.equal(h.document.activeElement, h.origin);
  });
}
test('switching panels has no delayed focus theft from the now-hidden panel', t => {
  const h = harness(t); h.context.setSettingsPanelOpen(true); h.context.setNotificationPanelOpen(true);
  const clear = h.document.getElementById('notification-clear-button'); clear.focus();
  h.queued.splice(0).forEach(fn => fn());
  assert.equal(h.document.activeElement, clear);
  h.escape(); assert.equal(h.document.getElementById('notification-panel').hidden, true);
  assert.equal(h.document.getElementById('settings-panel').hidden, true);
  assert.equal(h.document.activeElement, h.origin);
});

for (const [kind, openName] of [['notification', 'setNotificationPanelOpen'], ['settings', 'setSettingsPanelOpen']]) {
  test(`${kind}: Escape still closes when fragment navigation moves focus outside the modal`, t => {
    const h = harness(t);
    if (kind === 'notification') h.context.history.replaceState({}, '', '#notification-panel');
    h.context[openName](true);
    // Native fragment navigation and focus restoration can move the active
    // element after opening; the shell must retain its dismiss-key behavior.
    h.origin.focus(); h.escape();
    assert.equal(h.document.getElementById(kind + '-panel').hidden, true);
    assert.equal(h.document.activeElement, h.origin);
    if (kind === 'notification') assert.equal(h.context.location.hash, '#view-markets');
  });
}
test('modal Escape fallback respects consumed keys and a native dialog above the shell', t => {
  const h = harness(t); h.context.setNotificationPanelOpen(true); h.origin.focus();
  const consumed = new h.document.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  consumed.preventDefault(); h.origin.dispatchEvent(consumed);
  assert.equal(h.document.getElementById('notification-panel').hidden, false);
  const dialog = h.document.createElement('dialog'); dialog.setAttribute('open', ''); h.document.body.append(dialog);
  h.escape(); assert.equal(h.document.getElementById('notification-panel').hidden, false);
  dialog.remove(); h.escape(); assert.equal(h.document.getElementById('notification-panel').hidden, true);
  // An ordinary page key press must not be canceled when no shell modal is open.
  const ordinary = new h.document.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  h.origin.dispatchEvent(ordinary); assert.equal(ordinary.defaultPrevented, false);
});
