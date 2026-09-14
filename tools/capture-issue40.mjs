// Isolated regression data: not imported by the app and never a live-price test.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
import { fixture } from './fixtures/home-v3.mjs';
import { finalizeRecommendation } from '../src/recommendationPolicy.mjs';
const baseUrl=process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173';
const out='.artifacts/deep-audit/issue40';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[],failures=[],errors=[];
async function check(name,page,fn){try{await fn();checks.push(name);console.log('PASS',name);}catch(error){failures.push({name,message:error.message});await page.screenshot({path:out+'/failure-'+failures.length+'.png'});console.error('FAIL',name,error.message);}}
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',error=>errors.push({width,error:error.message}));
  let mode='normal',assetCase='closed';
  const makeItem=(symbol='META')=>{
   const now=Date.now();const item={...structuredClone(fixture.recommendations[0]),symbol,currentPrice:100,target1:110,expectedPrice:110,stopLoss:95,action:'buy',actionLabel:'شراء',shariaStatus:'unknown',shariaVerified:false,
    tradePlan:{action:'buy'},decision:{kind:'buy'},dataProvenance:{priceKind:'quote',marketTimestamp:new Date(now-60000).toISOString(),retrievedAt:new Date(now).toISOString()},timeframes:[{id:'1m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000},{id:'15m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now-60000)/1000}]};
   if(mode==='small'){item.symbol='SHIB-USD';item.currentPrice=.00000423;item.target1=.00000455;item.expectedPrice=.00000455;}
   if(mode==='null')item.currentPrice=null;
   if(mode==='missing-target'){item.symbol='TSLA';item.target1=null;item.expectedPrice=null;}
   if(mode==='missing-stop'){item.symbol='MSFT';item.action='sell';item.actionLabel='بيع';item.target1=90;item.expectedPrice=90;item.stopLoss=null;}
   return item;
  };
  await page.route('**/api/**',async route=>{
   const u=new URL(route.request().url());const reply=data=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   if(['/api/recommendations','/api/watchlist'].includes(u.pathname)){
    const first=finalizeRecommendation(makeItem(),{session:{isOpen:true}});
    const good=finalizeRecommendation({...makeItem('AAPL'),shariaStatus:'compliant',shariaVerified:true},{session:{isOpen:true}});
    return reply({...structuredClone(fixture),market:{...fixture.market,id:u.pathname==="/api/watchlist"?"watchlist":fixture.market.id},generatedAt:new Date().toISOString(),recommendations:mode==='normal'?[first,good]:[first],smartAlerts:[],opportunityRadar:{},economicCalendar:{dataState:'empty',upcoming:[],hotEvents:[],recent:[]}});
   }
   if(u.pathname==='/api/asset'){
    const item=makeItem(u.searchParams.get('symbol'));let session={isOpen:true};
    if(mode!=='small'){
     if(assetCase==='closed')session={isOpen:false};
     if(assetCase==='unknown')session=null;
     if(assetCase==='missing')delete item.dataProvenance;
     if(assetCase==='stale')item.dataProvenance.marketTimestamp=new Date(Date.now()-86400000).toISOString();
     if(assetCase==='hold')item.action='hold';
     if(assetCase==='news')item.economicNewsRisk={blockTrading:true};
    }
    return reply({recommendation:finalizeRecommendation(item,{session}),profile:{},market:fixture.market});
   }
   if(u.pathname==='/api/markets')return reply({markets:[{id:'us',label:'US Market',count:2}]});
   if(u.pathname==='/api/economic-calendar')return reply({dataState:'empty',upcoming:[],hotEvents:[],recent:[]});
   if(u.pathname==='/api/market-news')return reply({dataState:'empty',articles:[]});
   if(u.pathname==='/api/notifications')return reply({notifications:[]});
   if(u.pathname==='/api/followed-trades')return reply({followedEntries:[],followedTradeKeys:[],followedTradeAlerts:[],removedFollowedTradeKeys:[]});
   if(u.pathname==='/api/ollama-status')return reply({enabled:false,connected:false});
   return reply({accepted:true});
  });
  await page.goto(baseUrl+'/?skipIntro=1',{waitUntil:'domcontentloaded'});
  await page.locator('.v3-opportunity-card[data-symbol="META"]').waitFor({state:'visible'});
  await page.evaluate(()=>{const p=document.createElement('p');p.textContent='TEST FIXTURES — NOT LIVE MARKET PRICES';p.style.cssText='position:fixed;bottom:80px;left:4px;z-index:999999;background:white;color:black;font:11px sans-serif;padding:4px;pointer-events:none';document.body.append(p);});
  const navigate=async view=>{
   if(width<1024&&view!=='home'){await page.locator('#mobile-more-button').click();await page.locator('[data-mobile-view="'+view+'"]').click();}
   else await page.evaluate(v=>{location.hash='#view-'+v;},view);
   await page.waitForFunction(v=>document.body.dataset.appView===v,view);
  };
  const refresh=async()=>{await navigate('home');await Promise.all([page.waitForResponse(r=>r.url().includes('/api/recommendations')&&r.status()===200),page.locator('#refresh-button').click()]);};
  await check(width+' Sharia preference filters Home and heatmap but preserves verified items',page,async()=>{
   await page.locator('#settings-button').click();await page.locator('#settings-sharia-only').check();await page.locator('#settings-save-button').click();
   await page.waitForFunction(()=>!document.querySelector('.v3-opportunity-card[data-symbol="META"]'));
   assert.equal(await page.locator('.v3-heat-item[data-symbol="META"]').count(),0);
   assert.equal(await page.locator('.v3-opportunity-card[data-symbol="AAPL"]').count(),1);
   await page.screenshot({path:out+'/sharia-'+width+'.png'});
   await page.locator('#settings-button').click();await page.locator('#settings-sharia-only').uncheck();await page.locator('#settings-save-button').click();
  });
  await navigate('scalp');
  for(const blocked of ['closed','stale','missing','unknown','hold','news','fresh'])await check(width+' scalp '+blocked,page,async()=>{
   assetCase=blocked;await page.locator('#scalp-symbol').fill('META');await page.locator('#scalp-submit').click();
   await page.locator('.scalp-card').waitFor({state:'visible'});
   const text=await page.locator('.scalp-card').innerText();
   if(blocked==='fresh')assert.match(text,/اشتر الآن/);
   else{assert.doesNotMatch(text,/اشتر الآن|بيع الآن/);assert.ok(await page.locator('.scalp-action-hold').count());}
   if(blocked==='closed')await page.screenshot({path:out+'/scalp-block-'+width+'.png',fullPage:true});
  });
  await check(width+' portfolio missing price remains unavailable, not -100%',page,async()=>{
   mode='null';await refresh();await navigate('portfolio');
   await page.locator('#portfolio-symbol').fill('META');await page.locator('#portfolio-qty').fill('1');await page.locator('#portfolio-price').fill('100');await page.locator('#portfolio-currency').fill('USD');await page.locator('#portfolio-form button[type="submit"]').click();
   const row=page.locator('.portfolio-item').first();await row.waitFor({state:'visible'});
   assert.match(await row.locator(':scope > div').nth(3).innerText(),/--/);assert.match(await row.locator(':scope > div').nth(4).innerText(),/--/);
   assert.doesNotMatch(await row.innerText(),/-100|100\.00-/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   const positions=await page.evaluate(()=>JSON.parse(localStorage.getItem('the-sfm-trader-portfolio')));assert.equal(positions[0].currency,'USD');
   await page.screenshot({path:out+'/portfolio-null-'+width+'.png',fullPage:true});
  });
  for(const scenario of ['missing-target','missing-stop'])await check(width+' history '+scenario,page,async()=>{
   mode=scenario;await refresh();const symbol=mode==='missing-target'?'TSLA':'MSFT';
   await page.waitForFunction(symbol=>JSON.parse(localStorage.getItem('the-sfm-trader-history')||'[]').some(x=>x.symbol===symbol),symbol);
   const entry=await page.evaluate(symbol=>JSON.parse(localStorage.getItem('the-sfm-trader-history')).find(x=>x.symbol===symbol),symbol);
   assert.equal(entry.outcome,'pending');assert.equal(entry.targetHit,false);assert.equal(entry.stopHit,false);
  });
  await check(width+' tiny price and target preserved in Home and detail, both languages',page,async()=>{
   mode='small';await refresh();const card=page.locator('.v3-opportunity-card[data-symbol="SHIB-USD"]').first();await card.waitFor({state:'visible'});
   for(let lang=0;lang<2;lang++){
    const text=await card.innerText();assert.match(text,/0\.00000423/);assert.match(text,/0\.00000455/);
    await page.locator('#language-quick-toggle').click();
   }
   await page.screenshot({path:out+'/small-price-'+width+'.png'});
   await card.click();await page.waitForURL('**/detail.html?**');
   await page.waitForFunction(()=>document.querySelector('#detail-current-price')?.textContent.includes('0.00000423'));
   assert.match(await page.locator('#detail-target-one').innerText(),/0\.00000455/);
   await page.screenshot({path:out+'/detail-small-'+width+'.png'});
  });
  await context.close();
 }
}finally{await browser.close();await writeFile(out+'/report.json',JSON.stringify({scope:'Issue40 regression tests using isolated synthetic fixtures',checks,failures,errors},null,2));}
assert.deepEqual(errors,[],'Unhandled browser errors');assert.deepEqual(failures,[],'Issue40 browser regressions');
console.log('Issue40 browser regression passed:',checks.length,'scenario groups');
