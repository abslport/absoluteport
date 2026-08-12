
export function getLoaderStatus(modelState) {
  return modelState === 'loading' ? 'LOADING HAND MODEL' : 'PORTFOLIO READY';
}

export function getHandSurfaceTuning() {
  return {
    material: {
      color: 0x090a0a,
      roughness: 0.32,
      metalness: 0.12,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
    },
    lighting: {
      keyIntensity: 4.2,
      rimIntensity: 1.35,
      fillIntensity: 0.16,
    },
    exposure: 0.82,
  };
}


export function getPointerMotionTuning() {
  return {
    yawDeg: 5,
    pitchDeg: 3.2,
    damping: 0.075,
  };
}

export function getIdleHandMotion(elapsedSeconds, viewportWidth) {
  const compact = viewportWidth < 768;
  const speed = compact ? 0.72 : 0.62;
  const yawAmplitude = compact ? 5.2 : 3.8;
  const pitchAmplitude = compact ? 2.8 : 2.0;
  const rollAmplitude = compact ? 1.6 : 1.2;
  const floatY = compact ? 0.065 : 0.045;
  const driftX = compact ? 0.028 : 0.018;
  const scalePulse = compact ? 0.014 : 0.01;
  const t = elapsedSeconds * speed;

  return {
    yawDeg: Math.sin(t * 1.12) * yawAmplitude,
    pitchDeg: Math.sin(t * 1.3 + 0.3) * pitchAmplitude,
    rollDeg: Math.sin(t * 0.63 + 0.35) * rollAmplitude,
    x: Math.cos(t * 0.52 + 0.2) * driftX,
    y: Math.sin(t * 0.88) * floatY,
    scale: 1 + Math.sin(t * 0.71 + 0.65) * scalePulse,
  };
}

export function getRendererPixelRatio(devicePixelRatio, viewportWidth) {
  const cap = viewportWidth < 768 ? 1.5 : 2;
  return Math.min(Math.max(devicePixelRatio || 1, 1), cap);
}

export function resolveHeroMode({ webglSupported, modelState, reducedMotion }) {
  if (reducedMotion || !webglSupported) return 'poster';
  return modelState === 'ready' ? 'webgl' : 'poster';
}

export function shouldRenderFrame(heroVisible, documentVisible) {
  return Boolean(heroVisible && documentVisible);
}

export function getLoaderRevealDelay(elapsedMs, minimumMs) {
  return Math.max(0, minimumMs - elapsedMs);
}

export function getModelNormalization(center, maxAxis, targetSize = 3.2) {
  const scale = targetSize / maxAxis;
  return {
    scale,
    position: {
      x: -center.x * scale,
      y: -center.y * scale,
      z: -center.z * scale,
    },
  };
}

export function getScrollTuning(viewportWidth) {
  const compact = viewportWidth < 768;

  if (compact) {
    return {
      pinViewportMultiplier: 1.65,
      firstYawDeg: 13,
      firstPitchDeg: -4,
      firstScale: 1.1,
      firstCameraZ: 6.0,
      finalYawDeg: 17,
      finalPitchDeg: -5,
      finalScale: 1.22,
      finalCameraZ: 5.75,
    };
  }

  return {
    pinViewportMultiplier: 1.6,
    firstYawDeg: 18,
    firstPitchDeg: -6,
    firstScale: 1.14,
    firstCameraZ: 5.85,
    finalYawDeg: 22,
    finalPitchDeg: -8,
    finalScale: 1.34,
    finalCameraZ: 5.45,
  };
}
