import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  getLoaderRevealDelay,
  getModelNormalization,
  getRendererPixelRatio,
  getScrollTuning,
  resolveHeroMode,
  shouldRenderFrame,
} from './hero-policy.js';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector('.hero');
const loader = document.querySelector('[data-loader]');
const loaderStatus = document.querySelector('[data-loader-status]');
const canvas = document.querySelector('[data-hero-canvas]');
const heroObject = document.querySelector('[data-hero-object]');
const titleBayu = document.querySelector('.hero__name--bayu');
const titleAndika = document.querySelector('.hero__name--andika');
const portfolio = document.querySelector('.hero__portfolio');
const metaItems = document.querySelectorAll('.hero__meta, .hero__credit, .hero__scroll');
const guides = document.querySelector('.hero__guides');
const heroExit = document.querySelector('.hero-exit');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOADER_MIN_MS = 650;
const LOADER_MAX_MS = 1800;
const BASE_HAND_YAW = THREE.MathUtils.degToRad(-55);
const bootStartedAt = performance.now();
let loaderRevealed = false;
let arrivalPlayed = false;

function playArrival() {
  if (arrivalPlayed) return;
  arrivalPlayed = true;

  if (reducedMotion) {
    gsap.set([titleBayu, titleAndika, portfolio, ...metaItems, heroObject], { clearProps: 'all' });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(titleBayu, { yPercent: 24, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85 }, 0)
    .fromTo(titleAndika, { yPercent: 28, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.08)
    .fromTo(portfolio, { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8 }, 0.18)
    .fromTo(metaItems, { opacity: 0 }, { opacity: 1, duration: 0.55, stagger: 0.05 }, 0.32)
    .fromTo(heroObject, { scale: 0.86 }, { scale: 1, duration: 1.05, ease: 'expo.out' }, 0.02);
}

function revealPage() {
  if (loaderRevealed || !loader) return;
  loaderRevealed = true;

  const elapsed = performance.now() - bootStartedAt;
  const delay = getLoaderRevealDelay(elapsed, LOADER_MIN_MS);

  window.setTimeout(() => {
    loader.classList.add('is-leaving');
    playArrival();
    window.setTimeout(() => loader.remove(), 520);
  }, delay);
}

function canUseWebGL() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(
      (window.WebGL2RenderingContext && probe.getContext('webgl2')) ||
      (window.WebGLRenderingContext && probe.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

let modelState = 'loading';
const webglSupported = canUseWebGL();

hero.dataset.renderMode = resolveHeroMode({
  webglSupported,
  modelState,
  reducedMotion,
});

window.setTimeout(revealPage, LOADER_MAX_MS);

if (!webglSupported || reducedMotion) {
  modelState = 'poster';
  loaderStatus.textContent = 'STATIC HERO READY';
  revealPage();
} else {
  bootWebGL();
}

function bootWebGL() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  RectAreaLightUniformsLib.init();

  const handGroup = new THREE.Group();
  scene.add(handGroup);

  const key = new THREE.RectAreaLight(0xf2f7ff, 5.4, 5.0, 5.0);
  key.position.set(-3.2, 4.0, 3.6);
  key.lookAt(0, 0.5, 0);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xe7f0f6, 1.8);
  rim.position.set(4.2, 2.2, -3.5);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xbfc5c7, 0.28);
  fill.position.set(0, -2.5, 4.5);
  scene.add(fill);

  camera.position.set(0, 0.1, 6.4);

  const graphiteMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x090a0a,
    roughness: 0.31,
    metalness: 0.13,
    clearcoat: 0.58,
    clearcoatRoughness: 0.24,
  });

  const motionState = {
    scrollYaw: 0,
    scrollPitch: 0,
    scrollScale: 1,
    cameraZ: 6.4,
    pointerYaw: 0,
    pointerPitch: 0,
    targetPointerYaw: 0,
    targetPointerPitch: 0,
  };

  const pointerEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (pointerEnabled) {
    window.addEventListener('pointermove', (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      motionState.targetPointerYaw = THREE.MathUtils.degToRad(nx * 3.0);
      motionState.targetPointerPitch = THREE.MathUtils.degToRad(ny * -2.0);
    }, { passive: true });
  }

  function resizeRenderer() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const pixelRatio = getRendererPixelRatio(window.devicePixelRatio, window.innerWidth);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(canvas);
  window.addEventListener('orientationchange', resizeRenderer, { passive: true });
  resizeRenderer();

  let heroVisible = true;
  let documentVisible = !document.hidden;

  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
  }, { threshold: 0 });
  heroObserver.observe(hero);

  document.addEventListener('visibilitychange', () => {
    documentVisible = !document.hidden;
  });

  let scrollTimeline;
  let resizeTimer;
  let lastCompact = window.innerWidth < 768;

  function rebuildScrollMotion() {
    scrollTimeline?.scrollTrigger?.kill();
    scrollTimeline?.kill();
    if (reducedMotion || modelState !== 'ready') return;

    const compact = window.innerWidth < 768;
    lastCompact = compact;
    const tuning = getScrollTuning(window.innerWidth);
    const endDistance = Math.round(window.innerHeight * tuning.pinViewportMultiplier);

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: `+=${endDistance}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    scrollTimeline
      .to(motionState, {
        scrollYaw: THREE.MathUtils.degToRad(tuning.firstYawDeg),
        scrollPitch: THREE.MathUtils.degToRad(tuning.firstPitchDeg),
        scrollScale: tuning.firstScale,
        cameraZ: tuning.firstCameraZ,
        ease: 'none',
        duration: 0.65,
      }, 0)
      .to(titleBayu, { xPercent: -18, opacity: 0.28, ease: 'none', duration: 0.48 }, 0.34)
      .to(titleAndika, { xPercent: -26, opacity: 0.18, ease: 'none', duration: 0.52 }, 0.38)
      .to(portfolio, { xPercent: 22, opacity: 0.24, ease: 'none', duration: 0.45 }, 0.47)
      .to(guides, { opacity: 0.12, ease: 'none', duration: 0.35 }, 0.56)
      .to(motionState, {
        scrollYaw: THREE.MathUtils.degToRad(tuning.finalYawDeg),
        scrollPitch: THREE.MathUtils.degToRad(tuning.finalPitchDeg),
        scrollScale: tuning.finalScale,
        cameraZ: tuning.finalCameraZ,
        ease: 'none',
        duration: 0.35,
      }, 0.65)
      .fromTo(heroExit, { yPercent: 18 }, { yPercent: 0, ease: 'none', duration: 0.28 }, 0.72);

    ScrollTrigger.refresh();
  }

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeRenderer();
      const compact = window.innerWidth < 768;
      if (compact !== lastCompact) rebuildScrollMotion();
      else ScrollTrigger.refresh();
    }, 140);
  }, { passive: true });

  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    '/assets/models/hero-hand.glb',
    (gltf) => {
      const model = gltf.scene;

      model.traverse((node) => {
        if (!node.isMesh) return;
        node.material = graphiteMaterial;
        node.castShadow = false;
        node.receiveShadow = false;
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z);

      const normalization = getModelNormalization(center, maxAxis, 3.2);
      model.scale.setScalar(normalization.scale);
      model.position.set(
        normalization.position.x,
        normalization.position.y,
        normalization.position.z
      );
      handGroup.add(model);

      modelState = 'ready';
      hero.dataset.renderMode = resolveHeroMode({
        webglSupported: true,
        modelState,
        reducedMotion,
      });
      loaderStatus.textContent = 'HAND MODEL READY';
      rebuildScrollMotion();
      revealPage();
    },
    undefined,
    (error) => {
      console.error('Hero hand failed to load:', error);
      modelState = 'failed';
      hero.dataset.renderMode = 'poster';
      loaderStatus.textContent = 'STATIC HERO READY';
      revealPage();
    }
  );

  const clock = new THREE.Clock();

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    if (modelState !== 'ready') return;
    if (!shouldRenderFrame(heroVisible, documentVisible)) return;

    motionState.pointerYaw += (motionState.targetPointerYaw - motionState.pointerYaw) * 0.055;
    motionState.pointerPitch += (motionState.targetPointerPitch - motionState.pointerPitch) * 0.055;

    const elapsed = clock.getElapsedTime();
    handGroup.position.y = Math.sin(elapsed * 0.55) * 0.025;
    handGroup.rotation.y = BASE_HAND_YAW + motionState.scrollYaw + motionState.pointerYaw;
    handGroup.rotation.x = motionState.scrollPitch + motionState.pointerPitch;
    handGroup.scale.setScalar(motionState.scrollScale);
    camera.position.z = motionState.cameraZ;
    renderer.render(scene, camera);
  }

  renderFrame();
}
