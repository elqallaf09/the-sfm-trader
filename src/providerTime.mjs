// Provider wall-clock timestamps need an explicit source timezone, not server TZ.
export function parseProviderTimestamp(value, timeZone) {
  const text = String(value || '').trim();
  if (/T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(text)) return Math.floor(Date.parse(text) / 1000);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match || !timeZone) return NaN;
  const [, y, m, d, h='0', min='0', sec='0'] = match;
  const target = [y,m,d,h,min,sec].map(Number);
  const wall = Date.UTC(target[0],target[1]-1,target[2],target[3],target[4],target[5]);
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {timeZone, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    const parts = ms => Object.fromEntries(formatter.formatToParts(ms).map(p=>[p.type,p.value]));
    let instant = wall;
    for (let i=0;i<3;i++) {
      const p = parts(instant);
      const local = Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
      instant += wall-local;
    }
    const p = parts(instant);
    if ([+p.year,+p.month,+p.day,+p.hour,+p.minute,+p.second].some((n,i)=>n!==target[i])) return NaN;
    return Math.floor(instant/1000);
  } catch { return NaN; }
}
