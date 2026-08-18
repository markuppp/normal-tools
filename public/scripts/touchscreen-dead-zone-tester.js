(() => {
  "use strict";
  const grid = document.getElementById("touch-grid");
  if (!grid || grid.dataset.initialized === "true") return;
  grid.dataset.initialized = "true";

  const count = document.getElementById("touch-count");
  const clear = document.getElementById("touch-clear");
  const fullscreen = document.getElementById("touch-fullscreen");
  const pointerLabel = document.getElementById("touch-pointers");
  const tool = document.getElementById("touch-tool");
  const total = 240;
  const tested = new Set();
  const pointers = new Set();

  for (let index = 0; index < total; index += 1) {
    const cell = document.createElement("span");
    cell.className = "touch-cell";
    cell.dataset.index = String(index);
    grid.append(cell);
  }

  function updateLabels() {
    const rawPercent = (tested.size / total) * 100;
    const percent = rawPercent > 0 && rawPercent < 1 ? rawPercent.toFixed(1) : String(Math.round(rawPercent));
    count.textContent = percent;
    pointerLabel.textContent = `${pointers.size} active touch${pointers.size === 1 ? "" : "es"}`;
    grid.setAttribute("aria-label", `Touchscreen grid, ${percent} percent tested`);
  }

  function markAtPoint(x, y) {
    const rect = grid.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
    const columns = window.matchMedia("(max-width: 720px)").matches ? 12 : 20;
    const rows = total / columns;
    const column = Math.min(columns - 1, Math.max(0, Math.floor(((x - rect.left) / rect.width) * columns)));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(((y - rect.top) / rect.height) * rows)));
    const index = row * columns + column;
    if (!tested.has(index)) {
      tested.add(index);
      grid.children[index].classList.add("is-tested");
      updateLabels();
    }
  }

  function markInterpolated(event) {
    const events = typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];
    events.forEach((point) => markAtPoint(point.clientX, point.clientY));
  }

  grid.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pointers.add(event.pointerId);
    grid.setPointerCapture(event.pointerId);
    markInterpolated(event);
    updateLabels();
  });
  grid.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    markInterpolated(event);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
    grid.addEventListener(eventName, (event) => {
      pointers.delete(event.pointerId);
      updateLabels();
    });
  });

  clear.addEventListener("click", () => {
    tested.clear();
    grid.querySelectorAll(".is-tested").forEach((cell) => cell.classList.remove("is-tested"));
    updateLabels();
  });

  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await tool.requestFullscreen();
    } catch {
      fullscreen.textContent = "Full screen unavailable";
    }
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreen.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  });

  updateLabels();
})();
