export function createVisibilityAwarePoller(tasks, { documentRef = document, windowRef = window } = {}) {
  const timers = new Map();
  const inFlight = new Map();
  let listening = false;

  function run(task, reason) {
    if (documentRef.hidden && reason !== "manual") return;
    if (inFlight.has(task.name)) return inFlight.get(task.name);
    const pending = Promise.resolve()
      .then(() => task.run({ reason }))
      .catch((error) => {
        console.warn("Background refresh failed", { task: task.name, reason, message: error?.message || String(error) });
      })
      .finally(() => {
        if (inFlight.get(task.name) === pending) inFlight.delete(task.name);
      });
    inFlight.set(task.name, pending);
    return pending;
  }

  function attachListeners() {
    if (listening) return;
    documentRef.addEventListener("visibilitychange", handleVisibilityChange);
    windowRef.addEventListener("pagehide", stop);
    listening = true;
  }

  function detachListeners() {
    if (!listening) return;
    documentRef.removeEventListener("visibilitychange", handleVisibilityChange);
    windowRef.removeEventListener("pagehide", stop);
    listening = false;
  }

  function start() {
    attachListeners();
    for (const task of tasks) {
      if (timers.has(task.name)) continue;
      if (!Number.isFinite(task.intervalMs) || task.intervalMs <= 0) continue;
      timers.set(task.name, windowRef.setInterval(() => run(task, "interval"), task.intervalMs));
    }
  }

  function stop() {
    for (const timer of timers.values()) windowRef.clearInterval(timer);
    timers.clear();
    detachListeners();
  }

  function handleVisibilityChange() {
    if (documentRef.hidden) return;
    for (const task of tasks) {
      if (task.refreshOnForeground !== false) run(task, "foreground");
    }
  }

  attachListeners();

  return {
    start,
    stop,
    refresh(name) {
      const task = tasks.find((item) => item.name === name);
      return task ? run(task, "manual") : undefined;
    }
  };
}
