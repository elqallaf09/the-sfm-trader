from pathlib import Path
import hashlib, subprocess
checks = {
 'public/app.js':('696bc3b8c93c5c641b18a62e478e4d72a079e702ab8fbf9386cfcb30ae471f03','a843659ec446af1d79b92ccd44000748adb3b586013ac8038dc6538a720c9625'),
 'public/index.html':('a2e2dd12ea38140ee8b33b5951e3029eff11d332371ba3108719bceffb6c65bc','e470f112715d7b5a0a9111dfc18d07fd63d4969af2e1567dfae0177dedbb6073'),
 'public/service-worker.js':('c8883af2caa3580959adf547db64bd942de9d67306427d76a8a46772ada175ba','54e90f15ff098a5d2622fc21439b2a1c92b827704f17de77a970ad787a24b82a'),
 'tests/layoutStability.test.mjs':('99ece01e33c40de29cec84ce93f10848b6cd84cf3599bdb57b6a76529cbb35ab','dd606deeb1b2613886474ab3603260aa79028fa673cb54eec1067a867d63ea82'),
 'tools/check.mjs':('e2e816927f19e739dc72336590799932b673ad9d39433f2d2296e6d02900cf8f','e475f8cb72d4d74330b7415fff66f01817023abe030eb856357746137c5c4b33'),
 'tools/capture-async-selection.mjs':('47d8fd4969705f58803772cf32896987c4167639a872a8ca57da806c1c4aca2f','ce0576cd627f3daea15a1c2885b6944b4ad70d9b70e5ab2209fa0eaec38099ed')
}
for name,(before,after) in checks.items():
 assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == before,name
assert hashlib.sha256(Path('tests/emptyMarketDisplay.test.mjs').read_bytes()).hexdigest() == '419e37b377ecd96630b2e9a5df211ca62c691af9f76d0e77946e63bf09bd61b0'
p=Path('public/app.js');s=p.read_text()
def replace(old,new):
 global s
 assert s.count(old)==1,(old[:90],s.count(old));s=s.replace(old,new)
replace('  if (aiAgentStatus) aiAgentStatus.textContent = isEnglishLanguage() ? "Active" : "نشط";', '''  const confidenceValues = all.map(item => toNullableNumber(item.confidence)).filter(value => value !== null && value >= 0 && value <= 100);
  const meanConfidence = confidenceValues.length ? Math.round(confidenceValues.reduce((sum,value) => sum + value,0) / confidenceValues.length) : null;
  if (aiAgentStatus) aiAgentStatus.textContent = data?.stale
    ? (isEnglishLanguage() ? "Observation only" : "للمراقبة فقط")
    : all.length ? (isEnglishLanguage() ? "Active" : "نشط")
    : (isEnglishLanguage() ? "Waiting for data" : "بانتظار البيانات");''')
replace('  if (aiAverageConfidence) aiAverageConfidence.textContent = all.length ? `${formatNumber(avg)}%` : "--";', '  if (aiAverageConfidence) aiAverageConfidence.textContent = meanConfidence === null ? "--" : `${formatNumber(meanConfidence)}%`;')
replace('    aiMarketBias.textContent = isEnglishLanguage()','    aiMarketBias.textContent = !all.length ? "--" : isEnglishLanguage()')
replace('  ["Connected markets", "الأسواق المتصلة"],','  ["Market categories", "فئات الأسواق"],')
replace('        <span class="rdp-pick-confidence">${formatNumber(Number(item.confidence || 0))}%</span>', '        <span class="rdp-pick-confidence">${toNullableNumber(item.confidence) === null ? "--" : `${formatNumber(item.confidence)}%`}</span>')
replace('  const total = all.length || 1;\n  const bullV = Math.round((buys.length / total) * 100);\n  const bearV = Math.round((sells.length / total) * 100);\n  const neutV = Math.max(0, 100 - bullV - bearV);','''  const total = all.length;
  const bullV = total ? Math.round((buys.length / total) * 100) : 0;
  const bearV = total ? Math.round((sells.length / total) * 100) : 0;
  const neutV = total ? Math.max(0, 100 - bullV - bearV) : 0;''')
