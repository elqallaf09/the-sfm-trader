// Execute the shipped functions against deterministic deferred responses.
// Every symbol/price is an isolated fixture, not live market evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { createInstrumentSearch } from '../public/modules/instrumentSearch.js';
const source = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
function declaration(name) {
  const start = source.search(new RegExp('^(?:async )?function ' + name + '\\(', 'm'));
  if (start < 0) return '';
  const rest = source.slice(start), end = rest.slice(1).search(/\n(?:async )?function \w+\(/);
  return end < 0 ? rest : rest.slice(0, end + 1);
}
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;}); return {promise,resolve,reject}; };
const flush = async () => { for (let i=0;i<12;i++) await Promise.resolve(); };
const payload = (symbol, market = 'watchlist') => ({market:{id:market}, recommendations:[{symbol,action:'hold',currentPrice:100,currency:'USD'}]});
function harness(t, extra={}) {
  const dom = new JSDOM('<div id="cards"></div><div id="scalp"></div><button id="submit"></button>', {url:'https://test.invalid/'});
  t.after(()=>dom.window.close());
  const requests=[], renders=[];
  const context = vm.createContext({
    AbortController, console, Map, Set,
    Date:class extends Date {static now(){return 10000;}}, document:dom.window.document,
    localizeUiText:String, escapeHtml:String, getFriendlyFetchError:e=>e.message,
    getMarketFeeds:()=>({load(){}}), activeMarket:'us', watchlist:['AAPL'], watchlistOnly:false,
    watchlistData:null,watchlistLoading:false,watchlistLastLoadedAt:0,WATCHLIST_REFRESH_MS:15000,
    watchlistRequestId:0,watchlistRequestController:null,watchlistRequestKey:'',watchlistDataKey:'',
    isLoading:false,recommendationRequestId:0,recommendationRequestController:null,
    lastRecommendationRefreshAt:0,RECOMMENDATIONS_FORCE_REFRESH_GRACE_MS:600,
    lastData:null,lastDataEndpoint:'',lastMarkets:[],recommendationResponseCache:new Map(),
    loadingIndicator:{textContent:''},cards:dom.window.document.getElementById('cards'),
    setHomeDashboardState(){},setConnectionStatus(){},updateConnectionStatus(){},restoreDetailScroll(){},
    setUiState(){},getDashboardRecommendations:d=>d.recommendations||[],updateRecommendationHistory(){},triggerSmartAlertPopup(){},
    renderRecommendations:d=>renders.push(d),renderWatchlist(){},renderPortfolio(){},
    normalizeSymbol:s=>String(s||'').toUpperCase().trim(),normalizeWatchlist:a=>a,marketNetworkOffline:false,
    guardDisplayPayload:d=>d,guardRecommendationForDisplay:i=>i,
    scalpResult:dom.window.document.getElementById('scalp'),scalpSubmit:dom.window.document.getElementById('submit'),scalpStatus:{textContent:''},
    scalpLoading:false,lastScalpItem:null,lastScalpDecision:null,scalpRequestId:0,scalpRequestController:null,scalpRequestSymbol:'',
    buildScalpDecision:i=>({action:'hold',statusLabel:'hold'}),renderScalpResult:i=>renders.push(i),
    fetchJson:(url,options={})=>{const task=deferred();requests.push({url,options,...task});return task.promise;},
    ...extra
  });
  vm.runInContext(['getRecommendationEndpoint','emptyWatchlistPayload','restrictWatchlistPayload','loadRecommendations','loadWatchlistData','analyzeScalpSymbol'].map(declaration).join('\n'),context);
  return {c:context,requests,renders,dom};
}
test('a watchlist-mode change within the refresh grace always loads its own endpoint',async t=>{
  const {c,requests}=harness(t); const first=c.loadRecommendations(); c.watchlistOnly=true;
  const second=c.loadRecommendations({force:true});
  assert.equal(requests.length,2);assert.match(requests[1].url,/\/api\/watchlist/);
  requests[1].resolve(payload('AAPL'));await second;requests[0].resolve(payload('MSFT','us'));await first;
  assert.equal(c.lastData.market.id,'watchlist');assert.equal(c.lastData.recommendations[0].symbol,'AAPL');
});
test('an empty watchlist-only selection is empty, never silently replaced by a market',async t=>{
  const {c,requests}=harness(t,{watchlistOnly:true,watchlist:[]});const work=c.loadRecommendations({force:true});
  assert.equal(requests.length,0);await work;assert.equal(c.lastData.market.id,'watchlist');assert.equal(c.lastData.recommendations.length,0);
});
test('same-context repeated refresh remains throttled and market switching still wins',async t=>{
  const {c,requests}=harness(t);const first=c.loadRecommendations({force:true});await c.loadRecommendations({force:true});assert.equal(requests.length,1);
  c.activeMarket='crypto';const second=c.loadRecommendations({force:true,marketChanged:true});assert.equal(requests.length,2);
  requests[1].resolve(payload('BTC-USD','crypto'));await second;requests[0].reject(Error('old market failure'));await first;
  assert.equal(c.lastData.market.id,'crypto');assert.equal(c.isLoading,false);
});
test('editing watchlist during a slow request supersedes it; late error cannot erase the new list',async t=>{
  const {c,requests}=harness(t);const first=c.loadWatchlistData(true);c.watchlist=['MSFT'];const second=c.loadWatchlistData(true);
  assert.equal(requests.length,2);assert.match(requests[1].url,/MSFT/);assert.equal(requests[0].options.signal.aborted,true);
  requests[1].resolve(payload('MSFT'));await second;requests[0].reject(Error('old request failure'));await first;
  assert.equal(c.watchlistData.recommendations[0].symbol,'MSFT');assert.equal(c.watchlistLoading,false);
});
test('clearing the watchlist invalidates a response already in flight',async t=>{
  const {c,requests}=harness(t);const first=c.loadWatchlistData(true);c.watchlist=[];await c.loadWatchlistData(true);
  requests[0].resolve(payload('AAPL'));await first;assert.equal(c.watchlistData,null);assert.equal(c.watchlistLoading,false);
});
test('watchlist responses cannot introduce an unrequested symbol',async t=>{
  const {c,requests}=harness(t);const work=c.loadWatchlistData(true);requests[0].resolve({...payload('MSFT'),unavailable:[{symbol:'BAD',reason:'test'}]});await work;
  assert.equal(c.watchlistData.recommendations.length,0);assert.ok((c.watchlistData.unavailable||[]).every(x=>x.symbol==='AAPL'));
});
test('latest scalp selection wins even if old work ignores its abort signal',async t=>{
  const {c,requests,renders}=harness(t);const first=c.analyzeScalpSymbol('AAPL'),second=c.analyzeScalpSymbol('MSFT');
  assert.equal(requests.length,2);assert.equal(requests[0].options.signal.aborted,true);
  requests[1].resolve({recommendation:payload('MSFT').recommendations[0]});await second;
  requests[0].resolve({recommendation:payload('AAPL').recommendations[0]});await first;
  assert.deepEqual(renders.map(x=>x.symbol),['MSFT']);assert.equal(c.scalpLoading,false);
});
test('scalp rejects a mismatched successful response instead of showing another asset',async t=>{
  const {c,requests,renders}=harness(t);const work=c.analyzeScalpSymbol('AAPL');requests[0].resolve({recommendation:payload('MSFT').recommendations[0]});await work;
  assert.equal(renders.length,0);assert.match(c.scalpResult.textContent,/لا يطابق/);
});
test('MS is a real ticker, not a browser alias for MSFT',()=>{
  const c=vm.createContext({});const aliases=source.match(/const SYMBOL_ALIASES = \{[\s\S]*?\n\};/)[0];
  vm.runInContext(aliases+'\n'+declaration('normalizeSymbol'),c);
  assert.equal(c.normalizeSymbol('MS'),'MS');assert.equal(c.normalizeSymbol('MICROSOFT'),'MSFT');
});
async function searchHarness(t) {
  const dom=new JSDOM('<form><input><button type="submit">Search</button></form><button id="outside">Outside</button>',{url:'https://test.invalid/'});
  const previous={document:globalThis.document,window:globalThis.window};
  globalThis.document=dom.window.document;globalThis.window=dom.window;
  t.after(()=>{Object.assign(globalThis,previous);dom.window.close();});
  const input=document.querySelector('input'),form=document.querySelector('form'),catalog=deferred(),opened=[];
  createInstrumentSearch({form,input,fetchCatalog:()=>catalog.promise,openInstrument:s=>opened.push(s),isEnglish:()=>false});
  input.focus();input.value='AAPL';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  const submit=()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  const escape=()=>input.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
  const finish=async()=>{catalog.resolve({instruments:[{symbol:'AAPL',name:'Apple'},{symbol:'MSFT',name:'Microsoft'}]});await flush();};
  return {dom,input,form,opened,submit,escape,finish,popup:document.querySelector('.instrument-search-popup')};
}
test('Escape while the catalog is pending cannot reopen the search popup later',async t=>{
  const h=await searchHarness(t);h.escape();await h.finish();assert.equal(h.popup.hidden,true);assert.equal(h.input.getAttribute('aria-expanded'),'false');
});
test('a canceled pending search submit cannot navigate after the catalog arrives',async t=>{
  const h=await searchHarness(t);h.submit();h.escape();await h.finish();assert.deepEqual(h.opened,[]);
});
test('editing the query cancels pending Enter intent rather than opening the new text',async t=>{
  const h=await searchHarness(t);h.submit();h.input.value='MSFT';h.input.dispatchEvent(new h.dom.window.Event('input',{bubbles:true}));await h.finish();assert.deepEqual(h.opened,[]);assert.equal(h.popup.hidden,false);
});
test('double submit while catalog loads opens the selected asset only once',async t=>{
  const h=await searchHarness(t);h.submit();h.submit();await h.finish();assert.deepEqual(h.opened,['AAPL']);
});
test('leaving search while a submit waits never triggers delayed navigation',async t=>{
  const h=await searchHarness(t);h.submit();h.dom.window.document.getElementById('outside').focus();await h.finish();assert.deepEqual(h.opened,[]);assert.equal(h.popup.hidden,true);
});
test('empty AI dashboard does not invent alerts, risk exposure, profit or a performance chart',t=>{
  const {c,dom}=harness(t,{notificationLog:[],isStockNotification:()=>true,sortRecommendations:x=>x,filterRecommendations:x=>x,
    formatNumber:String,formatPercent:String,isEnglishLanguage:()=>true,toNullableNumber:x=>x==null?null:Number(x),canExecuteRecommendation:()=>false});
  vm.runInContext(declaration('renderTradingCommandDashboard'),c);
  const html=c.renderTradingCommandDashboard({recommendations:[]},[],[],{});const host=dom.window.document.createElement('div');host.innerHTML=html;
  assert.equal(host.querySelector('.command-number-row b').textContent,'0');
  assert.doesNotMatch(host.textContent,/38%|1\.42%|Portfolio exposure|Today/);
  assert.equal(host.querySelector('.command-performance-value').textContent,'--');
  assert.equal(host.querySelectorAll('.command-mini-chart').length,0);
});

