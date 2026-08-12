import test from 'node:test';
import assert from 'node:assert/strict';
import * as policy from '../hero-policy.js';

const {
  getRendererPixelRatio,
  resolveHeroMode,
  shouldRenderFrame,
} = policy;

test('mobile renderer pixel ratio is capped at 1.5', () => {
  assert.equal(getRendererPixelRatio(3, 390), 1.5);
});

test('desktop renderer pixel ratio is capped at 2', () => {
  assert.equal(getRendererPixelRatio(3, 1440), 2);
});

test('reduced motion uses a static poster path', () => {
  assert.equal(resolveHeroMode({ webglSupported: true, modelState: 'ready', reducedMotion: true }), 'poster');
});

test('failed WebGL uses a poster path', () => {
  assert.equal(resolveHeroMode({ webglSupported: false, modelState: 'ready', reducedMotion: false }), 'poster');
});

test('ready model and WebGL use the live scene', () => {
  assert.equal(resolveHeroMode({ webglSupported: true, modelState: 'ready', reducedMotion: false }), 'webgl');
});

test('a model that is still loading stays on the poster path', () => {
  assert.equal(resolveHeroMode({ webglSupported: true, modelState: 'loading', reducedMotion: false }), 'poster');
});

test('rendering pauses when the hero or document is not visible', () => {
  assert.equal(shouldRenderFrame(true, true), true);
  assert.equal(shouldRenderFrame(false, true), false);
  assert.equal(shouldRenderFrame(true, false), false);
});

test('loader delay enforces the minimum reveal time without adding delay after it', () => {
  assert.equal(typeof policy.getLoaderRevealDelay, 'function');
  assert.equal(policy.getLoaderRevealDelay(200, 650), 450);
  assert.equal(policy.getLoaderRevealDelay(900, 650), 0);
});

test('pixel ratio never drops below 1', () => {
  assert.equal(getRendererPixelRatio(0.5, 390), 1);
});

test('model normalization recenters after scaling instead of translating by raw source units', () => {
  assert.equal(typeof policy.getModelNormalization, 'function');
  const result = policy.getModelNormalization({ x: -0.344, y: 93.155, z: 5.204 }, 186.31, 3.2);
  assert.ok(Math.abs(result.scale - (3.2 / 186.31)) < 1e-9);
  assert.ok(Math.abs(result.position.x - (0.344 * result.scale)) < 1e-9);
  assert.ok(Math.abs(result.position.y - (-93.155 * result.scale)) < 1e-9);
  assert.ok(Math.abs(result.position.z - (-5.204 * result.scale)) < 1e-9);
});

test('mobile scroll tuning stays cinematic without exceeding approved motion bounds', () => {
  assert.equal(typeof policy.getScrollTuning, 'function');
  const tuning = policy.getScrollTuning(390);

  assert.equal(tuning.pinViewportMultiplier, 1.65);
  assert.equal(tuning.firstYawDeg, 13);
  assert.equal(tuning.finalYawDeg, 17);
  assert.equal(tuning.finalPitchDeg, -5);
  assert.equal(tuning.finalScale, 1.22);
});

test('desktop scroll tuning remains inside the approved 16 to 22 degree yaw range', () => {
  assert.equal(typeof policy.getScrollTuning, 'function');
  const tuning = policy.getScrollTuning(1440);

  assert.equal(tuning.pinViewportMultiplier, 1.6);
  assert.equal(tuning.firstYawDeg, 18);
  assert.equal(tuning.finalYawDeg, 22);
  assert.equal(tuning.finalPitchDeg, -8);
  assert.equal(tuning.finalScale, 1.34);
});

test('loader status never exposes internal fallback wording', () => {
  assert.equal(typeof policy.getLoaderStatus, 'function');
  assert.equal(policy.getLoaderStatus('loading'), 'LOADING HAND MODEL');
  assert.equal(policy.getLoaderStatus('ready'), 'PORTFOLIO READY');
  assert.equal(policy.getLoaderStatus('poster'), 'PORTFOLIO READY');
  assert.equal(policy.getLoaderStatus('failed'), 'PORTFOLIO READY');
});

test('hand surface tuning stays inside the approved graphite material range', () => {
  assert.equal(typeof policy.getHandSurfaceTuning, 'function');
  const tuning = policy.getHandSurfaceTuning();

  assert.equal(tuning.material.color, 0x090a0a);
  assert.ok(tuning.material.roughness >= 0.26 && tuning.material.roughness <= 0.32);
  assert.ok(tuning.material.metalness >= 0.12 && tuning.material.metalness <= 0.22);
  assert.ok(tuning.material.clearcoat >= 0.55 && tuning.material.clearcoat <= 0.70);
  assert.ok(tuning.material.clearcoatRoughness >= 0.18 && tuning.material.clearcoatRoughness <= 0.25);
  assert.ok(tuning.lighting.keyIntensity <= 4.5);
  assert.ok(tuning.lighting.fillIntensity <= 0.18);
  assert.ok(tuning.exposure <= 0.85);
});

test('mobile hand has autonomous idle motion even without pointer input', () => {
  assert.equal(typeof policy.getIdleHandMotion, 'function');
  const a = policy.getIdleHandMotion(0.8, 390);
  const b = policy.getIdleHandMotion(2.4, 390);

  assert.ok(Math.abs(a.yawDeg - b.yawDeg) > 1.5);
  assert.ok(Math.abs(a.pitchDeg - b.pitchDeg) > 0.8);
  assert.ok(Math.abs(a.y) <= 0.07 && Math.abs(b.y) <= 0.07);
  assert.ok(a.scale >= 0.985 && a.scale <= 1.02);
  assert.ok(b.scale >= 0.985 && b.scale <= 1.02);
});

test('desktop pointer response is visible but stays controlled', () => {
  assert.equal(typeof policy.getPointerMotionTuning, 'function');
  const tuning = policy.getPointerMotionTuning();

  assert.ok(tuning.yawDeg >= 4 && tuning.yawDeg <= 6);
  assert.ok(tuning.pitchDeg >= 2.5 && tuning.pitchDeg <= 4);
  assert.ok(tuning.damping >= 0.06 && tuning.damping <= 0.1);
});
