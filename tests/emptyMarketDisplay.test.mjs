// Actual display functions; fixtures are not provider observations.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {toNullableNumber} from '../public/modules/numberValue.js';
const source=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
function declaration(name){const a=source.search(new RegExp('^function '+name+'\\(','m'));assert.ok(a>=0);const rest=source.slice(a);return rest.slice(0,rest.search(/^\}/m)+1);}
function harness(t){
 const ids=['rdp-picks-list','rdp-bias-label','rdp-bull-bar','rdp-bear-bar','rdp-neut-bar','rdp-bull-pct','rdp-bear-pct','rdp-neut-pct','moc-nasdaq','moc-sp500','moc-ftse','moc-dax','moc-nikkei','moc-asx','mo-sentiment-label','mo-sentiment-pct','mo-confidence-label','mo-confidence-pct'];
 const dom=new JSDOM(ids.map(id=>'<div id="'+id+'">OLD</div>').join(''));t.after(()=>dom.window.close());
 const fields=['aiAgentStatus','aiMarketCount','aiAssetCount','aiBuyCount','aiSellCount','aiAverageConfidence','aiMarketBias','aiMarketUpdate'];
 const c=vm.createContext({document:dom.window.document,localizeUiText:String,formatNumber:String,formatPercent:x=>String(x)+'%',escapeHtml:String,formatDateTime:String,toNullableNumber,
  isEnglishLanguage:()=>true,lastMarkets:[],buildCompleteMarketList:()=>[{id:'us'},{id:'crypto'}],REQUIRED_MARKET_CATEGORY_DEFINITIONS:[],updateRightPanelNews(){},...Object.fromEntries(fields.map(k=>[k,dom.window.document.createElement('strong')]))});
 vm.runInContext(['updateAiTradingAgentSummary','updateRightPanel','updateMarketOverviewBubbles'].map(declaration).join('\n'),c);
 return {c,document:dom.window.document};
}
test('an empty right panel does not report 100 percent neutral sentiment',t=>{
 const {c,document:d}=harness(t);c.updateRightPanel([]);
 for(const side of ['bull','bear','neut']){assert.equal(d.getElementById('rdp-'+side+'-pct').textContent,'--');assert.equal(d.getElementById('rdp-'+side+'-bar').style.width,'0%');}
 assert.equal(d.getElementById('rdp-bias-label').textContent,'بانتظار البيانات');
});
test('market changes clear absent overview quotes and sentiment from the previous market',t=>{
 const {c,document:d}=harness(t);c.updateMarketOverviewBubbles([{symbol:'NAS100',expectedMovePct:2,action:'buy',confidence:80}]);
 assert.equal(d.getElementById('moc-nasdaq').textContent,'2%');c.updateMarketOverviewBubbles([]);
 for(const id of ['moc-nasdaq','mo-sentiment-pct','mo-confidence-pct','mo-confidence-label'])assert.equal(d.getElementById(id).textContent,'--',id);
 assert.equal(d.getElementById('mo-sentiment-label').textContent,'بانتظار البيانات');
});
test('all-Hold observations are neutral, not a bearish signal; missing confidence stays missing',t=>{
 const {c,document:d}=harness(t);c.updateMarketOverviewBubbles([{symbol:'TEST',action:'hold',confidence:null}]);
 assert.equal(d.getElementById('mo-sentiment-label').textContent,'محايد');assert.equal(d.getElementById('mo-confidence-pct').textContent,'--');
 c.updateRightPanel([{symbol:'TEST',action:'hold',confidence:null}],[],[]);assert.equal(d.getElementById('rdp-neut-pct').textContent,'100%');
 assert.doesNotMatch(d.getElementById('rdp-picks-list').textContent,/0%/);
});
test('summary distinguishes waiting and stale data and ignores missing confidence',t=>{
 const {c}=harness(t);c.updateAiTradingAgentSummary({recommendations:[]},[],[],[],0);
 assert.equal(c.aiAgentStatus.textContent,'Waiting for data');assert.equal(c.aiMarketBias.textContent,'--');
 const items=[{symbol:'TEST',confidence:null}];c.updateAiTradingAgentSummary({stale:true},items,[],[],0);
 assert.equal(c.aiAgentStatus.textContent,'Observation only');assert.equal(c.aiAverageConfidence.textContent,'--');
 c.updateAiTradingAgentSummary({},[{confidence:0},{confidence:80},{confidence:null}],[],[],0);assert.equal(c.aiAverageConfidence.textContent,'40%');
});
test('market catalog count is labeled as categories rather than live connections',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');assert.doesNotMatch(html,/Connected markets/);assert.match(html,/Market categories/);
});
