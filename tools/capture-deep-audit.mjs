import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { fixture } from './fixtures/home-v3.mjs';
const base=process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173';
const out='.artifacts/deep-audit'; await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[],failures=[],errors=[],modalDiagnostics=[];
async function check(name,fn,page){try{await fn();checks.push(name);console.log('PASS',name);}catch(error){failures.push({name,message:error.message});console.error('FAIL',name,error.message);if(page)await page.screenshot({path:out+'/failure-'+failures.length+'.png'});}}
async function waitView(page,view){await page.waitForFunction(v=>document.body.dataset.appView===v,view,{timeout:10000});}
async function waitHome(page,state='fresh'){await page.locator('#terminal-home-v3[data-ui-state="'+state+'"]').waitFor({state:'visible',timeout:20000});}
async function setup(width){
 const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
 const page=await context.newPage();const state={mode:'fresh',requests:0};
 page.on('pageerror',err=>errors.push(err.message));
 await page.route('**/api/**',async route=>{
  const url=new URL(route.request().url());
  const respond=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  if(url.pathname==='/api/recommendations'){
   state.requests++;
   if(state.mode==='offline')return respond({error:'TEST ONLY outage'},503);
   const data=structuredClone(fixture);data.generatedAt=new Date().toISOString();data.stale=state.mode==='stale';data.cached=state.mode==='cached';
   if(state.mode==='currency'){data.recommendations[0]={...data.recommendations[0],symbol:'AZN.L',currency:'GBX'};}
   return respond(data);
  }
  if(url.pathname==='/api/markets')return respond({markets:[{id:'us',label:'US Market',count:8},{id:'crypto',label:'Crypto',count:0}]});
  if(url.pathname==='/api/asset')return respond({recommendation:fixture.recommendations.find(x=>x.symbol===url.searchParams.get('symbol')) || fixture.recommendations[0],profile:{},market:fixture.market});
  if(url.pathname==='/api/watchlist')return respond({...fixture,market:{...fixture.market,id:'watchlist'}});
  if(url.pathname==='/api/market-news')return respond({dataState:'empty',articles:[]});
  if(url.pathname==='/api/economic-calendar')return respond({dataState:'empty',upcoming:[],recent:[],hotEvents:[]});
  if(url.pathname==='/api/followed-trades')return respond({followedEntries:[],followedTradeKeys:[],followedTradeAlerts:[],removedFollowedTradeKeys:[]});
  if(url.pathname==='/api/notifications')return respond({notifications:[]});
  if(url.pathname==='/api/ollama-status')return respond({enabled:false,connected:false});
  if(url.pathname==='/api/telemetry/web-vitals')return respond({accepted:true});
  return route.continue();
 });
 await page.goto(base+'/?skipIntro=1',{waitUntil:'domcontentloaded'});await waitHome(page);
 return {page,context,state};
}
try{
 for(const width of [1440,390]){
  const {page,context,state}=await setup(width);
  const prefix=width+'px '; const navigate=async view=>{
   if(width<1024){await page.locator('#mobile-more-button').click();await page.locator('[data-mobile-view="'+view+'"]').click();}
   else {await page.evaluate(v=>{location.hash='#view-'+v;},view);}
   await waitView(page,view);
  };
  await check(prefix+'all secondary routes and browser Back',async()=>{
   for(const view of ['watchlist','portfolio','history','news','calendar','ai','education','voice','scalp']){
    await navigate(view);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,view+' overflow');
    await page.goBack();await waitView(page,'home');
   }
  },page);
  await page.goto(base+'/?skipIntro=1#view-markets');await waitView(page,'markets');
  await check(prefix+'alerts preserve underlying route and Escape restores it',async()=>{
   if(width<1024){await page.locator('#mobile-more-button').click();await page.locator('[data-mobile-view="alerts"]').click();}
   else await page.locator('.rail-link[data-nav-key="alerts"]').click();
   await page.locator('#notification-panel').waitFor({state:'visible'});
   assert.equal(await page.evaluate(()=>document.body.dataset.appView),'markets');
   await page.keyboard.press('Escape');await page.locator('#notification-panel').waitFor({state:'hidden'});
   assert.equal(new URL(page.url()).hash,'#view-markets');
  },page);
  await page.goto(base+'/?skipIntro=1');await waitHome(page);
  await check(prefix+'rapid modal opening owns focus before immediate Escape',async()=>{
   for(let cycle=0;cycle<10;cycle++) {
    for(const [trigger,panel,initialFocus] of [
     ['#notification-button','#notification-panel','notification-close-button'],
     ['#settings-button','#settings-panel','settings-display-name']
    ]) {
     await page.locator(trigger).click();
     assert.equal(await page.evaluate(()=>document.activeElement?.id),initialFocus);
     await page.keyboard.press('Escape');
     await page.locator(panel).waitFor({state:'hidden'});
     assert.equal(await page.evaluate(()=>document.activeElement?.id),trigger.slice(1));
    }
   }
   // Opening and the first keydown in one task must not depend on a zero-delay timer.
   const immediate=await page.evaluate(()=>{
    const trigger=document.getElementById('notification-button'); trigger.click();
    const focused=document.activeElement?.id;
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
    return {focused,closed:document.getElementById('notification-panel').hidden};
   });
   assert.deepEqual(immediate,{focused:'notification-close-button',closed:true});
  },page);
  await check(prefix+'preferences persist after save and reload',async()=>{
   await page.locator('#settings-button').click();
   await page.locator('#settings-notify-sound').uncheck();await page.locator('#settings-notify-target').uncheck();
   await page.locator('#settings-sharia-only').check();await page.locator('#settings-analysis-mode').selectOption('swing');
   await page.locator('#settings-save-button').click();await page.reload();await waitHome(page);
   await page.locator('#settings-button').click();
   assert.equal(await page.locator('#settings-notify-sound').isChecked(),false);
   assert.equal(await page.locator('#settings-notify-target').isChecked(),false);
   assert.equal(await page.locator('#settings-sharia-only').isChecked(),true);
   assert.equal(await page.locator('#settings-analysis-mode').inputValue(),'swing');
   await page.locator('#settings-sharia-only').uncheck();await page.locator('#settings-analysis-mode').selectOption('balanced');await page.locator('#settings-save-button').click();
  },page);
  await check(prefix+'provider currency survives all frontend overrides',async()=>{
   state.mode='currency';await page.locator('#refresh-button').click();
   const card=page.locator('.v3-opportunity-card[data-symbol="AZN.L"]');await card.waitFor({state:'visible'});
   assert.match(await card.innerText(),/GBX/);assert.doesNotMatch(await card.innerText(),/EUR|GBP/);
  },page);
  await check(prefix+'stale fallback cannot show a Buy/Sell execution badge',async()=>{
   state.mode='stale';await page.locator('#refresh-button').click();await waitHome(page,'stale');
   assert.equal(await page.locator('#v3-buy-count').innerText(),'0');assert.equal(await page.locator('#v3-sell-count').innerText(),'0');
  },page);
  await check(prefix+'a fresh cached API response is not mislabeled stale',async()=>{
   state.mode='cached';await page.locator('#refresh-button').click();await waitHome(page,'fresh');
   assert.equal(await page.locator('#connection-status').getAttribute('data-connection-state'),'fresh');
  },page);
  await check(prefix+'offline fallback stays read-only and recovers',async()=>{
   state.mode='offline';await page.locator('#refresh-button').click();await waitHome(page,'stale');
   assert.equal(await page.locator('#v3-buy-count').innerText(),'0');
   state.mode='fresh';await page.locator('#refresh-button').click();await waitHome(page,'fresh');
  },page);
  await check(prefix+'deep-linked notification opens and closes without blank view',async()=>{
   await page.goto(base+'/?skipIntro=1#notification-panel');await page.locator('#notification-panel').waitFor({state:'visible'});
   const before=await page.evaluate(()=>({focus:document.activeElement?.id||document.activeElement?.tagName,hash:location.hash,hidden:document.getElementById('notification-panel').hidden}));
   await page.keyboard.press('Escape');await waitHome(page);
   const after=await page.evaluate(()=>({focus:document.activeElement?.id||document.activeElement?.tagName,hash:location.hash,hidden:document.getElementById('notification-panel').hidden}));
   modalDiagnostics.push({width,path:'same-document fragment',before,after});
   assert.equal(after.hidden,true,'Escape closes the deep-linked panel');
   assert.equal(new URL(page.url()).hash,'#view-home');
  },page);
  await check(prefix+'cold document notification link owns a working Escape dismissal',async()=>{
   await page.goto(base+'/?skipIntro=1&modal-cold='+width+'#notification-panel');
   await page.locator('#notification-panel').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.locator('#notification-panel').waitFor({state:'hidden'});
   await waitHome(page);assert.equal(new URL(page.url()).hash,'#view-home');
  },page);
  await page.evaluate(()=>{const badge=document.createElement('p');badge.textContent='TEST FIXTURES — NOT LIVE MARKET PRICES';badge.style.cssText='position:fixed;bottom:85px;left:5px;z-index:999999;background:#fff;color:#111;padding:3px;font:10px sans-serif';document.body.append(badge);});
  await page.screenshot({path:out+'/home-'+width+'.png',fullPage:false});
  if(width<1024){await page.locator('#mobile-more-button').click();await page.screenshot({path:out+'/mobile-navigation.png'});}
  await context.close();
 }
}finally{
 await browser.close();
 await writeFile(out+'/report.json',JSON.stringify({scope:'Isolated test fixtures; no production-price comparison',checks,failures,errors,modalDiagnostics},null,2));
}
assert.deepEqual(errors,[],'Unhandled browser exceptions');
assert.deepEqual(failures,[],'Deep interaction failures');
console.log('Deep audit passed',checks.length,'scenario groups.');

// Issue #40 adds assertions for defects reproduced after the initial deep audit.
await import("./capture-issue40.mjs");

await import("./capture-lifecycle.mjs");
