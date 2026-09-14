import * as tradeObservation from '../public/modules/tradeObservation.js';
// Regression cases use isolated observations, never production prices.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import * as integrity from '../public/modules/marketIntegrity.js';
import * as numbers from '../public/modules/numberValue.js';
import {createVisibilityAwarePoller} from '../public/modules/polling.js';
import {finalizeRecommendation} from '../src/recommendationPolicy.mjs';
const now=Date.parse('2026-09-14T14:00:00Z');
const raw={symbol:'AAPL',name:'Test asset',currency:'USD',action:'buy',actionLabel:'Buy',currentPrice:100,confidence:80,target1:110,stopLoss:95,decision:{kind:'buy',message:'Buy now'},dataProvenance:{priceKind:'quote',marketTimestamp:new Date(now-60000).toISOString()}};
const quote=(extra={})=>finalizeRecommendation({...raw,...extra},{now,session:{isOpen:true,closeAt:new Date(now+3600000).toISOString()}});
function target(initial={}){const listeners=new Map();return {...initial,addEventListener(n,f){if(!listeners.has(n))listeners.set(n,new Set());listeners.get(n).add(f);},removeEventListener(n,f){listeners.get(n)?.delete(f);},emit(n,event={}){for(const f of [...(listeners.get(n)||[])])f(event);},count(n){return listeners.get(n)?.size||0;}};}
test('BFCache restore restarts polling once; explicit stop still disposes listeners',async()=>{
 const doc=target({hidden:false}),timers=new Map();let id=0,runs=0;const win=target({setInterval(f){timers.set(++id,f);return id;},clearInterval(id){timers.delete(id);}});
 const poller=createVisibilityAwarePoller([{name:'quotes',intervalMs:1000,run(){runs++;}}],{documentRef:doc,windowRef:win});
 poller.start();win.emit('pagehide',{persisted:true});assert.equal(timers.size,0);
 win.emit('pageshow',{persisted:true});await Promise.resolve();assert.equal(timers.size,1);assert.equal(runs,1);
 win.emit('pageshow',{persisted:true});assert.equal(timers.size,1);poller.stop();win.emit('pageshow',{persisted:true});assert.equal(timers.size,0);assert.equal(win.count('pageshow'),0);
});
test('a valid quote remains observable during a news entry block but never executable',()=>{
 const item=quote({action:'hold',executionBlocked:true,economicNewsRisk:{blockTrading:true},tradePlan:{action:'hold',executionBlocked:true}});
 assert.equal(integrity.hasCurrentPriceObservation(item,now),true);assert.equal(integrity.canExecuteRecommendation(item,now),false);
});
test('expiry removes the old Buy-now narrative and updates quote freshness',()=>{
 const out=integrity.guardRecommendationForDisplay(quote(),{now:now+30*60000});
 assert.equal(out.action,'hold');assert.doesNotMatch(out.decision.message,/Buy now/);assert.equal(out.priceFreshness.state,'stale');
});
test('client cannot execute past the server-provided session close',()=>{
 const out=quote();out.executionSession.closeAt=new Date(now-1000).toISOString();
 assert.equal(integrity.canExecuteRecommendation(out,now),false);
});
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
function fn(name){const start=app.search(new RegExp('^(?:async )?function '+name+'\\(','m'));assert.ok(start>=0,name);const rest=app.slice(start);const next=rest.slice(1).search(/\n(?:async )?function \w+\(/);return next<0?rest:rest.slice(0,next+1);}
const entry=()=>({key:'AAPL:buy',symbol:'AAPL',action:'buy',actionLabel:'Buy',currentPrice:100,entryPrice:100,currency:'USD',target1:110,stopLoss:95,outcome:'pending',firstSeen:new Date(now-3600000).toISOString(),lastSeen:new Date(now-3600000).toISOString()});
function context(history){return vm.createContext({...numbers,...integrity,...tradeObservation,recordTradeHistory:(h,i)=>tradeObservation.recordTradeHistory(h,i,now),canObserveTrade:(e,i)=>tradeObservation.canObserveTrade(e,i,now),observeTrade:(e,i)=>tradeObservation.observeTrade(e,i,now),Date:class extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}},canExecuteRecommendation:i=>integrity.canExecuteRecommendation(i,now),hasCurrentPriceObservation:i=>integrity.hasCurrentPriceObservation(i,now),recommendationHistory:history,followedTradeKeys:new Set(),saveStored(){},scheduleSharedTradeStateSave(){}});}
test('existing trade records its target even after the current recommendation becomes Hold',()=>{
 const ctx=context([entry()]);vm.runInContext(['updateRecommendationHistory','isTargetHit','isStopHit','getObservedReturnPct','pickBestObservedPrice','pickWorstObservedPrice'].map(fn).join('\n'),ctx);
 ctx.updateRecommendationHistory([quote({action:'hold',currentPrice:111})]);assert.equal(ctx.recommendationHistory[0].outcome,'target');
});
test('followed trades cannot compare pounds and pence as the same unit',()=>{
 const notifications=[];const ctx=context([{...entry(),symbol:'AZN.L',key:'AZN.L:buy',currency:'GBP'}]);ctx.followedTradeKeys.add('AZN.L:buy');ctx.notifyFollowedTrade=(_e,_c,type)=>notifications.push(type);ctx.persistSharedTradeState=()=>{};
 vm.runInContext(['checkFollowedTrades','isTargetHit','isStopHit'].map(fn).join('\n'),ctx);
 ctx.checkFollowedTrades([quote({symbol:'AZN.L',currency:'GBX',currentPrice:10000})]);assert.deepEqual(notifications,[]);
});
test('a completed target cannot later acquire a contradictory stopped-out outcome',()=>{
 const old={...entry(),outcome:'target',targetHit:true,stopHit:false,hitAt:new Date(now-120000).toISOString(),lastPrice:111};
 const ctx=context([old]);vm.runInContext(['updateRecommendationHistory','isTargetHit','isStopHit','getObservedReturnPct','pickBestObservedPrice','pickWorstObservedPrice'].map(fn).join('\n'),ctx);
 ctx.updateRecommendationHistory([quote({currentPrice:90})]);assert.equal(ctx.recommendationHistory[0].stopHit,false);assert.equal(ctx.recommendationHistory[0].lastPrice,111);
});

