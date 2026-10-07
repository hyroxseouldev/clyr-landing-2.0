// Paused/off-screen scenes have no recurring animation frame. Resize and manual
// rotation can still request a single frame without restarting auto-rotation.
export function createFrameLoop(draw, { requestFrame = requestAnimationFrame, cancelFrame = cancelAnimationFrame } = {}) {
  let active = false;
  let disposed = false;
  let frame = null;
  let previous = null;

  function invalidate() {
    if (!disposed && frame === null) frame = requestFrame(tick);
  }
  function tick(time) {
    frame = null;
    if (disposed) return;
    const delta = active && previous !== null ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = active ? time : null;
    draw(delta, time);
    if (active) invalidate();
  }

  return {
    invalidate,
    setActive(value) {
      if (disposed || active === value) return;
      active = value;
      previous = null;
      if (active) invalidate();
      else if (frame !== null) {
        cancelFrame(frame);
        frame = null;
      }
    },
    dispose() {
      disposed = true;
      if (frame !== null) cancelFrame(frame);
      frame = null;
    },
  };
}
