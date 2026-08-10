export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function sectionProgress(scrollY, start, end) {
  return clamp((scrollY - start) / Math.max(1, end - start));
}

export function lerpKeyframes(frames, index, t) {
  const a = frames[index];
  const b = frames[Math.min(index + 1, frames.length - 1)];
  const k = clamp(t);
  const mix = (x, y) => x + (y - x) * k;
  return {
    position: a.position.map((value, i) => mix(value, b.position[i])),
    target: a.target.map((value, i) => mix(value, b.target[i])),
    fov: mix(a.fov, b.fov),
  };
}

export function chooseQuality({ width, dpr, memory = 4, cores = 4 }) {
  const mobile = width <= 768 || memory <= 4 || cores <= 4;
  return mobile
    ? { tier: 'mobile', pixelRatio: Math.min(dpr, 1.35), particles: 0.45, shadows: false }
    : { tier: 'high', pixelRatio: Math.min(dpr, 1.8), particles: 1, shadows: true };
}