test('valid fresh observation updates an existing trade even when the entry guard is blocked by news',()=>{
 const current=quote({currentPrice:111,action:'hold',executionBlocked:true,economicNewsRisk:{blockTrading:true}});
 const result=tradeObservation.observeTrade(entry(),current,now);
 assert.equal(result.outcome,'target');assert.equal(result.hitAt,current.dataProvenance.marketTimestamp);
 assert.equal(integrity.canExecuteRecommendation(current,now),false);
});
test('no history outcome from old, pre-entry, same-time, future or cross-unit observations',()=>{
 const old=entry();
 for (const current of [
  quote({currency:'GBX',currentPrice:111}),
  quote({symbol:'MSFT',currentPrice:111}),
  quote({currentPrice:111,dataProvenance:{...raw.dataProvenance,marketTimestamp:new Date(now-86400000).toISOString()}}),
  quote({currentPrice:111,dataProvenance:{...raw.dataProvenance,marketTimestamp:new Date(now+86400000).toISOString()}})
 ]) assert.equal(tradeObservation.observeTrade(old,current,now),old);
 const q=quote({currentPrice:111});
 const newerEntry={...old,firstSeen:new Date(now).toISOString()};assert.equal(tradeObservation.observeTrade(newerEntry,q,now),newerEntry);
 const same={...old,lastObservationAt:q.dataProvenance.marketTimestamp};assert.equal(tradeObservation.observeTrade(same,q,now),same);
});
test('first terminal outcome is immutable in both directions and invalid geometry cannot hit',()=>{
 for(const outcome of ['target','stop']){
  const old={...entry(),outcome,targetHit:outcome==='target',stopHit:outcome==='stop'};
  assert.equal(tradeObservation.observeTrade(old,quote({currentPrice:outcome==='target'?90:120}),now),old);
 }
 const invalid={...entry(),target1:90,stopLoss:120};assert.equal(tradeObservation.observeTrade(invalid,quote(),now).outcome,'pending');
});
test('new entries are not retroactively completed by the observation used to open them',()=>{
 const result=tradeObservation.recordTradeHistory([],[quote()],now);const opened=result.get('AAPL:buy');
 assert.equal(opened.outcome,'pending');assert.equal(opened.entryObservedAt,quote().dataProvenance.marketTimestamp);
 assert.equal(tradeObservation.observeTrade(opened,quote({currentPrice:111}),now),opened);
});
test('source and display timestamps must refer to the same quote',()=>{
 const out=quote();out.priceFreshness.marketTimestamp=new Date(now).toISOString();
 assert.equal(integrity.hasCurrentPriceObservation(out,now),false);assert.equal(integrity.canExecuteRecommendation(out,now),false);
});
test('offline lifecycle invalidation is synchronous and runs independently of a stuck request',async()=>{
 const doc=target({hidden:false}),win=target({setInterval(){return 1;},clearInterval(){}});let invalidated=false,release;
 const poller=createVisibilityAwarePoller([{name:'request',intervalMs:1000,run:()=>new Promise(resolve=>{release=resolve;})}],{documentRef:doc,windowRef:win,onLifecycle:reason=>{if(reason==='offline')invalidated=true;}});
 poller.start();const request=poller.refresh('request');await Promise.resolve();win.emit('offline');assert.equal(invalidated,true);release();await request;poller.stop();
});
test('updated entrypoint dependencies are available in the offline shell',async()=>{
 const worker=await readFile(new URL('../public/service-worker.js',import.meta.url),'utf8');
 for(const name of ['marketIntegrity','polling','tradeObservation','priceFormat','homeDashboard']) assert.ok(worker.includes(`/modules/${name}.js?v=20260914-lifecycle-1`),name);
 for(const file of ['../public/app.js','../public/detail.js','../public/modules/priceFormat.js','../public/modules/tradeObservation.js']){
  const source=await readFile(new URL(file,import.meta.url),'utf8');
  assert.doesNotMatch(source,/marketIntegrity\.js\?v=20260914-issue40-1/);
 }
});