test('AI metrics use only real supplied values and label forecasts as forecasts',t=>{
 const {c,dom}=harness(t,{notificationLog:[],isStockNotification:()=>true,formatNumber:String,formatPercent:v=>v+'%',isEnglishLanguage:()=>true,
  toNullableNumber:x=>x===null||x===undefined?null:Number.isFinite(Number(x))?Number(x):null});
 vm.runInContext(declaration('renderTradingCommandDashboard'),c);
 const items=[{symbol:'AAPL',dataHealth:{score:0},expectedMovePct:0},{symbol:'MSFT',dataHealth:{score:80},expectedMovePct:2},{symbol:'META',dataHealth:{score:null},expectedMovePct:null}];
 const host=dom.window.document.createElement('div');host.innerHTML=c.renderTradingCommandDashboard({economicCalendar:{dataState:'fresh',source:'Test calendar'}},items,items,{closed:2,winRate:100});
 assert.equal(host.querySelector('.command-quality-value').textContent,'40%');
 assert.equal(host.querySelector('.command-performance .command-performance-value').textContent,'1%');
 assert.match(host.textContent,/Mean forecast move/);assert.match(host.textContent,/Test calendar/);
 assert.equal(host.querySelectorAll('.command-mini-chart,.command-gauge').length,0);
});
test('obsolete scalp failure cannot clear the latest loading state or result',async t=>{
 const {c,requests,renders}=harness(t);const first=c.analyzeScalpSymbol('AAPL'),second=c.analyzeScalpSymbol('MSFT');
 requests[0].reject(Error('old failure'));await first;assert.equal(c.scalpLoading,true);
 requests[1].resolve({recommendation:payload('MSFT').recommendations[0]});await second;assert.equal(renders[0].symbol,'MSFT');
});
test('emptying a watchlist-only selection also invalidates earlier main requests',async t=>{
 const {c,requests}=harness(t,{watchlistOnly:true});const first=c.loadRecommendations();
 c.watchlist=[];await c.loadRecommendations({force:true});requests[0].resolve(payload('AAPL'));await first;
 assert.equal(c.lastData.recommendations.length,0);assert.equal(c.lastData.market.totalSymbols,0);
});
