from pathlib import Path
import re,subprocess
pattern=re.compile(r'^<<<<<<<[^\n]*\n(.*?)^=======\n(.*?)^>>>>>>>[^\n]*\n?',re.M|re.S)
def resolve(path, choices, expected):
 p=Path(path);s=p.read_text();blocks=list(pattern.finditer(s));assert len(blocks)==expected,(path,len(blocks))
 i=iter(choices)
 def replace(m):
  choice=next(i)
  return m.group(1 if choice=='ours' else 2) if choice in ['ours','theirs'] else choice(m.group(1),m.group(2))
 p.write_text(pattern.sub(replace,s))
def rows(ours,theirs):
 return ours.replace('const evidence = normalizeSymbolEvidence(item);','item = guardRecommendationForDisplay(item);\n        const evidence = normalizeSymbolEvidence(item);\n        const metrics = getAnalysisMetrics(item, { english: sfmFinalIsEnglish(), localize: localizeUiText });')
def values(ours,theirs):
 return ours.replace('          risk,','          confidenceText: evidence.ready ? metrics.confidenceText : metrics.unavailable,\n          scoreText: evidence.ready ? metrics.scoreText : metrics.unavailable,\n          targetText: evidence.target === null ? metrics.unavailable : sfmFinalFormatPrice(evidence.target, item.currency),\n          risk,',1).replace('score: evidence.ready ? sfmFinalSafeNumber(item.score) : null','score: evidence.ready ? metrics.score : null').replace('aiScore: evidence.ready ? sfmFinalSafeNumber(item.score) : null','aiScore: evidence.ready ? metrics.score : null')
resolve('public/app.js',[
 lambda o,t:t+'import { nullableNumber, normalizeSymbolEvidence, validateSymbolDetail, createStore as createSymbolDetailStore } from "./modules/symbolDetailData.js";\n',
 'theirs','ours','theirs','ours',rows,values,
 lambda o,t:o.replace('row.hasConfidence ? sfmFinalFormatConfidence(row.confidence) : sfmFinalRecommendationDash','row.confidenceText'),
 lambda o,t:o.replace('row.hasConfidence ? sfmFinalFormatConfidence(row.confidence) : sfmFinalRecommendationDash','row.confidenceText'),
 'theirs',
 lambda o,t:o.replace('    const scrollTop =', '    sfmFinalDrawerSymbol = row.symbol;\n    const scrollTop =').replace('const targetText = row.target && row.target !== sfmFinalRecommendationDash\n      ? row.target\n      : sfmFinalL("غير متاح", "Unavailable");','const targetText = row.targetText;'),
 lambda o,t:o.replace('    sfmFinalOpenRecommendationDrawer();','    if (open) sfmFinalOpenRecommendationDrawer();')
],12)
resolve('public/index.html',[lambda o,t:t+'    <link rel="stylesheet" href="/symbol-detail-mobile.css?v=20260916-symbol-data" />\n','ours'],2)
resolve('public/service-worker.js',['ours',lambda o,t:t.replace('/app.js?v=20260914-async-selection-2','/app.js?v=20260916-symbol-data'),lambda o,t:t+'  "/modules/symbolDetailData.js",\n  "/symbol-detail-mobile.css?v=20260916-symbol-data",\n'],3)
resolve('tools/check.mjs',[lambda o,t:o+t],1)
resolve('package.json',['ours'],1)
for path in ['tools/capture-home-v3.mjs','tools/capture-deep-audit.mjs']:
 resolve(path,['theirs'],1)
Path('package-lock.json').write_bytes(subprocess.check_output(['git','show','70828beb2092804abde214c9e65ae7121bc0cde8:package-lock.json']))
Path('tools/capture-mobile-symbols.mjs').write_text("import { runCapture } from './mobile-symbol-regression.mjs';\nawait runCapture('drawer');\nawait runCapture('home');\n")
p=Path('tools/mobile-symbol-regression.mjs');s=p.read_text()
s=s.replace("'.artifacts/home-v3' : '.artifacts/deep-audit'", "'.artifacts/mobile-home' : '.artifacts/mobile-symbols'")
s=s.replace("  return { symbol, name:","  const observed = new Date().toISOString();\n  return { symbol, name:")
s=s.replace("    dataHealth: { coverage: 4, score: 80 }, dataProvenance: { marketTimestamp: new Date().toISOString(), freshness: 'current', provider: 'Fixture provider' },", "    executionSession: { isOpen: true }, priceFreshness: { state: 'current', marketTimestamp: observed, maxAgeSeconds: 1200 },\n    dataHealth: { coverage: 4, score: 80 }, dataProvenance: { priceKind: 'quote', marketTimestamp: observed, freshness: 'current', provider: 'Fixture provider' },")
p.write_text(s)
for p in [Path('public/app.js'),Path('public/index.html'),Path('public/service-worker.js')]:
 assert not pattern.search(p.read_text()),p
