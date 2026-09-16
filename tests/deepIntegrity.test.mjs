import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { normalizeQuoteCurrency,resolveQuoteCurrency,guardDisplayPayload } from '../public/modules/marketIntegrity.js';
import { finalizeRecommendation } from '../src/recommendationPolicy.mjs';
import { parseProviderTimestamp } from '../src/providerTime.mjs';
import { selectPriceObservation } from '../src/priceObservation.mjs';
import { normalizeShariaEvidence } from '../src/shariaEvidence.mjs';
import { buildMarketDataProvenance } from '../src/marketDataProvenance.mjs';
import { createHomeDashboard } from '../public/modules/homeDashboard.js';
const now=Date.parse('2026-09-14T14:00:00Z');
const session={isOpen:true};
const item={symbol:'AAPL',currentPrice:100,action:'buy',confidence:80,tradePlan:{action:'buy'},decision:{kind:'buy'},dataProvenance:{priceKind:'quote',marketTimestamp:'2026-09-14T13:55:00Z',retrievedAt:'2026-09-14T14:00:00Z'}};
const finalize=value=>finalizeRecommendation(value,{session,now});

test('provider subunits and multi-currency listings are preserved without numeric conversion',()=>{
 assert.equal(normalizeQuoteCurrency('GBp'),'GBX');
 assert.equal(normalizeQuoteCurrency('GBP'),'GBP');
 assert.equal(normalizeQuoteCurrency('KWF'),'KWF');
 assert.equal(resolveQuoteCurrency('AZN.L','','EUR'),'');
 assert.equal(resolveQuoteCurrency('DUAL.SW','USD'),'USD');
 for(const [symbol,currency] of [['NESN.SW','CHF'],['005930.KS','KRW'],['9988.HK','HKD'],['7203.T','JPY']]) assert.equal(resolveQuoteCurrency(symbol,''),currency);
});
test('fresh frame cannot launder an old primary price',()=>{
 const result=finalize({...item,dataProvenance:{...item.dataProvenance,marketTimestamp:'2026-09-11T20:00:00Z'},timeframes:[{id:'1m',latestTimestamp:now/1000}]});
 assert.equal(result.action,'hold');assert.equal(result.tradePlan.action,'hold');assert.equal(result.decision.kind,'hold');assert.equal(result.dataProvenance.freshness,'stale');
});
test('explicit stale and future primary timestamps block even with a fresh frame',()=>{
 for(const provenance of [{freshness:'stale'},{marketTimestamp:'2026-09-15T14:00:00Z'}]) assert.equal(finalize({...item,dataProvenance:{...item.dataProvenance,...provenance}}).action,'hold');
});
test('fresh valid quote is preserved and cache responses are re-evaluated at response time',()=>{
 assert.equal(finalize(item).action,'buy');
 assert.equal(finalizeRecommendation(item,{session,now:now+30*60000}).action,'hold');
 assert.equal(item.action,'buy');
});
test('daily-only closing prices are not intraday execution prices',()=>{
 assert.equal(finalize({...item,dataProvenance:{...item.dataProvenance,priceKind:'bar-close',priceInterval:'1d'}}).action,'hold');
 assert.equal(finalize({...item,dataProvenance:{...item.dataProvenance,priceKind:'bar-close',priceInterval:'15m'}}).action,'buy');
});
test('provider closed state overrides a regular-weekday opening assumption',()=>{
 const result=finalize({...item,marketState:'CLOSED'});assert.equal(result.action,'hold');assert.equal(result.priceFreshness.state,'closed');
});
test('price selection pairs values with their own timestamps, not retrieval time',()=>{
 const frame={id:'1d',closes:[80],latestTimestamp:(now-86400000)/1000,meta:{regularMarketPrice:100}};
 assert.equal(selectPriceObservation(frame,now).price,80);
 const fresh=selectPriceObservation({...frame,meta:{regularMarketPrice:100,regularMarketTime:(now-60000)/1000}},now);
 assert.equal(fresh.price,100);assert.equal(fresh.priceKind,'quote');
 assert.throws(()=>selectPriceObservation({...frame,latestTimestamp:null},now));
});
test('provenance rejects out-of-range timestamps without a server crash',()=>{
 assert.equal(buildMarketDataProvenance({marketTimestamp:1e30}).marketTimestamp,null);
});
test('provider timezone conversion respects summer and winter offsets',()=>{
 assert.equal(parseProviderTimestamp('2026-09-14 09:30:00','America/New_York'),Date.parse('2026-09-14T13:30:00Z')/1000);
 assert.equal(parseProviderTimestamp('2026-01-14 09:30:00','America/New_York'),Date.parse('2026-01-14T14:30:00Z')/1000);
 assert.equal(parseProviderTimestamp('2026-09-14 13:30:00','UTC'),Date.parse('2026-09-14T13:30:00Z')/1000);
 assert.ok(Number.isNaN(parseProviderTimestamp('2026-02-30 10:00:00','UTC')));
 assert.ok(Number.isNaN(parseProviderTimestamp('2026-09-14 09:30:00',null)));
});
test('Sharia screening requires matching symbol, source and actual valid screening date',()=>{
 const valid={symbol:'AAPL',status:'compliant',source:'Test screening source',checkedAt:'2026-09-10'};
 assert.equal(normalizeShariaEvidence(valid,'AAPL',now).shariaVerified,true);
 for(const change of [{symbol:'MSFT'},{checkedAt:null},{source:''},{checkedAt:'2027-01-01'},{checkedAt:'2020-01-01'},{compliant:false}]) {
  const result=normalizeShariaEvidence({...valid,...change},'AAPL',now);
  assert.equal(result.shariaStatus,'unknown');assert.equal(result.shariaCheckedAt,null);
 }
});
test('stale browser fallback cannot retain actionable recommendations; cached is not stale',()=>{
 const raw={recommendations:[item],smartAlerts:[item]};
 const stale=guardDisplayPayload({...raw,stale:true});assert.equal(stale.recommendations[0].action,'hold');assert.deepEqual(stale.smartAlerts,[]);
 assert.equal(guardDisplayPayload({...raw,cached:true,recommendations:[{...item,executionSession:{isOpen:true},priceFreshness:{state:"current",marketTimestamp:item.dataProvenance.marketTimestamp,maxAgeSeconds:1200}}]},now).recommendations[0].action,'buy');assert.equal(raw.recommendations[0].action,'buy');
});
test('Home tolerates null calendars, missing forecasts and partial empty responses',()=>{
 const dom=new JSDOM('<section id="terminal-home-v3"><span id="v3-pulse-change"></span><div id="v3-pulse-chart"></div><div id="v3-calendar-list"></div></section>');
 const before=globalThis.document;globalThis.document=dom.window.document;
 try{
  const dashboard=createHomeDashboard({calculateFinalScore:()=>({score:0}),clamp:(x,min,max)=>Math.max(min,Math.min(max,x)),localizeUiText:String,formatNumber:String,formatPercent:String,formatDateTime:String,formatMoney:String,getMarketPulse:()=>'',attachDetailOpeners(){},isEnglishLanguage:()=>false,getFollowedEntries:()=>[],reload(){}});
  assert.doesNotThrow(()=>dashboard.render({recommendations:[{symbol:'AAPL',expectedMovePct:null}],economicCalendar:null}));
  assert.equal(document.querySelector('#v3-pulse-change').textContent,'--');assert.equal(document.querySelector('#v3-pulse-chart svg'),null);
  dashboard.render({recommendations:[],partial:true});assert.equal(document.querySelector('#terminal-home-v3').dataset.uiState,'loading');
 }finally{globalThis.document=before;dom.window.close();}
});

