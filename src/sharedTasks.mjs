// Separate pending work from the result cache: eviction must not duplicate running analyses.
export function createSharedTasks({ maxEntries = 250 } = {}) {
  const tasks = new Map();
  return {
    getOrCreate(key, start) {
      if (tasks.has(key)) return tasks.get(key);
      if (tasks.size >= maxEntries) {
        const error = new Error("خدمة التحليل مشغولة، أعد المحاولة بعد قليل.");
        error.statusCode = 503;
        throw error;
      }
      const task = start();
      tasks.set(key, task);
      const cleanup = () => { if (tasks.get(key) === task) tasks.delete(key); };
      Promise.resolve(task.done).then(cleanup, cleanup);
      return task;
    },
    get size() { return tasks.size; }
  };
}
