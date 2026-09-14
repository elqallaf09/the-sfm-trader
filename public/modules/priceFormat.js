import { toNullableNumber } from './numberValue.js?v=20260914-issue40-1';
import { normalizeQuoteCurrency } from './marketIntegrity.js?v=20260914-lifecycle-1';

/** Display only: never changes the stored price or converts currency subunits. */
export function formatQuotePrice(value, currency, { locale = 'en-US', unavailable = '--', symbol = '' } = {}) {
  const number = toNullableNumber(value);
  if (number === null) return unavailable;
  const code = normalizeQuoteCurrency(currency);
  const unit = code && code !== 'PAIR' ? code : '';
  const absolute = Math.abs(number);
  const minor = ['KWD', 'BHD', 'OMR'].includes(code) ? 3 : ['JPY', 'KRW', 'KWF'].includes(code) ? 0 : 2;
  const forex = code === 'PAIR' || String(symbol).endsWith('=X');
  // Tiny prices require significant digits; fixed two/four-place rounding can
  // turn a real positive quote AND its target into the same displayed zero.
  const maximumFractionDigits = absolute > 0 && absolute < 1
    ? Math.min(20, Math.max(minor, Math.ceil(-Math.log10(absolute)) + 5))
    : forex ? (absolute >= 100 ? 3 : 5) : absolute < 10 ? Math.max(minor, 6) : minor;
  const scientific = absolute > 0 && absolute < 1e-16;
  const options = scientific
    ? { notation: 'scientific', maximumSignificantDigits: 6 }
    : { minimumFractionDigits: minor, maximumFractionDigits };
  const formatted = new Intl.NumberFormat(locale, { numberingSystem: 'latn', ...options }).format(number);
  return `${formatted}${unit ? ` ${unit}` : ''}`;
}
