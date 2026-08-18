(() => {
  "use strict";
  const root = document.getElementById("gamepad-active");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const empty = document.getElementById("gamepad-empty");
  const status = document.getElementById("gamepad-status");
  const statusDot = document.getElementById("gamepad-status-dot");
  const name = document.getElementById("gamepad-name");
  const buttons = document.getElementById("gamepad-buttons");
  const axes = document.getElementById("gamepad-axes");
  const buttonNames = ["A / Cross", "B / Circle", "X / Square", "Y / Triangle", "LB", "RB", "LT", "RT", "Select", "Start", "L3", "R3", "D-pad up", "D-pad down", "D-pad left", "D-pad right", "Home"];
  let activeIndex = null;
  let lastShape = "";

  function getGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (activeIndex !== null && pads[activeIndex]) return pads[activeIndex];
    return Array.from(pads).find(Boolean) || null;
  }

  function setConnected(pad) {
    activeIndex = pad.index;
    empty.hidden = true;
    root.hidden = false;
    status.textContent = "Connected";
    statusDot.classList.add("connected");
    name.textContent = pad.id || `Controller ${pad.index + 1}`;
  }

  function setDisconnected() {
    activeIndex = null;
    empty.hidden = false;
    root.hidden = true;
    status.textContent = "Waiting";
    statusDot.classList.remove("connected");
    lastShape = "";
  }

  function buildReadout(pad) {
    const shape = `${pad.buttons.length}:${pad.axes.length}`;
    if (shape === lastShape) return;
    lastShape = shape;
    buttons.replaceChildren(...pad.buttons.map((_, index) => {
      const cell = document.createElement("div");
      cell.className = "button-cell";
      cell.dataset.buttonIndex = String(index);
      const label = document.createElement("span");
      label.textContent = buttonNames[index] || `Button ${index}`;
      const value = document.createElement("span");
      value.className = "button-value";
      value.textContent = "0.00";
      cell.append(label, value);
      return cell;
    }));
    axes.replaceChildren(...pad.axes.map((_, index) => {
      const row = document.createElement("div");
      row.className = "axis-row";
      row.dataset.axisIndex = String(index);
      const label = document.createElement("span");
      label.textContent = `Axis ${index}`;
      const track = document.createElement("span");
      track.className = "axis-track";
      const marker = document.createElement("span");
      marker.className = "axis-marker";
      marker.style.left = "50%";
      track.append(marker);
      const value = document.createElement("span");
      value.className = "axis-value";
      value.textContent = "0.000";
      row.append(label, track, value);
      return row;
    }));
  }

  function update(pad) {
    buildReadout(pad);
    pad.buttons.forEach((button, index) => {
      const cell = buttons.querySelector(`[data-button-index="${index}"]`);
      if (!cell) return;
      cell.classList.toggle("is-pressed", button.pressed || button.value > 0.12);
      cell.querySelector(".button-value").textContent = button.value.toFixed(2);
    });
    pad.axes.forEach((axis, index) => {
      const row = axes.querySelector(`[data-axis-index="${index}"]`);
      if (!row) return;
      const safeValue = Math.max(-1, Math.min(1, axis));
      row.querySelector(".axis-marker").style.left = `${(safeValue + 1) * 50}%`;
      row.querySelector(".axis-value").textContent = safeValue.toFixed(3);
    });
  }

  function tick() {
    const pad = getGamepad();
    if (pad) {
      if (root.hidden) setConnected(pad);
      update(pad);
    } else if (!root.hidden) {
      setDisconnected();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("gamepadconnected", (event) => setConnected(event.gamepad));
  window.addEventListener("gamepaddisconnected", (event) => {
    if (event.gamepad.index === activeIndex) setDisconnected();
  });

  if (!("getGamepads" in navigator)) {
    status.textContent = "Unsupported browser";
    empty.querySelector("strong").textContent = "This browser does not support the Gamepad API.";
  } else {
    requestAnimationFrame(tick);
  }
})();
