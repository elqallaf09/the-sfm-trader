// Deterministic, isolated fixtures. No live quotes, accounts, or broker orders.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {fixture} from './fixtures/home-v3.mjs';
import {finalizeRecommendation} from '../src/recommendationPolicy.mjs';
const base=process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173';
const out='.artifacts/deep-audit/async-selection';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[],failures=[],errors=[];
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};
async function within(promise,label) {let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' timed out')),10000);})]);}finally{clearTimeout(timer);}}
function quote(symbol,price=100) {
 const now=Date.now();return finalizeRecommendation({...structuredClone(fixture.recommendations[0]),symbol,name:'TEST ONLY '+symbol,currency:'USD',currentPrice:price,target1:price*1.1,expectedPrice:price*1.1,stopLoss:price*.95,
  action:'buy',actionLabel:'شراء',executionBlocked:false,marketClosed:false,marketState:'REGULAR',dataHealth:{score:80},expectedMovePct:2,
  dataProvenance:{priceKind:'quote',marketTimestamp:new Date(now-60000).toISOString(),retrievedAt:new Date(now).toISOString()},
  timeframes:[{id:'1m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000},{id:'15m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000}]},
  {now,session:{isOpen:true,closeAt:new Date(now+3600000).toISOString()}});
}
async function scenario(width,name,fn,{empty=false,watchlist=['AAPL']}={}) {
 const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
 await context.addInitScript(list=>{localStorage.setItem('the-sfm-trader-watchlist',JSON.stringify(list));localStorage.setItem('the-sfm-trader-settings',JSON.stringify({language:'ar'}));},watchlist);
 const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',error=>errors.push({width,name,message:error.message}));
 const gates=[],requests=[];const state={empty,assetMismatch:false,price:100};
 function hold(predicate,override) {const seen=deferred(),released=deferred(),done=deferred();const gate={predicate,override,used:false,seen,released,done};gates.push(gate);return gate;}
 await page.route('**/api/**',async route=>{
  const url=new URL(route.request().url());requests.push(url.pathname+url.search);
  const reply=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  const gate=gates.find(g=>!g.used&&g.predicate(url));
  if(gate){gate.used=true;gate.seen.resolve();await gate.released.promise;}
  try {
   if(gate?.override)return await reply(gate.override);
   if(url.pathname==='/api/markets')return await reply({markets:[{id:'us',label:'US Market',count:2},{id:'crypto',label:'Crypto',count:1}]});
   if(url.pathname==='/api/recommendations'||url.pathname==='/api/watchlist') {
    const watch=url.pathname==='/api/watchlist';const market=watch?'watchlist':url.searchParams.get('market')||'us';
    const symbols=watch?(url.searchParams.get('symbols')||'').split(',').filter(Boolean):market==='crypto'?['BTC-USD']:['AAPL','MSFT'];
    return await reply({...structuredClone(fixture),generatedAt:new Date().toISOString(),market:{id:market,label:market==='watchlist'?'قائمة المراقبة':market,totalSymbols:state.empty?0:symbols.length},
      recommendations:state.empty?[]:symbols.map(s=>quote(s,state.price)),smartAlerts:[],opportunityRadar:{},economicCalendar:{dataState:'empty',upcoming:[],recent:[],hotEvents:[]}});
   }
   if(url.pathname==='/api/asset')return await reply({recommendation:quote(state.assetMismatch?'WRONG':url.searchParams.get('symbol')),market:fixture.market,profile:{}});
   if(url.pathname==='/api/instruments')return await reply({instruments:[{symbol:'AAPL',name:'Apple',nameAr:'أبل',currency:'USD'},{symbol:'MSFT',name:'Microsoft',nameAr:'مايكروسوفت',currency:'USD'}]});
   if(url.pathname==='/api/economic-calendar')return await reply({dataState:'empty',upcoming:[],recent:[],hotEvents:[]});
   if(url.pathname==='/api/market-news')return await reply({dataState:'empty',articles:[]});
   if(url.pathname==='/api/followed-trades')return await reply({followedEntries:[],followedTradeKeys:[],followedTradeAlerts:[],removedFollowedTradeKeys:[]});
   if(url.pathname==='/api/notifications')return await reply({notifications:[]});
   if(url.pathname==='/api/ollama-status')return await reply({enabled:false,connected:false});
   return await reply({accepted:true});
  } catch(error) {if(!gate)throw error;} // Canceled gates are expected to be unfulfillable.
  finally{gate?.done.resolve();}
 });
 const navigate=async view=>{
  if(width<1024&&view!=='home') {await page.locator('#mobile-more-button').click();await page.locator(`[data-mobile-view="${view}"]`).click();}
  else await page.evaluate(view=>{location.hash='#view-'+view;},view);
  await page.waitForFunction(view=>document.body.dataset.appView===view,view);
 };
 const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 try {
  await page.goto(base+'/?skipIntro=1',{waitUntil:'domcontentloaded'});
  await page.locator(`#terminal-home-v3[data-ui-state="${empty?'empty':'fresh'}"]`).waitFor({state:'visible'});
  await page.evaluate(()=>{const mark=document.createElement('div');mark.textContent='TEST FIXTURES — NOT LIVE MARKET PRICES';mark.style.cssText='position:fixed;bottom:84px;left:4px;z-index:999999;background:white;color:black;font:11px sans-serif;padding:4px;pointer-events:none';document.body.append(mark);});
  await fn({page,context,navigate,hold,settle,requests,state});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No horizontal overflow');
  checks.push({width,name});console.log('PASS async-selection',width,name);
  await page.screenshot({path:`${out}/${width}-${name}.png`});
 } catch(error) {failures.push({width,name,message:error.message});console.error('FAIL async-selection',width,name,error.message);await page.screenshot({path:`${out}/failure-${width}-${name}.png`}).catch(()=>{});}
 finally{for(const gate of gates)gate.released.resolve();await context.close();}
}
try {
 for(const width of [1440,390]) {
  await scenario(width,'latest-scalp',async({page,navigate,hold,settle})=>{
   await navigate('scalp');const gate=hold(u=>u.pathname==='/api/asset'&&u.searchParams.get('symbol')==='AAPL');
   await page.locator('#scalp-symbol').fill('AAPL');await page.locator('#scalp-submit').click();await within(gate.seen.promise,"request gate");
   await page.locator('#scalp-symbol').fill('MSFT');await page.locator('#scalp-submit').click();
   await page.waitForFunction(()=>document.querySelector('.scalp-symbol-block strong')?.textContent==='MSFT');
   gate.released.resolve();await within(gate.done.promise,"completed gate");await settle();
   assert.equal(await page.locator('.scalp-symbol-block strong').innerText(),'MSFT');
   assert.equal(await page.locator('#scalp-submit').isEnabled(),true);
  });
  await scenario(width,'mismatched-scalp',async({page,navigate,state})=>{
   await navigate('scalp');state.assetMismatch=true;
   await page.locator('#scalp-symbol').fill('AAPL');await page.locator('#scalp-submit').click();
   await page.waitForFunction(()=>document.querySelector('#scalp-result').textContent.includes('لا يطابق'));
   assert.equal(await page.locator('.scalp-card').count(),0);
  });
  await scenario(width,'watchlist-edit',async({page,navigate,hold,settle})=>{
   await navigate('watchlist');await page.locator('#watchlist-cards [data-symbol="AAPL"]').waitFor({state:'visible'});
   const gate=hold(u=>u.pathname==='/api/watchlist'&&(u.searchParams.get('symbols')||'').includes('MSFT'));
   await page.locator('#watchlist-symbol').fill('MSFT');await page.locator('#watchlist-form button[type="submit"]').click();await within(gate.seen.promise,"request gate");
   await page.locator('[data-remove-watchlist="AAPL"]').click();
   await page.locator('#watchlist-cards [data-symbol="MSFT"]').waitFor({state:'visible'});
   gate.released.resolve();await within(gate.done.promise,"completed gate");await settle();
   assert.equal(await page.locator('#watchlist-cards [data-symbol="AAPL"]').count(),0);
   assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('the-sfm-trader-watchlist'))),['MSFT']);
   await page.reload();await navigate('watchlist');await page.locator('#watchlist-cards [data-symbol="MSFT"]').waitFor({state:'visible'});
   assert.equal(await page.locator('[data-remove-watchlist="AAPL"]').count(),0);
  });
  await scenario(width,'empty-watchlist-only',async({page,navigate,hold,requests,settle})=>{
   await navigate('watchlist');await page.locator('#watchlist-cards [data-symbol="AAPL"]').waitFor({state:'visible'});
   const gate=hold(u=>u.pathname==='/api/watchlist'&&(u.searchParams.get('symbols')||'').includes('MSFT'));
   await page.locator('#watchlist-symbol').fill('MSFT');await page.locator('#watchlist-form button[type="submit"]').click();await within(gate.seen.promise,"request gate");
   await page.locator('[data-remove-watchlist="AAPL"]').click();await page.locator('[data-remove-watchlist="MSFT"]').click();
   await page.locator('#watchlist-only-toggle').check();gate.released.resolve();await within(gate.done.promise,"completed gate");await settle();
   assert.equal(await page.locator('#watchlist-cards [data-symbol]').count(),0);
   const before=requests.filter(u=>u.startsWith('/api/recommendations')).length;
   await navigate('home');await page.locator('#refresh-button').click();await settle();
   assert.equal(requests.filter(u=>u.startsWith('/api/recommendations')).length,before);
   assert.equal(await page.locator('#v3-opportunity-grid [data-symbol]').count(),0);
   assert.equal(await page.locator('#connection-status').getAttribute('data-connection-state'),'empty');
  });
  await scenario(width,'context-grace',async({page,navigate,hold,settle})=>{
   await navigate('watchlist');await page.locator('#watchlist-cards [data-symbol="AAPL"]').waitFor({state:'visible'});
   const gate=hold(u=>u.pathname==='/api/recommendations'&&u.searchParams.get('market')==='crypto');
   // Both genuine change handlers run in one task, well inside the 600ms grace.
   await Promise.all([page.waitForRequest(r=>r.url().includes('/api/watchlist?')),page.evaluate(()=>{
    document.querySelector('.market-button[data-market="crypto"]').click();
    const toggle=document.getElementById('watchlist-only-toggle');toggle.checked=true;toggle.dispatchEvent(new Event('change',{bubbles:true}));
   })]);
   gate.released.resolve();await settle();await navigate('home');
   await page.locator('.v3-opportunity-card[data-symbol="AAPL"]').waitFor({state:'visible'});
   assert.equal(await page.locator('.v3-opportunity-card[data-symbol="BTC-USD"]').count(),0);
  });
  await scenario(width,'literal-MS',async({page,navigate,requests})=>{
   await navigate('watchlist');await page.locator('#watchlist-symbol').fill('MS');await page.locator('#watchlist-form button[type="submit"]').click();
   await page.locator('#watchlist-cards [data-symbol="MS"]').waitFor({state:'visible'});
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('the-sfm-trader-watchlist')));assert.ok(stored.includes('MS'));assert.ok(!stored.includes('MSFT'));
   await navigate('scalp');await page.locator('#scalp-symbol').fill('MS');await page.locator('#scalp-submit').click();
   await page.waitForFunction(()=>document.querySelector('.scalp-symbol-block strong')?.textContent==='MS');
   assert.ok(requests.includes('/api/asset?symbol=MS'));
  });
  for(const action of ['dismiss','cancel-submit','edit-submit'])await scenario(width,'search-'+action,async({page,hold,settle})=>{
   const gate=hold(u=>u.pathname==='/api/instruments');const input=page.locator('#terminal-symbol-search');
   await input.fill('AAPL');await within(gate.seen.promise,"request gate");
   if(action!=='dismiss')await input.press('Enter');
   if(action==='edit-submit')await input.fill('MSFT');else await input.press('Escape');
   const finished=page.waitForEvent('requestfinished',{predicate:r=>new URL(r.url()).pathname==='/api/instruments'});
   gate.released.resolve();await finished;await settle();
   assert.equal(new URL(page.url()).pathname,'/');
   if(action==='edit-submit') {
    await page.locator('.instrument-search-option').filter({hasText:'MSFT'}).waitFor({state:'visible'});
    await input.press('Enter');await page.waitForURL('**/detail.html?**');assert.equal(new URL(page.url()).searchParams.get('symbol'),'MSFT');
   } else assert.equal(await page.locator('.instrument-search-popup').isVisible(),false);
  });
  await scenario(width,'empty-AI-metrics',async({page,navigate})=>{
   await navigate('ai');const panel=page.locator('#command-center-grid');await panel.waitFor({state:'visible'});
   assert.equal(await panel.locator('.command-smart-alerts .command-number-row b').innerText(),'0');
   assert.equal(await panel.locator('.command-performance-value').first().innerText(),'--');
   assert.equal(await panel.locator('.command-performance .command-performance-value').innerText(),'--');
   assert.equal(await panel.locator('.command-mini-chart,.command-gauge').count(),0);
   assert.doesNotMatch(await panel.innerText(),/38%|1\.42%|Portfolio exposure|Today/);
  },{empty:true,watchlist:[]});
 }
}finally{await browser.close();await writeFile(out+'/report.json',JSON.stringify({scope:'Isolated deferred-response fixtures, no live price or deployment certification',checks,failures,errors},null,2));}
assert.deepEqual(errors,[],'Unhandled asynchronous UI errors');assert.deepEqual(failures,[],'Async selection regressions');
console.log('Async selection regression passed:',checks.length,'scenario groups');
