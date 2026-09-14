import { epochSecondsToMs } from '../public/modules/marketIntegrity.js';
export function selectPriceObservation(frame, now=Date.now()) {
  const meta = frame?.meta || {};
  const quote = Number(meta.regularMarketPrice);
  const quoteMs = epochSecondsToMs(meta.regularMarketTime);
  if (Number.isFinite(quote) && quote > 0 && quoteMs !== null && quoteMs <= now+120000) {
    return { price:quote, timestamp:quoteMs/1000, priceKind:'quote', priceInterval:null };
  }
  const price = Number(frame?.closes?.at(-1));
  const ms = epochSecondsToMs(frame?.latestTimestamp);
  if (!Number.isFinite(price) || price<=0 || ms===null || ms>now+120000) throw new Error('لا توجد ملاحظة سعر موثوقة بتوقيت صالح');
  return {price,timestamp:ms/1000,priceKind:'bar-close',priceInterval:frame.id};
}
