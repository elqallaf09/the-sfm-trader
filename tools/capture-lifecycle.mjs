// Isolated test fixtures. No market provider, broker order or user account is used.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {fixture} from './fixtures/home-v3.mjs';
import {finalizeRecommendation} from '../src/recommendationPolicy.mjs';
const base=process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173';
const out=process.env.LIFECYCLE_ARTIFACT_DIR || '.artifacts/deep-audit/lifecycle';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[],failures=[],errors=[];
const t0=Date.parse('2026-09-14T14:00:00Z');
async function scenario(width,name,run,{detail=false,english=false,failAsset=false}={}) {
 const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
 const page=await context.newPage();await page.clock.setFixedTime(new Date(t0));
 page.setDefaultTimeout(10000);
 page.on('pageerror',error=>errors.push({width,name,message:error.message}));
 if(english)await context.addInitScript(()=>localStorage.setItem('the-sfm-trader-settings',JSON.stringify({language:'en'})));
 const state={hang:false,failAsset,requests:0};const waiting=[];
 const item=()=>finalizeRecommendation({...structuredClone(fixture.recommendations[0]),symbol:'AAPL',name:'TEST ONLY asset',currency:'USD',currentPrice:100,target1:110,expectedPrice:110,stopLoss:95,action:'buy',actionLabel:'شراء',executionBlocked:false,marketClosed:false,marketState:'REGULAR',decision:{kind:'buy',title:'Buy',message:'Buy now',badge:'Buy'},dataHealth:{score:90},timeframeConsensus:{},economicNewsRisk:{blockTrading:false},dataProvenance:{priceKind:'quote',marketTimestamp:new Date(t0-60000).toISOString(),retrievedAt:new Date(t0).toISOString()},timeframes:[{id:'1m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(t0-60000)/1000},{id:'15m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(t0-60000)/1000}]},{now:t0,session:{isOpen:true,closeAt:new Date(t0+3600000).toISOString()}});
 await page.route('**/api/**',async route=>{
  const url=new URL(route.request().url());
  const respond=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  if(['/api/recommendations','/api/watchlist','/api/asset'].includes(url.pathname)){
   if(url.pathname==='/api/recommendations')state.requests++;
   if(state.hang){await new Promise(resolve=>waiting.push(resolve));return route.abort().catch(()=>{});}
   if(url.pathname==='/api/asset')return state.failAsset?respond({error:'TEST ONLY temporary outage'},503):respond({recommendation:item(),profile:{},market:fixture.market});
   return respond({...structuredClone(fixture),generatedAt:new Date(t0).toISOString(),recommendations:[item()]});
  }
  if(url.pathname==='/api/markets')return respond({markets:[{id:'us',label:'US Market',count:1}]});
  if(url.pathname==='/api/market-news')return respond({dataState:'empty',articles:[]});
  if(url.pathname==='/api/economic-calendar')return respond({dataState:'empty',upcoming:[],recent:[],hotEvents:[]});
  if(url.pathname==='/api/followed-trades')return respond({followedEntries:[],followedTradeKeys:[],followedTradeAlerts:[],removedFollowedTradeKeys:[]});
  if(url.pathname==='/api/notifications')return respond({notifications:[]});
  if(url.pathname==='/api/ollama-status')return respond({enabled:false,connected:false});
  return respond({accepted:true,instruments:[]});
 });
 try{
  await page.goto(base+(detail?'/detail.html?symbol=AAPL':'/?skipIntro=1'),{waitUntil:'domcontentloaded'});
  if(!failAsset)await page.locator(detail?'#detail-action.action-buy':'.v3-opportunity-card[data-symbol="AAPL"]').waitFor({state:'visible'});
  await page.evaluate(()=>{const mark=document.createElement('div');mark.textContent='TEST FIXTURES — NOT LIVE MARKET PRICES';mark.style.cssText='position:fixed;bottom:84px;left:4px;z-index:999999;background:#fff;color:#111;font:11px sans-serif;padding:4px';document.body.append(mark);});
  await run({page,context,state});
  checks.push({width,name});console.log('PASS lifecycle',width,name);
  await page.screenshot({path:`${out}/${width}-${name}.png`,fullPage:false});
 }catch(error){failures.push({width,name,message:error.message});console.error('FAIL lifecycle',width,name,error.message);await page.screenshot({path:`${out}/failure-${width}-${name}.png`}).catch(()=>{});}
 finally{waiting.forEach(resolve=>resolve());await context.close();}
}
try{
 for(const width of [1440,390]){
  await scenario(width,'idle-expiry',async({page,state})=>{
   assert.equal(await page.locator('#v3-buy-count').innerText(),'1');state.hang=true;
   await page.clock.setFixedTime(new Date(t0+30*60000));
   await page.waitForFunction(()=>document.querySelector('#v3-buy-count').textContent==='0',null,{timeout:9000});
   assert.equal(await page.locator('#connection-status').getAttribute('data-connection-state'),'stale');
   assert.equal(await page.locator('#terminal-home-v3').getAttribute('data-ui-state'),'stale');
  });
  await scenario(width,'scalp-expiry',async({page,state})=>{
   if(width<1024){await page.locator('#mobile-more-button').click();await page.locator('[data-mobile-view="scalp"]').click();}
   else await page.evaluate(()=>{location.hash='#view-scalp';});
   await page.locator('#scalp-symbol').fill('AAPL');await page.locator('#scalp-submit').click();
   await page.locator('.scalp-action-buy').waitFor({state:'visible'});state.hang=true;
   await page.clock.setFixedTime(new Date(t0+11*60000));
   await page.locator('.scalp-action-hold').waitFor({state:'visible',timeout:9000});
   assert.doesNotMatch(await page.locator('.scalp-card').innerText(),/اشتر الآن|Buy now/);
   assert.equal((await page.locator('.scalp-metrics > div:nth-child(2) strong').innerText()).trim(),'--');
  });
  await scenario(width,'detail-expiry',async({page,state})=>{
   state.hang=true;await page.clock.setFixedTime(new Date(t0+30*60000));
   await page.locator('#detail-action.action-hold').waitFor({state:'visible',timeout:9000});
   assert.doesNotMatch(await page.locator('#decision-message').innerText(),/Buy now|اشتر الآن/);
   assert.equal(await page.locator('#detail-status').getAttribute('data-connection-state'),'stale');
  },{detail:true,english:true});
  await scenario(width,'offline-home',async({page,context})=>{
   await context.setOffline(true);
   await page.waitForFunction(()=>document.querySelector('#v3-buy-count').textContent==='0',null,{timeout:2000});
   assert.equal(await page.locator('#connection-status').getAttribute('data-connection-state'),'offline');
  });
  await scenario(width,'offline-detail',async({page,context})=>{
   await context.setOffline(true);await page.locator('#detail-action.action-hold').waitFor({state:'visible',timeout:2000});
   assert.equal(await page.locator('#detail-status').getAttribute('data-connection-state'),'offline');
  },{detail:true});
  await scenario(width,'detail-retry',async({page,state})=>{
   await page.locator('[data-ui-state-action="retry-detail"]').waitFor({state:'visible'});state.failAsset=false;
   await page.locator('[data-ui-state-action="retry-detail"]').click();await page.locator('#detail-action.action-buy').waitFor({state:'visible'});
   assert.equal(await page.locator('#detail-error').count(),0);
   assert.match(await page.locator('#detail-symbol').innerText(),/AAPL/);
  },{detail:true,failAsset:true});
  await scenario(width,'resume-polling',async({page,state})=>{
   const before=state.requests;
   // Deterministic lifecycle delivery, not an assertion of device BFCache eligibility.
   await Promise.all([page.waitForResponse(response=>response.url().includes('/api/recommendations'),{timeout:5000}), page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));})]);
   assert.ok(state.requests>before);
   await page.locator('.v3-opportunity-card[data-symbol="AAPL"]').click();await page.waitForURL('**/detail.html?**');
   await page.locator('.detail-back').click();await page.waitForURL('**/?skipIntro=1**');
   await page.locator('#terminal-home-v3').waitFor({state:'visible'});
  });
 }
}finally{await browser.close();await writeFile(out+'/report.json',JSON.stringify({scope:'Isolated fixtures, wall-clock expiry and deterministic persisted lifecycle events; no production/deployment certification',checks,failures,errors},null,2));}
assert.deepEqual(errors,[],'Unhandled lifecycle browser errors');assert.deepEqual(failures,[],'Lifecycle regressions');
