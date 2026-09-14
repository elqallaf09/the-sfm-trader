import { isoTimestampMs } from '../public/modules/marketIntegrity.js';
export function normalizeShariaEvidence(data, symbol, now=Date.now()) {
  const unknown = {shariaStatus:'unknown',shariaLabel:'غير متحقق',shariaSource:'',shariaCheckedAt:null,shariaVerified:false};
  if (!data || typeof data !== 'object') return unknown;
  const returnedSymbol = String(data.symbol || data.ticker || '').trim().toUpperCase();
  const checkedAt = data.checkedAt || data.updatedAt;
  const date = typeof checkedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(checkedAt) ? checkedAt+'T00:00:00Z' : checkedAt;
  const ms = isoTimestampMs(date);
  const source = typeof (data.source || data.provider) === 'string' ? (data.source || data.provider).trim() : '';
  if (returnedSymbol !== String(symbol).toUpperCase() || !source || ms===null || ms>now+120000 || now-ms>90*86400000) return unknown;
  const raw = String(data.status || data.shariaStatus || data.compliance || data.result || '').toLowerCase();
  const pass = data.compliant===true || ['compliant','halal','pass','passed'].includes(raw);
  const fail = data.compliant===false || ['not_compliant','non_compliant','non-compliant','haram','fail','failed'].includes(raw);
  if (pass && fail) return unknown;
  const status = pass ? 'compliant' : fail ? 'not_compliant' : ['doubtful','questionable','mixed','review'].includes(raw) ? 'doubtful' : 'unknown';
  if (status==='unknown') return unknown;
  const labels = {compliant:'مطابق للشريعة',not_compliant:'غير مطابق للشريعة',doubtful:'يحتاج مراجعة شرعية'};
  return {shariaStatus:status,shariaLabel:labels[status],shariaSource:source.slice(0,200),shariaCheckedAt:checkedAt,shariaVerified:true};
}
