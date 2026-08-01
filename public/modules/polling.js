export function createVisibilityAwarePoller(tasks, { documentRef = document, windowRef = window } = {}) {
  const timers = new Map();

  function run(task, reason) {
    if (documentRef.hidden && reason !== "manual") return;
    return Promise.resolve(task.run({ reason })).catch((error) => {
      console.warn("Background refresh failed", { task: task.name, reason, message: error?.message || String(error) });
    });
  }

  function start() {
    for (const task of tasks) {
      if (timers.has(task.name)) continue;
      timers.set(task.name, windowRef.setInterval(() => run(task, "interval"), task.intervalMs));
    }
  }

  function stop() {
    for (const timer of timers.values()) windowRef.clearInterval(timer);
    timers.clear();
  }

  function handleVisibilityChange() {
    if (documentRef.hidden) return;
    for (const task of tasks) {
      if (task.refreshOnForeground !== false) run(task, "foreground");
    }
  }

  documentRef.addEventListener("visibilitychange", handleVisibilityChange);
  windowRef.addEventListener("pagehide", stop, { once: true });

  return {
    start,
    stop,
    refresh(name) {
      const task = tasks.find((item) => item.name === name);
      return task ? run(task, "manual") : undefined;
    }
  };
}
