import json, hashlib, subprocess
from pathlib import Path
manifest = json.loads(Path('.fragment-repair.json').read_text())['files']
assert len(manifest) == 6
for name, checks in manifest.items():
    assert name.startswith(('public/', 'tests/', 'tools/')) and '..' not in Path(name).parts
    assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == checks['before'], name
p=Path('tests/modalFocusRace.test.mjs')
s=p.read_text()
s=s.replace("syncSettingsForm() {}, getComputedStyle", "syncSettingsForm() {}, clearNotificationLog() {}, getComputedStyle")
s=s.replace("['setSettingsPanelOpen', 'setNotificationPanelOpen', 'handleModalKeydown']", "['setSettingsPanelOpen', 'setNotificationPanelOpen', 'handleModalKeydown', 'initModalPanelControls', 'toggleNotificationPanel']")
s=s.replace("  const origin = document.querySelector('#origin'); origin.focus();", "  context.initModalPanelControls();\n  const origin = document.querySelector('#origin'); origin.focus();")
s+='''\nfor (const [kind, openName] of [['notification', 'setNotificationPanelOpen'], ['settings', 'setSettingsPanelOpen']]) {
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
'''
p.write_text(s)
r=Path('.')
p=r/'public/app.js';s=p.read_text(); old='  notificationClearButton?.addEventListener("click", clearNotificationLog);\n}'
new='''  notificationClearButton?.addEventListener("click", clearNotificationLog);
  document.addEventListener("keydown", (event) => {
    // Fragment navigation may move focus to the document after a panel opens.
    // Preserve Escape dismissal without consuming a nested dialog's own key.
    if (event.defaultPrevented || event.key !== "Escape" || document.querySelector("dialog[open]")) return;
    const panel = settingsPanel?.hidden === false ? settingsPanel
      : notificationPanel?.hidden === false ? notificationPanel : null;
    if (!panel || panel.contains(event.target)) return;
    const targetDialog = event.target?.closest?.('[role="dialog"], dialog');
    if (targetDialog && targetDialog !== panel) return;
    event.preventDefault();
    if (panel === settingsPanel) setSettingsPanelOpen(false);
    else setNotificationPanelOpen(false);
  });
}'''
assert s.count(old)==1;s=s.replace(old,new);p.write_text(s)
for name in ['public/index.html','public/service-worker.js','tests/layoutStability.test.mjs']:
 p=r/name;s=p.read_text();assert '20260914-modal-focus-1' in s;p.write_text(s.replace('20260914-modal-focus-1','20260914-modal-focus-2'))
p=r/'tools/capture-deep-audit.mjs';s=p.read_text().replace('const checks=[],failures=[],errors=[];','const checks=[],failures=[],errors=[],modalDiagnostics=[];')
old='''   await page.goto(base+'/?skipIntro=1#notification-panel');await page.locator('#notification-panel').waitFor({state:'visible'});
   await page.keyboard.press('Escape');await waitHome(page);assert.equal(new URL(page.url()).hash,'#view-home');'''
new='''   await page.goto(base+'/?skipIntro=1#notification-panel');await page.locator('#notification-panel').waitFor({state:'visible'});
   const before=await page.evaluate(()=>({focus:document.activeElement?.id||document.activeElement?.tagName,hash:location.hash,hidden:document.getElementById('notification-panel').hidden}));
   await page.keyboard.press('Escape');await waitHome(page);
   const after=await page.evaluate(()=>({focus:document.activeElement?.id||document.activeElement?.tagName,hash:location.hash,hidden:document.getElementById('notification-panel').hidden}));
   modalDiagnostics.push({width,path:'same-document fragment',before,after});
   assert.equal(after.hidden,true,'Escape closes the deep-linked panel');
   assert.equal(new URL(page.url()).hash,'#view-home');'''
assert s.count(old)==1;s=s.replace(old,new)
old='''  await page.evaluate(()=>{const badge=document.createElement('p');'''
new='''  await check(prefix+'cold document notification link owns a working Escape dismissal',async()=>{
   await page.goto(base+'/?skipIntro=1&modal-cold='+width+'#notification-panel');
   await page.locator('#notification-panel').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.locator('#notification-panel').waitFor({state:'hidden'});
   await waitHome(page);assert.equal(new URL(page.url()).hash,'#view-home');
  },page);
  await page.evaluate(()=>{const badge=document.createElement('p');'''
assert s.count(old)==1;s=s.replace(old,new).replace('checks,failures,errors},null,2)', 'checks,failures,errors,modalDiagnostics},null,2)');p.write_text(s)
for name, checks in manifest.items():
    assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == checks['after'], name
subprocess.run(['git', 'diff', '--check'], check=True)
subprocess.run(['git', 'add', '--', *manifest], check=True)
assert set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines()) == set(manifest)
subprocess.run(['git','commit','-m','fix: retain Escape dismissal after fragment focus changes'],check=True)
subprocess.run(['git','push','origin','HEAD:refs/heads/fix/modal-focus-race'],check=True)
