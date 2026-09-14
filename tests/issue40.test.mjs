// Negative cases reproduced on 3e7d206. All amounts are synthetic test inputs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import * as integrity from '../public/modules/marketIntegrity.js';
import * as numbers from '../public/modules/numberValue.js';
import {finalizeRecommendation} from '../src/recommendationPolicy.mjs';
import {applyEconomicNewsOverlayToRecommendations} from '../src/economicCalendar.mjs';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const server=await readFile(new URL('../server.mjs',import.meta.url),'utf8');
function fn(source,name){const start=source.search(new RegExp('^(?:async )?function '+name+'\\(','m'));assert.ok(start>=0,name);const rest=source.slice(start);const next=rest.slice(1).search(/\n(?:async )?function \w+\(/);return next<0?rest:rest.slice(0,next+1);}
const now=Date.parse('2026-09-14T14:00:00Z');
const raw={symbol:'AAPL',currentPrice:100,currency:'USD',action:'buy',actionLabel:'شراء',confidence:82,tradePlan:{action:'buy'},decision:{kind:'buy'},dataHealth:{score:90},timeframeConsensus:{},dataProvenance:{priceKind:'quote',marketTimestamp:new Date(now-60000).toISOString(),retrievedAt:new Date(now).toISOString()},timeframes:[{id:'1m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000},{id:'15m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000}]};
const guarded=(input=raw,session={isOpen:true})=>finalizeRecommendation(input,{session,now});
function appContext(extra={}){return vm.createContext({...numbers,...integrity,canExecuteRecommendation: item => integrity.canExecuteRecommendation(item,now),hasCurrentPriceObservation: item => integrity.hasCurrentPriceObservation(item,now),Date:class extends Date{static now(){return now;}},formatNumber:String,clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),...extra});}
for(const [name,input,session] of [['closed',raw,{isOpen:false}],['stale',{...raw,dataProvenance:{...raw.dataProvenance,marketTimestamp:'2026-09-11T14:00:00Z'}},{isOpen:true}],['missing source',{...raw,dataProvenance:null},{isOpen:true}],['unknown session',raw,null],['server hold',{...raw,action:'hold'},{isOpen:true}],['news block',{...raw,economicNewsRisk:{blockTrading:true}},{isOpen:true}]]){
 test('scalping cannot override '+name,()=>{const ctx=appContext();vm.runInContext(fn(app,'buildScalpDecision'),ctx);const result=ctx.buildScalpDecision(guarded(input,session));assert.equal(result.action,'hold');assert.equal(result.target,null);assert.equal(result.stop,null);assert.doesNotMatch(result.actionText,/اشتر|بيع الآن/);});
}
test('positive control: authorized fresh scalp remains possible',()=>{const ctx=appContext();vm.runInContext(fn(app,'buildScalpDecision'),ctx);assert.equal(ctx.buildScalpDecision(guarded()).action,'buy');});
test('history hit checks preserve missing and invalid thresholds',()=>{const ctx=appContext();vm.runInContext(['isTargetHit','isStopHit','getObservedReturnPct','pickBestObservedPrice','pickWorstObservedPrice'].map(n=>fn(app,n)).join('\n'),ctx);for(const missing of [null,undefined,'',0,-1,NaN,Infinity]){assert.equal(ctx.isTargetHit('buy',100,missing),false);assert.equal(ctx.isStopHit('sell',100,missing),false);assert.equal(ctx.isStopHit('buy',missing,95),false);}assert.equal(ctx.getObservedReturnPct('buy',100,null),null);assert.equal(ctx.pickBestObservedPrice('sell',null,100),100);assert.equal(ctx.pickWorstObservedPrice('buy',null,100),100);assert.equal(ctx.isTargetHit('buy',110,110),true);assert.equal(ctx.isStopHit('sell',105,105),true);});
test('real history update cannot invent an outcome from null target or stop',()=>{for(const fields of [{action:'buy',expectedPrice:null,target1:null,stopLoss:95},{action:'sell',expectedPrice:90,target1:90,stopLoss:null}]){const ctx=appContext({recommendationHistory:[],followedTradeKeys:new Set(),saveStored(){},scheduleSharedTradeStateSave(){}});vm.runInContext(['updateRecommendationHistory','isTargetHit','isStopHit','getObservedReturnPct','pickBestObservedPrice','pickWorstObservedPrice'].map(n=>fn(app,n)).join('\n'),ctx);ctx.updateRecommendationHistory([guarded({...raw,...fields})]);const entry=ctx.recommendationHistory[0];assert.ok(entry);assert.equal(entry.outcome,'pending');assert.equal(entry.targetHit,false);assert.equal(entry.stopHit,false);assert.equal(fields.action==='buy'?entry.target1:entry.stopLoss,null);}});
// Test the current application's renderer, not a copied valuation formula.
test('portfolio null quote never becomes a zero price or -100% loss',()=>{const dom=new JSDOM('<div id="portfolio-list"></div>');const ctx=appContext({portfolio:[{id:'test',symbol:'AAPL',qty:1,buyPrice:100,currency:'USD'}],portfolioList:dom.window.document.querySelector('#portfolio-list'),getRecommendationLookup:items=>new Map(items.map(x=>[x.symbol,x])),getPremiumAssetVisual:()=>({className:'',html:''}),escapeHtml:String,formatMoney:(n,c)=>String(n)+' '+c,formatPercent:n=>String(n)+'%',removePortfolioPosition(){}});vm.runInContext(fn(app,'renderPortfolio'),ctx);ctx.renderPortfolio([{symbol:'AAPL',currentPrice:null,currency:'USD'}]);assert.doesNotMatch(ctx.portfolioList.textContent,/-100|(?:^|\s)0 USD/);dom.window.close();});
for(const marketId of ['us','watchlist'])for(const boundary of ['enter','exit'])test(`${marketId} cache recomputes news ${boundary} without provider calls`,async()=>{
 const clock=Date.now;const t0=now;try{Date.now=()=>t0;
 const eventTime=boundary==='enter'?t0+75.5*60000:t0-89.5*60000;
 const calendar={dataState:'fresh',upcoming:boundary==='enter'?[{title:'TEST',currency:'USD',impact:'high',timestamp:eventTime}]:[],recent:boundary==='exit'?[{title:'TEST',currency:'USD',impact:'high',timestamp:eventTime}]:[],hotEvents:boundary==='exit'?[{title:'TEST',currency:'USD',impact:'high',timestamp:eventTime}]:[]};
 const payload={recommendations:[raw],economicCalendar:calendar,market:{id:marketId}};
 const ctx=vm.createContext({Date,applyEconomicNewsOverlayToRecommendations,cache:new Map([[marketId==='us'?'market:us':'watchlist:AAPL',{createdAt:t0,payload}]]),CACHE_TTL_MS:90000,STALE_CACHE_TTL_MS:600000,markets:{us:{}},sendJson:(_r,v)=>v,getExecutionSessionState:()=>({isOpen:true}),isAggregateMarket:()=>false,resolveCurrencyForAsset:()=> 'USD',finalizeRecommendation,buildOpportunityRadar:()=>({}),buildSmartAlerts:()=>[],buildBacktestSummary:()=>({})});
 vm.runInContext(['handleRecommendations','handleWatchlist','finalizeRecommendationsPayloadForSession','finalizeRecommendationForExecutionSession','normalizeRecommendationCurrency'].map(n=>fn(server,n)).join('\n'),ctx);
 const read=()=>marketId==='us'?ctx.handleRecommendations({},marketId):ctx.handleWatchlist({},['AAPL']);
 const first=await read();Date.now=()=>t0+60000;const next=await read();
 assert.equal(first.recommendations[0].action,boundary==='enter'?'buy':'hold');assert.equal(next.recommendations[0].action,boundary==='enter'?'hold':'buy');assert.equal(payload.recommendations[0].action,'buy');
 if(boundary==='enter'){assert.equal(next.recommendations[0].decision.kind,'hold');assert.equal(next.recommendations[0].tradePlan.action,'hold');}
 }finally{Date.now=clock;}
});

