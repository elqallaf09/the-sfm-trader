export function createVisibilityAwarePoller(tasks, { documentRef = document, windowRef = window, onLifecycle = () => {} } = {}) {
  const timers = new Map();
  const inFlight = new Map();
  let listening = false;
  let active = false;
  let suspended = false;

  function lifecycle(reason) {
    try { onLifecycle(reason); }
    catch (error) { console.warn('Lifecycle update failed', { reason, message: error?.message }); }
  }

  function run(task, reason) {
    if (!active || suspended || (documentRef.hidden && reason !== 'manual')) return;
    if (inFlight.has(task.name)) return inFlight.get(task.name);
    const pending = Promise.resolve()
      .then(() => active && !suspended ? task.run({ reason }) : undefined)
      .catch((error) => {
        console.warn('Background refresh failed', { task: task.name, reason, message: error?.message || String(error) });
      })
      .finally(() => {
        if (inFlight.get(task.name) === pending) inFlight.delete(task.name);
      });
    inFlight.set(task.name, pending);
    return pending;
  }

  function attachListeners() {
    if (listening) return;
    documentRef.addEventListener('visibilitychange', handleVisibilityChange);
    windowRef.addEventListener('pagehide', handlePageHide);
    windowRef.addEventListener('pageshow', handlePageShow);
    windowRef.addEventListener('offline', handleOffline);
    windowRef.addEventListener('online', handleOnline);
    listening = true;
  }

  function clearTimers() {
    for (const timer of timers.values()) windowRef.clearInterval(timer);
    timers.clear();
  }

  function startTimers() {
    for (const task of tasks) {
      if (timers.has(task.name) || !Number.isFinite(task.intervalMs) || task.intervalMs <= 0) continue;
      timers.set(task.name, windowRef.setInterval(() => run(task, 'interval'), task.intervalMs));
    }
  }

  function start() {
    active = true;
    suspended = false;
    attachListeners();
    startTimers();
  }

  function stop() {
    active = false;
    suspended = false;
    clearTimers();
    if (!listening) return;
    documentRef.removeEventListener('visibilitychange', handleVisibilityChange);
    windowRef.removeEventListener('pagehide', handlePageHide);
    windowRef.removeEventListener('pageshow', handlePageShow);
    windowRef.removeEventListener('offline', handleOffline);
    windowRef.removeEventListener('online', handleOnline);
    listening = false;
  }

  function refreshForeground(reason) {
    lifecycle(reason); // Revalidate displayed data before starting network work.
    for (const task of tasks) if (task.refreshOnForeground !== false) run(task, reason);
  }

  function handleVisibilityChange() {
    if (!documentRef.hidden && !suspended) refreshForeground('foreground');
  }
  function handlePageHide(event) {
    lifecycle('pagehide');
    if (event.persisted) { suspended = true; clearTimers(); }
    else stop();
  }
  function handlePageShow(event) {
    if (!active || !event.persisted) return;
    suspended = false;
    startTimers();
    refreshForeground('resume');
  }
  function handleOffline() { lifecycle('offline'); }
  function handleOnline() { if (!suspended) refreshForeground('online'); }

  return {
    start,
    stop,
    refresh(name) {
      const task = tasks.find((item) => item.name === name);
      return task ? run(task, 'manual') : undefined;
    }
  };
}
