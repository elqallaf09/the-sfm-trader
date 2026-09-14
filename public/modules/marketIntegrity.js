// Shared data-unit contract. Never convert a price by changing its currency label.
export function normalizeQuoteCurrency(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (raw === 'GBp' || /^(gbpence|pence)$/i.test(raw)) return 'GBX';
  const code = raw.toUpperCase();
  if (['MIXED', 'GCC', 'UNKNOWN'].includes(code)) return '';
  return /^[A-Z]{3}$/.test(code) || code === 'PAIR' ? code : '';
}

export function inferQuoteCurrency(symbol) {
  const value = String(symbol || '').trim().toUpperCase();
  if (value.endsWith('=X')) return 'PAIR';
  if (value.endsWith('-USD')) return 'USD';
  const suffix = value.match(/\.[A-Z]+$/)?.[0];
  const codes = {'.KW':'KWD','.SR':'SAR','.AE':'AED','.AD':'AED','.DU':'AED',
    '.QA':'QAR','.BH':'BHD','.OM':'OMR','.SW':'CHF','.HK':'HKD','.KS':'KRW',
    '.KQ':'KRW','.T':'JPY','.AS':'EUR','.DE':'EUR','.PA':'EUR'};
  // London may quote in GBP, GBX or another currency. A suffix cannot prove units.
  if (suffix) return codes[suffix] || '';
  if (['GC=F','SI=F','CL=F','BZ=F','NG=F','PL=F'].includes(value)) return 'USD';
  if (/^[A-Z]{1,5}$/.test(value)) return 'USD';
  return '';
}

export function resolveQuoteCurrency(symbol, providerCurrency, fallback = '') {
  const supplied = normalizeQuoteCurrency(providerCurrency);
  if (supplied) return supplied;
  if (String(symbol || '').toUpperCase().endsWith('.L')) return '';
  return inferQuoteCurrency(symbol) || normalizeQuoteCurrency(fallback);
}

export function epochSecondsToMs(value) {
  if (!['number','string'].includes(typeof value) || String(value).trim() === '') return null;
  const seconds = Number(value);
  const ms = seconds * 1000;
  return Number.isFinite(ms) && seconds > 0 && ms <= 8.64e15 ? ms : null;
}

export function isoTimestampMs(value) {
  if (typeof value !== 'string' || !/T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) && ms > 0 ? ms : null;
}

// Browser fallback data is for observation only, never an executable signal.
export function guardRecommendationForDisplay(item, { stale = false, now = Date.now() } = {}) {
  if (!item || typeof item !== 'object') return item;
  const blocked = stale || item.executionBlocked || item.marketClosed || item.stalePriceBlocked
    || item.economicNewsRisk?.blockTrading || item.tradePlan?.executionBlocked
    || ['stale','unknown','closed'].includes(item.priceFreshness?.state)
    || (['buy','sell'].includes(item.action) && !canExecuteRecommendation(item, now));
  if (!blocked) return item;
  const message = stale ? 'اتصال متقطع؛ هذه بيانات محفوظة للمراقبة فقط.'
    : item.decision?.message || 'انتظر سعراً حديثاً وقرار تنفيذ موثوقاً من السيرفر.';
  return {...item, setupAction:item.setupAction || item.action, action:'hold', actionLabel:'انتظار', executionBlocked:true,
    tradePlan:item.tradePlan ? {...item.tradePlan,action:'hold',executionBlocked:true} : item.tradePlan,
    decision:{...(item.decision || {}),kind:'hold',badge:'انتظار',title:'بيانات للمراقبة فقط',message,summary:message}};
}

export function guardDisplayPayload(data, now = Date.now()) {
  if (!data || typeof data !== 'object') return data;
  const stale = data.stale === true;
  const guard = item => guardRecommendationForDisplay(item, { stale, now });
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations.map(guard) : [];
  const radar = value => {
    if (Array.isArray(value)) return value.map(radar);
    if (!value || typeof value !== 'object') return value;
    if (value.symbol) return guard(value);
    return Object.fromEntries(Object.entries(value).map(([key,nested])=>[key,radar(nested)]));
  };
  return {...data,recommendations,
    smartAlerts:stale ? [] : (data.smartAlerts || []).filter(item=>canExecuteRecommendation(item,now)),
    opportunityRadar:stale ? {} : radar(data.opportunityRadar)};
}

export function hasCurrentPriceObservation(item, now = Date.now()) {
  if (!item || item.executionBlocked || item.marketClosed || item.stalePriceBlocked
      || item.stale || item.economicNewsRisk?.blockTrading || item.tradePlan?.executionBlocked) return false;
  if (item.executionSession?.isOpen !== true || item.priceFreshness?.state !== 'current') return false;
  const value = item.currentPrice;
  const price = (typeof value === 'number' || (typeof value === 'string' && value.trim())) ? Number(value) : NaN;
  const timestamp = isoTimestampMs(item.priceFreshness.marketTimestamp || item.dataProvenance?.marketTimestamp);
  const maxAge = Number(item.priceFreshness.maxAgeSeconds);
  return Number.isFinite(price) && price > 0 && timestamp !== null && timestamp <= now + 120000
    && Number.isFinite(maxAge) && maxAge > 0 && now - timestamp <= maxAge * 1000;
}

// A derived view may downgrade the server decision, never upgrade Hold to Buy/Sell.
export function canExecuteRecommendation(item, now = Date.now()) {
  return ['buy', 'sell'].includes(item?.action) && hasCurrentPriceObservation(item, now);
}

export function isVerifiedShariaItem(item) {
  return item?.shariaStatus === 'compliant' && item.shariaVerified === true;
}

// Apply preferences only to discovery surfaces, never to saved holdings/history.
export function filterDiscoveryPayload(data, shariaOnly = false) {
  if (!shariaOnly || !data || typeof data !== 'object') return data;
  const filter = value => {
    if (Array.isArray(value)) return value.filter(item => !item?.symbol || isVerifiedShariaItem(item)).map(filter);
    if (!value || typeof value !== 'object') return value;
    if (value.symbol) return isVerifiedShariaItem(value) ? value : null;
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, filter(nested)]));
  };
  return { ...data, recommendations: (data.recommendations || []).filter(isVerifiedShariaItem),
    smartAlerts: filter(data.smartAlerts), opportunityRadar: filter(data.opportunityRadar) };
}
