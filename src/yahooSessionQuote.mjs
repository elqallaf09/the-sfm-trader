// Yahoo's chartPreviousClose is the start of the requested range, NOT necessarily
// yesterday's close. Only use daily bars from an earlier exchange-local session.
const finite = value => (typeof value === 'number' || (typeof value === 'string' && value.trim()))
  && Number.isFinite(Number(value)) ? Number(value) : null;
const positive = value => { const n = finite(value); return n !== null && n > 0 ? n : null; };
function sessionDay(seconds, meta) {
  const n = positive(seconds);
  if (n === null || n * 1000 > 8.64e15) return null;
  try {
    if (typeof meta.exchangeTimezoneName === 'string' && meta.exchangeTimezoneName) {
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: meta.exchangeTimezoneName,
        year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(n * 1000));
      return ['year', 'month', 'day'].map(key => parts.find(part => part.type === key)?.value).join('-');
    }
    const offset = finite(meta.gmtoffset);
    // Without a session timezone we cannot safely classify overnight bars.
    return offset === null ? null : new Date((n + offset) * 1000).toISOString().slice(0, 10);
  } catch { return null; }
}
export function resolveYahooSessionQuote(meta = {}, timestamps = [], quote = {}, interval = '1d') {
  const price = positive(meta.regularMarketPrice);
  const time = positive(meta.regularMarketTime);
  const day = sessionDay(time, meta);
  const rows = interval === '1d' && day ? timestamps.map((stamp, index) => ({
    stamp: positive(stamp), day: sessionDay(stamp, meta), close: positive(quote.close?.[index]),
    volume: finite(quote.volume?.[index]),
  })).filter(row => row.stamp !== null && time !== null && row.stamp <= time && row.day && row.close !== null)
    .sort((a, b) => a.stamp - b.stamp) : [];
  const prior = rows.filter(row => row.day < day).at(-1);
  const current = rows.filter(row => row.day === day).at(-1);
  const previousClose = positive(meta.previousClose) ?? prior?.close ?? null;
  const sourceVolume = finite(meta.regularMarketVolume);
  const volume = time !== null && sourceVolume !== null && sourceVolume >= 0 ? sourceVolume
    : current?.volume !== null && current?.volume !== undefined && current.volume >= 0 ? current.volume : null;
  const change = price !== null && previousClose !== null ? price - previousClose : null;
  const explicitChange = finite(meta.regularMarketChangePercent);
  const changePercent = change !== null ? change / previousClose * 100 : explicitChange;
  const asOf = time !== null && time * 1000 <= 8.64e15 ? new Date(time * 1000).toISOString() : null;
  return { price, previousClose, change, changePercent: price !== null ? changePercent : null,
    volume, volumeAsOf: volume !== null ? asOf : null, asOf,
    previousCloseSource: positive(meta.previousClose) !== null ? 'provider_previous_close' : prior ? 'previous_daily_session' : null };
}