// Execute the actual large app functions (not duplicated implementations).
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
function declaration(source,name){const start=source.search(new RegExp('^(?:async )?function '+name+'\\(','m'));assert.ok(start>=0);const rest=source.slice(start);const next=rest.slice(1).search(/\n(?:async )?function \w+\(/);return next<0?rest:rest.slice(0,next+1);}
test('saved preference normalization retains all enabled/disabled controls',()=>{
 const context=vm.createContext({normalizeLocaleCode:String,sanitizeDisplayName:String,DEFAULT_USER_DISPLAY_NAME:'Test'});
 vm.runInContext(declaration(app,'normalizeAppSettings'),context);
 const settings=context.normalizeAppSettings({language:'en',notifyTarget:false,notifySound:false,shariaOnly:true});
 assert.equal(settings.notifyTarget,false);assert.equal(settings.notifySound,false);assert.equal(settings.shariaOnly,true);
});
const server=await readFile(new URL('../server.mjs',import.meta.url),'utf8');
test('voice lookup ignores caller prices and returns no candidates on server failure',async()=>{
 const context=vm.createContext({markets:{us:{}},getMarketPayloadForVoice:async()=>{throw Error('offline');},summarizeVoiceRecommendations:x=>x});
 vm.runInContext(declaration(server,'getVoiceRecommendationsForTranscript'),context);
 const result=await context.getVoiceRecommendationsForTranscript('buy','us',[{symbol:'FAKE',currentPrice:999,action:'buy'}]);assert.equal(result.length,0);
});
test('MS ticker is not an alias for MSFT',()=>{assert.doesNotMatch(server,/\bMS:\s*"MSFT"/);});

test('a favorable horizon close is not counted as a target hit in the backtest',async()=>{
 const analysis=await readFile(new URL('../src/analysis.mjs',import.meta.url),'utf8');
 const context=vm.createContext({BACKTEST_HORIZON:15,BACKTEST_TRANSACTION_COST_BPS:0,TP1_ATR_MULTIPLE:.9,SL_ATR_MULTIPLE:1.8,buildIndicators:()=>({atr14:1}),scoreSignal:()=>({action:'buy'}),finiteOr:(x,f)=>Number.isFinite(x)?x:f,pctChange:(a,b)=>(b-a)/a*100,round:(x)=>x});
 vm.runInContext(declaration(analysis,'backtestSignals'),context);
 const closes=Array.from({length:120},(_,i)=>100+i*.001);
 const value=context.backtestSignals(closes,closes.map(x=>x+.001),closes.map(x=>x-.001),closes.map(()=>100));
 assert.ok(value.samples>=3);assert.equal(value.wins,0);assert.equal(value.winRate,0);assert.ok(value.avgReturnPct>0);
});
