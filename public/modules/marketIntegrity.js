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

// Browser fallback data is for observation only, never a fresh executable signal.
export function guardDisplayPayload(data) {
  if (!data || typeof data !== 'object') return data;
  const blocked = data.stale === true;
  const guard = item => {
    if (!item || typeof item !== 'object') return item;
    if (!blocked && !item.executionBlocked && !['stale','unknown'].includes(item.priceFreshness?.state)) return item;
    return {...item,setupAction:item.setupAction || item.action,action:'hold',actionLabel:'انتظار',executionBlocked:true,
      tradePlan:item.tradePlan ? {...item.tradePlan,action:'hold',executionBlocked:true} : item.tradePlan,
      decision:{...(item.decision || {}),kind:'hold',badge:'انتظار',title:'بيانات للمراقبة فقط',message:'انتظر سعراً حديثاً قبل اتخاذ قرار تنفيذ.'}};
  };
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations.map(guard) : [];
  return {...data,recommendations,smartAlerts:blocked ? [] : data.smartAlerts,
    opportunityRadar:blocked ? {} : data.opportunityRadar};
}