test('scalp cannot use expired frame votes or reverse a server direction',()=>{
 const ctx=appContext();vm.runInContext(fn(app,'buildScalpDecision'),ctx);
 const item=guarded();
 assert.equal(ctx.buildScalpDecision({...item,timeframes:item.timeframes.map(frame=>({...frame,latestTimestamp:(now-86400000)/1000}))}).action,'hold');
 assert.equal(ctx.buildScalpDecision({...item,action:'sell'}).action,'hold');
});
test('browser payload guard removes invalid instructions from nested radar/alerts',()=>{
 const item=guarded();const blocked={...item,executionBlocked:true};
 const out=integrity.guardDisplayPayload({recommendations:[blocked],smartAlerts:[blocked],opportunityRadar:{bestBuy:blocked}},now);
 assert.equal(out.recommendations[0].action,'hold');assert.equal(out.opportunityRadar.bestBuy.action,'hold');assert.equal(out.smartAlerts.length,0);
 assert.equal(integrity.guardDisplayPayload({recommendations:[item],cached:true},now).recommendations[0].action,'buy');
 assert.equal(integrity.canExecuteRecommendation(item,now+30*60000),false);
});
test('Sharia-only filters Home opportunities and radar without mutating holdings',()=>{
 const good={...raw,shariaStatus:'compliant',shariaVerified:true};
 const unknown={...raw,symbol:'META',shariaStatus:'unknown',shariaVerified:false};
 const claimed={...raw,symbol:'MSFT',shariaStatus:'compliant',shariaVerified:false};
 const payload={recommendations:[good,unknown,claimed],smartAlerts:[good,unknown],opportunityRadar:{bestBuy:unknown,monthly:[good,unknown]},holdings:[unknown]};
 const out=integrity.filterDiscoveryPayload(payload,true);
 assert.equal(out.recommendations.length,1);assert.equal(out.smartAlerts.length,1);assert.equal(out.opportunityRadar.bestBuy,null);assert.equal(out.opportunityRadar.monthly.length,1);
 assert.equal(out.holdings[0],unknown);assert.equal(payload.recommendations.length,3);
 assert.equal(integrity.filterDiscoveryPayload(payload,false),payload);
});
const {formatQuotePrice}=await import('../public/modules/priceFormat.js');
test('shared quote precision preserves tiny values, FX decimals and currency subunits',()=>{
 for(const locale of ['en-US','ar-KW']){
  for(const price of [.00000423,.00000455,1.12345]) assert.ok(formatQuotePrice(price,'USD',{locale}).includes(String(price)));
  assert.match(formatQuotePrice(0,'USD',{locale}),/0\.00/);
  assert.equal(formatQuotePrice(null,'USD',{locale}),'--');
  assert.match(formatQuotePrice(104.125,'USD',{locale,symbol:'JPYUSD=X'}),/104\.125/);
  assert.match(formatQuotePrice(12345,'GBp',{locale}),/12,345\.00 GBX/);
  assert.match(formatQuotePrice(.938,'KWD',{locale}),/0\.938 KWD/);
  assert.doesNotMatch(formatQuotePrice(1e-24,'USD',{locale}),/^0\.0+ /);
 }
});
test('all money formatter definitions delegate to the same quote formatter',async()=>{
 const sources=[app,await readFile(new URL('../public/detail.js',import.meta.url),'utf8'),server];
 for(const source of sources){
  const definitions=[...source.matchAll(/^(?:formatMoney = )?function format(?:Voice)?Money\([^)]*\) \{[^}]*formatQuotePrice/gm)];
  assert.ok(definitions.length>0);
 }
 const home=await readFile(new URL('../public/modules/homeDashboard.js',import.meta.url),'utf8');
 assert.match(home,/formatMoney\(item.currentPrice, item.currency/);
 assert.match(app,/formatMoney: \(\.\.\.args\) => formatMoney\(\.\.\.args\)/);
});
test('portfolio preserves cost unit and refuses cross-unit P/L; true zero profit remains valid',()=>{
 const dom=new JSDOM('<div id="portfolio-list"></div>');
 const ctx=appContext({portfolio:[{id:'test',symbol:'AZN.L',qty:1,buyPrice:100,currency:'GBX'}],portfolioList:dom.window.document.querySelector('#portfolio-list'),getRecommendationLookup:items=>new Map(items.map(x=>[x.symbol,x])),getPremiumAssetVisual:()=>({className:'',html:''}),escapeHtml:String,formatMoney:formatQuotePrice,formatPercent:n=>String(n)+'%',removePortfolioPosition(){}});
 vm.runInContext(fn(app,'renderPortfolio'),ctx);
 ctx.renderPortfolio([{symbol:'AZN.L',currentPrice:100,currency:'GBP'}]);
 assert.match(ctx.portfolioList.querySelector('.portfolio-item > div:nth-child(3)').textContent,/100.00 GBX/);
 assert.match(ctx.portfolioList.querySelector('.portfolio-item > div:nth-child(5)').textContent,/--/);
 ctx.renderPortfolio([{symbol:'AZN.L',currentPrice:100,currency:'GBX'}]);
 assert.match(ctx.portfolioList.querySelector('.portfolio-item > div:nth-child(5)').textContent,/0.00 GBX/);
 dom.window.close();
});
test('cached news exit never revives a stale quote and null confidence stays null',()=>{
 const clock=Date.now;try{Date.now=()=>now;
  const [overlaid]=applyEconomicNewsOverlayToRecommendations([{...raw,confidence:null}], 'us',{dataState:'fresh',hotEvents:[],upcoming:[{title:'TEST',currency:'USD',impact:'high',timestamp:now+60000}]});
  assert.equal(overlaid.action,'hold');assert.equal(overlaid.decision.kind,'hold');assert.equal(overlaid.confidence,null);
  const [clear]=applyEconomicNewsOverlayToRecommendations([{...raw,dataProvenance:{...raw.dataProvenance,marketTimestamp:'2026-09-11T14:00:00Z'}}],'us',{dataState:'fresh',recent:[{title:'TEST',currency:'USD',impact:'high',timestamp:now-91*60000}]});
  assert.equal(clear.economicNewsRisk.blockTrading,false);assert.equal(guarded(clear).action,'hold');
 }finally{Date.now=clock;}
});