for side in ['bull','bear','neut']:
 replace(f'  if ({side}PctEl) {side}PctEl.textContent = `${{{side}V}}%`;', f'  if ({side}PctEl) {side}PctEl.textContent = total ? `${{{side}V}}%` : "--";')
replace('    biasLabel.textContent = localizeUiText(label);','    biasLabel.textContent = localizeUiText(total ? label : "بانتظار البيانات");')
replace('  const confEl = document.getElementById("mo-confidence-pct");\n\n  all.forEach', '''  const confEl = document.getElementById("mo-confidence-pct");

  // A newly selected market must not retain an absent instrument from its predecessor.
  for (const id of new Set(Object.values(MAP))) {
    const element = document.getElementById(id);
    if (element) { element.textContent = "--"; element.className = "mo-bubble-change"; }
  }
  if (sentimentEl) sentimentEl.textContent = localizeUiText("بانتظار البيانات");
  for (const element of [sentimentPctEl, confidenceLabelEl, confEl]) if (element) element.textContent = "--";

  all.forEach''')
replace('    const bias = bullPct > 55 ? "bullish" : buys < all.length * 0.35 ? "bearish" : "neutral";', '''    const sells = all.filter(r => r.action === "sell").length;
    const bias = bullPct > 55 ? "bullish" : (sells / all.length) * 100 > 55 ? "bearish" : "neutral";''')
replace('''      const avgConf = Math.round(all.reduce((s, r) => s + (r.confidence || 0), 0) / all.length);
      confEl.textContent = `${avgConf}%`;
      if (confidenceLabelEl) confidenceLabelEl.textContent = avgConf >= 75 ? "HIGH" : avgConf >= 55 ? "MEDIUM" : "LOW";''','''      const confidences = all.map(item => toNullableNumber(item.confidence)).filter(value => value !== null && value >= 0 && value <= 100);
      const avgConf = confidences.length ? Math.round(confidences.reduce((sum,value) => sum + value,0) / confidences.length) : null;
      confEl.textContent = avgConf === null ? "--" : `${avgConf}%`;
      if (confidenceLabelEl) confidenceLabelEl.textContent = avgConf === null ? "--" : avgConf >= 75 ? "HIGH" : avgConf >= 55 ? "MEDIUM" : "LOW";''')
p.write_text(s)
p=Path('public/index.html');s=p.read_text().replace('<span>الأسواق المتابعة</span>', '<span>فئات الأسواق</span>').replace('<em>Connected markets</em>', '<em>Market categories</em>');p.write_text(s)
for name in ['public/index.html','public/service-worker.js','tests/layoutStability.test.mjs']:
 p=Path(name);s=p.read_text().replace('the-sfm-trader-v20260914-async-selection-1','the-sfm-trader-v20260914-async-selection-2').replace('/app.js?v=20260914-async-selection-1','/app.js?v=20260914-async-selection-2');p.write_text(s)
p=Path('tools/check.mjs');s=p.read_text().replace('const syntaxFiles = [','const syntaxFiles = [\n  "tests/emptyMarketDisplay.test.mjs",');p.write_text(s)
p=Path('tools/capture-async-selection.mjs');s=p.read_text();old="   assert.doesNotMatch(await panel.innerText(),/38%|1\\.42%|Portfolio exposure|Today/);";assert s.count(old)==1
s=s.replace(old,old+'''
   for (const side of ['bull','bear','neut']) assert.equal(await page.locator('#rdp-'+side+'-pct').textContent(),'--');
   assert.equal(await page.locator('#ai-agent-status').textContent(),'بانتظار البيانات');
   assert.equal(await page.locator('#mo-confidence-pct').textContent(),'--');
   assert.equal(await page.locator('#mo-sentiment-pct').textContent(),'--');''');p.write_text(s)
for name,(before,after) in checks.items():
 assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == after,name
subprocess.run(['git','diff','--check'],check=True)
subprocess.run(['git','add','--',*checks],check=True)
assert set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines()) == set(checks)
subprocess.run(['git','commit','-m','fix: clear absent market metrics and label catalog counts honestly'],check=True)
subprocess.run(['git','push','origin','HEAD:refs/heads/fix/async-state-integrity'],check=True)
