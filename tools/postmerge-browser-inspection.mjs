// Inspection-only synthetic scenarios. Not imported by the production app.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fixture } from './fixtures/home-v3.mjs';
import { finalizeRecommendation } from '../src/recommendationPolicy.mjs';
const out='.artifacts/postmerge-inspection'; await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const observations=[],errors=[];
const record=(name,width,actual,expected,confirmed)=>{observations.push({name,width,actual,expected,confirmed});console.log(JSON.stringify(observations.at(-1)));};
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage(); page.on('pageerror',e=>errors.push({width,error:e.message}));
  let mode='normal';
  const now=()=>Date.now();
  const base=()=>({...structuredClone(fixture.recommendations[0]),symbol:'META',currentPrice:100,target1:110,expectedPrice:110,action:'buy',actionLabel:'شراء',shariaStatus:'unknown',shariaVerified:false,dataProvenance:{priceKind:'quote',freshness:'current',marketTimestamp:new Date(now()-60000).toISOString()},timeframes:[{id:'1m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now()-60000)/1000},{id:'15m',action:'buy',actionLabel:'شراء',confidence:82,latestTimestamp:(now()-60000)/1000}]});
  await page.route('**/api/**',async route=>{
   const u=new URL(route.request().url());const respond=x=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(x)});
   if(u.pathname==='/api/recommendations'||u.pathname==='/api/watchlist'){
    const item=base();if(mode==='null-price')item.currentPrice=null;
    if(mode==='small-price'){item.symbol='SHIB-USD';item.name='TEST ONLY small-price asset';item.currentPrice=.00000423;item.target1=.00000455;item.expectedPrice=.00000455;}
    return respond({...structuredClone(fixture),generatedAt:new Date().toISOString(),recommendations:[item],economicCalendar:{dataState:'empty',upcoming:[],hotEvents:[],recent:[]}});
   }
   if(u.pathname==='/api/asset')return respond({recommendation:finalizeRecommendation({...base(),marketState:'CLOSED'},{session:{isOpen:false}}),profile:{},market:fixture.market});
   if(u.pathname==='/api/markets')return respond({markets:[{id:'us',label:'US Market',count:1}]});
   if(u.pathname==='/api/economic-calendar')return respond({dataState:'empty',upcoming:[],hotEvents:[],recent:[]});
   if(u.pathname==='/api/market-news')return respond({dataState:'empty',articles:[]});
   if(u.pathname==='/api/notifications')return respond({notifications:[]});
   if(u.pathname==='/api/followed-trades')return respond({followedEntries:[],followedTradeKeys:[],followedTradeAlerts:[],removedFollowedTradeKeys:[]});
   if(u.pathname==='/api/ollama-status')return respond({enabled:false,connected:false});
   return respond({accepted:true});
  });
  await page.goto('http://127.0.0.1:4173/?skipIntro=1',{waitUntil:'domcontentloaded'});
  await page.locator('.v3-opportunity-card[data-symbol="META"]').waitFor({state:'visible'});
  await page.evaluate(()=>{const p=document.createElement('p');p.id='test-watermark';p.textContent='TEST FIXTURES — NOT LIVE MARKET PRICES';p.style.cssText='position:fixed;bottom:80px;left:4px;z-index:999999;background:white;color:black;font:11px sans-serif;padding:4px';document.body.append(p);});
  const navigate=async v=>{
   if(width<1024&&v!=='home'){await page.locator('#mobile-more-button').click();await page.locator('[data-mobile-view="'+v+'"]').click();}
   else await page.evaluate(v=>{location.hash='#view-'+v;},v);
   await page.waitForFunction(v=>document.body.dataset.appView===v,v);
  };
  await page.locator('#settings-button').click();await page.locator('#settings-sharia-only').check();await page.locator('#settings-save-button').click();
  const cards=await page.locator('.v3-opportunity-card[data-symbol="META"]').count();
  record('Sharia-only preference on Home',width,{unverifiedCards:cards},'No unverified opportunity cards',cards>0);
  await page.screenshot({path:out+'/sharia-filter-'+width+'.png'});
  await page.locator('#settings-button').click();await page.locator('#settings-sharia-only').uncheck();await page.locator('#settings-save-button').click();
  await navigate('scalp');await page.locator('#scalp-symbol').fill('META');await page.locator('#scalp-submit').click();
  await page.locator('.scalp-card').waitFor({state:'visible'});const scalpText=await page.locator('.scalp-card').innerText();
  record('Closed-session scalping guard',width,scalpText,'Hold; no Buy now when server executionBlocked=true',scalpText.includes('اشتر الآن'));
  await page.screenshot({path:out+'/scalp-block-'+width+'.png',fullPage:true});
  // Mobile secondary screens hide the global refresh action. Return to Home
  // through the existing router; never force-click invisible controls.
  await navigate('home'); mode='null-price';
  await Promise.all([page.waitForResponse(r=>r.url().includes('/api/recommendations')&&r.status()===200),page.locator('#refresh-button').click()]);
  await navigate('portfolio');await page.locator('#portfolio-symbol').fill('META');await page.locator('#portfolio-qty').fill('1');await page.locator('#portfolio-price').fill('100');await page.locator('#portfolio-form button[type="submit"]').click();
  await page.locator('.portfolio-item').first().waitFor({state:'visible'});const portfolioText=await page.locator('.portfolio-item').first().innerText();
  record('Missing portfolio quote',width,portfolioText,'Unavailable quote and P/L, not -100%',portfolioText.includes('-100')||portfolioText.includes('100.00-'));
  await page.screenshot({path:out+'/portfolio-null-'+width+'.png',fullPage:true});
  mode='small-price';await navigate('home');
  await page.locator('#refresh-button').click();const small=page.locator('.v3-opportunity-card[data-symbol="SHIB-USD"]');await small.waitFor({state:'visible'});
  const smallText=await small.innerText();record('Small quote precision',width,smallText,'Preserve positive 0.00000423 quote',smallText.includes('0.000')&&!smallText.includes('0.00000423'));
  await page.screenshot({path:out+'/small-price-'+width+'.png'});
  await context.close();
 }
} finally {
 await browser.close();await writeFile(out+'/report.json',JSON.stringify({revision:'3e7d206395fe19df439ef278f577342706198848',scope:'Inspection observations with isolated fixtures; no production price verification',observations,errors},null,2));
}
if(errors.length) process.exitCode=1;
