export function initMarketBackground(options = {}) {
  const windowRef = options.windowRef || window;
  const documentRef = options.documentRef || document;
  const canvas = options.canvas || documentRef.querySelector("#market-bg");
  const context = canvas?.getContext?.("2d");
  if (!canvas || !context) return { stop() {} };

  const reducedMotion = windowRef.matchMedia?.("(prefers-reduced-motion: reduce)");
  let animationFrame = 0;
  let resizeFrame = 0;
  let stopped = false;
  const rows = Array.from({ length: 8 }, (_, index) => ({
    y: 80 + index * 92,
    phase: Math.random() * 100,
    speed: 0.35 + Math.random() * 0.45,
    color: index % 3 === 0 ? "53, 194, 164" : index % 3 === 1 ? "255, 107, 107" : "90, 167, 255"
  }));

  function resize() {
    const dpr = Math.min(2, windowRef.devicePixelRatio || 1);
    canvas.width = Math.floor(windowRef.innerWidth * dpr);
    canvas.height = Math.floor(windowRef.innerHeight * dpr);
    canvas.style.width = `${windowRef.innerWidth}px`;
    canvas.style.height = `${windowRef.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    animationFrame = 0;
    if (stopped || documentRef.hidden || reducedMotion?.matches) return;
    context.clearRect(0, 0, windowRef.innerWidth, windowRef.innerHeight);
    drawGrid(context, windowRef.innerWidth, windowRef.innerHeight);
    for (const row of rows) {
      row.phase += row.speed;
      drawMarketLine(context, row, windowRef.innerWidth, windowRef.innerHeight);
      drawCandles(context, row, windowRef.innerWidth, windowRef.innerHeight);
    }
    animationFrame = windowRef.requestAnimationFrame(frame);
  }

  function scheduleResize() {
    if (resizeFrame || stopped) return;
    resizeFrame = windowRef.requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
    });
  }

  function syncAnimation() {
    if (stopped || documentRef.hidden || reducedMotion?.matches) {
      if (animationFrame) windowRef.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      context.clearRect(0, 0, windowRef.innerWidth, windowRef.innerHeight);
      return;
    }
    if (!animationFrame) animationFrame = windowRef.requestAnimationFrame(frame);
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    if (animationFrame) windowRef.cancelAnimationFrame(animationFrame);
    if (resizeFrame) windowRef.cancelAnimationFrame(resizeFrame);
    windowRef.removeEventListener("resize", scheduleResize);
    windowRef.removeEventListener("pagehide", stop);
    documentRef.removeEventListener("visibilitychange", syncAnimation);
    reducedMotion?.removeEventListener?.("change", syncAnimation);
  }

  windowRef.addEventListener("resize", scheduleResize, { passive: true });
  documentRef.addEventListener("visibilitychange", syncAnimation);
  reducedMotion?.addEventListener?.("change", syncAnimation);
  windowRef.addEventListener("pagehide", stop, { once: true });
  resize();
  syncAnimation();
  return { stop };
}

function drawGrid(context, width, height) {
  context.strokeStyle = "rgba(135, 154, 172, 0.055)";
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 72) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y < height; y += 72) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function drawMarketLine(context, row, width, height) {
  context.strokeStyle = `rgba(${row.color}, 0.22)`;
  context.lineWidth = 1.5;
  context.beginPath();
  for (let x = -20; x <= width + 20; x += 18) {
    const wave = Math.sin((x + row.phase * 3) * 0.012) * 18 + Math.cos((x - row.phase) * 0.027) * 9;
    const y = (row.y + row.phase * 0.12 + wave) % (height + 120);
    if (x === -20) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function drawCandles(context, row, width, height) {
  for (let x = ((row.phase * 7) % 90) - 90; x < width + 90; x += 90) {
    const mid = (row.y + Math.sin((x + row.phase) * 0.02) * 20) % (height + 120);
    const candleHeight = 18 + Math.abs(Math.sin((x + row.phase) * 0.04)) * 34;
    const up = Math.sin((x + row.phase) * 0.03) > 0;
    context.strokeStyle = up ? "rgba(101, 217, 141, 0.24)" : "rgba(255, 107, 107, 0.2)";
    context.fillStyle = up ? "rgba(101, 217, 141, 0.12)" : "rgba(255, 107, 107, 0.1)";
    context.beginPath();
    context.moveTo(x, mid - candleHeight * 0.65);
    context.lineTo(x, mid + candleHeight * 0.65);
    context.stroke();
    context.fillRect(x - 5, mid - candleHeight * 0.28, 10, candleHeight * 0.56);
  }
}
