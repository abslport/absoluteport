import { clamp, sectionProgress, lerpKeyframes, chooseQuality } from './core.mjs';

const THREE = window.THREE;
const chapters = [...document.querySelectorAll('[data-chapter]')];
const navLinks = [...document.querySelectorAll('[data-nav-target]')];
const chapterLabel = document.getElementById('chapter-label');
const stage = document.getElementById('webgl-stage');
const fallback = document.getElementById('fallback');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const anchors = [0, -30, -60, -90, -120, -158, -194];
const cameraFrames = [
  { position: [0, 2.2, 11], target: [0, 1.4, 0], fov: 47 },
  { position: [-3.5, 2.6, -20], target: [0, 1.0, -30], fov: 44 },
  { position: [4.0, 2.1, -50], target: [0, 1.1, -60], fov: 43 },
  { position: [-4.8, 3.3, -80], target: [0, 1.2, -90], fov: 46 },
  { position: [4.5, 2.4, -110], target: [0, .8, -120], fov: 43 },
  { position: [-1.2, 3.0, -144], target: [0, 1.0, -158], fov: 48 },
  { position: [0, 3.8, -181], target: [0, 1.2, -194], fov: 45 },
];

const state = {
  activeIndex: 0,
  localProgress: 0,
  targetFrame: cameraFrames[0],
  scrollY: window.scrollY,
  reduced: reduceMotion.matches,
  visible: !document.hidden,
  rendering: false,
};

let renderer;
let scene;
let camera;
let clock;
let keyLight;
let quality;
let raf = 0;
let lastTime = performance.now();
let world = [];
let particleField;
let revealObserver;

const reusable = {};


function splitMaskedReveal(element) {
  if (element.dataset.maskedRevealReady === 'true') return;
  const original = element.textContent.replace(/\s+/g, ' ').trim();
  element.setAttribute('aria-label', original);
  element.innerHTML = element.innerHTML
    .split(/(<br\s*\/?>)/i)
    .map((part) => {
      if (/^<br/i.test(part)) return part;
      return part.trim().split(/\s+/).filter(Boolean)
        .map((word) => `<span class="word-mask" aria-hidden="true"><span class="word">${word}</span></span>`)
        .join(' ');
    })
    .join('');
  element.dataset.maskedRevealReady = 'true';
}

function initReveals() {
  const headings = [...document.querySelectorAll('[data-masked-reveal]')];
  headings.forEach(splitMaskedReveal);
  if (state.reduced || !('IntersectionObserver' in window)) {
    headings.forEach((heading) => heading.classList.add('is-revealed'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  headings.forEach((heading) => revealObserver.observe(heading));
}

function failWebGL() {
  document.documentElement.classList.add('no-webgl');
  fallback.hidden = false;
  stage.replaceChildren();
}

function material(key, factory) {
  if (!reusable[key]) reusable[key] = factory();
  return reusable[key];
}

function box(group, size, position, mat, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function cylinder(group, radius, height, position, mat, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 18), mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function frame(group, size, position, color = 0x6d2119, rotation = [0, 0, 0]) {
  const source = new THREE.BoxGeometry(...size);
  const geometry = new THREE.EdgesGeometry(source);
  source.dispose();
  const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .72 }));
  line.position.set(...position);
  line.rotation.set(...rotation);
  group.add(line);
  return line;
}

function makePanelTexture(title, meta, accent = '#e23b25') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(238,233,223,.11)';
  ctx.lineWidth = 2;
  for (let x = 64; x < 1024; x += 96) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 576); ctx.stroke();
  }
  for (let y = 64; y < 576; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }
  ctx.fillStyle = accent;
  ctx.fillRect(54, 52, 12, 92);
  ctx.fillStyle = '#eee9df';
  ctx.font = '700 68px Arial';
  ctx.fillText(title, 96, 112);
  ctx.fillStyle = '#8f8980';
  ctx.font = '500 22px monospace';
  ctx.fillText(meta, 96, 157);
  ctx.fillStyle = 'rgba(238,233,223,.82)';
  ctx.fillRect(96, 222, 660, 12);
  ctx.fillStyle = accent;
  ctx.fillRect(96, 222, 260, 12);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i === 4 ? accent : `rgba(238,233,223,${.12 + i * .025})`;
    ctx.fillRect(96 + i * 92, 310 + (i % 2) * 34, 72, 76 - (i % 3) * 12);
  }
  ctx.fillStyle = '#eee9df';
  ctx.font = '600 18px monospace';
  ctx.fillText('V-FORGE / EDITOR SYSTEM', 96, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = Math.min(4, renderer?.capabilities.getMaxAnisotropy?.() || 1);
  return texture;
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(255,92,55,.95)');
  gradient.addColorStop(.22, 'rgba(226,59,37,.45)');
  gradient.addColorStop(1, 'rgba(226,59,37,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function addGlow(group, position, scale = 6) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: reusable.glowTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sprite.position.set(...position);
  sprite.scale.set(scale, scale, 1);
  group.add(sprite);
  return sprite;
}

function chapterGroup(index) {
  const group = new THREE.Group();
  group.position.z = anchors[index];
  group.userData.index = index;
  group.userData.motion = [];
  scene.add(group);
  world.push(group);
  return group;
}

function buildPrologue() {
  const g = chapterGroup(0);
  g.position.x = 2.4;
  const dark = material('dark', () => new THREE.MeshStandardMaterial({ color: 0x10100f, roughness: .6, metalness: .5 }));
  const red = material('red', () => new THREE.MeshStandardMaterial({ color: 0x5b160f, emissive: 0x57110b, emissiveIntensity: .62, roughness: .35, metalness: .45 }));
  box(g, [3.6, 8.5, 1.5], [0, 3.7, 0], dark);
  box(g, [.18, 7.4, 1.7], [-1.9, 3.4, -.2], red);
  box(g, [.12, 5.8, 1.8], [1.85, 2.6, -.4], red);
  frame(g, [8.5, 6.2, 5], [0, 2.4, -2.5], 0x4b2622);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(5.4, .055, 10, 90), new THREE.MeshBasicMaterial({ color: 0xe23b25, transparent: true, opacity: .42 }));
  ring.position.set(0, 1.6, -5.2);
  ring.rotation.x = Math.PI / 2.8;
  g.add(ring);
  g.userData.motion.push({ object: ring, type: 'rotate', speed: .035 });
  addGlow(g, [0, 2.3, -4.8], 11);
}

function buildOrigin() {
  const g = chapterGroup(1);
  for (let i = 0; i < 8; i++) {
    frame(g, [10 - i * .55, 6.3 - i * .22, .16], [0, 1.7, -i * 1.15], i % 2 ? 0x6d2119 : 0x34302c);
  }
  for (let i = -3; i <= 3; i++) {
    box(g, [.035, .035, 12], [i * 1.25, -1.35, -3.8], material('lineRed', () => new THREE.MeshBasicMaterial({ color: 0x6b2018 })));
  }
  const core = box(g, [1.7, 1.7, 1.7], [-2.8, 2.2, -4.6], material('wire', () => new THREE.MeshStandardMaterial({ color: 0x171717, emissive: 0x2f0906, wireframe: true })));
  core.rotation.set(.5, .5, 0);
  g.userData.motion.push({ object: core, type: 'rotate', speed: .12 });
  addGlow(g, [-2.8, 2.2, -4.9], 4.4);
}

function buildSystem() {
  const g = chapterGroup(2);
  const steel = material('steel', () => new THREE.MeshStandardMaterial({ color: 0x181818, metalness: .8, roughness: .28 }));
  const red = reusable.red;
  for (let i = 0; i < 7; i++) {
    const x = (i % 2 ? 1 : -1) * (3.0 + (i % 3) * .8);
    const y = .2 + (i % 4) * 1.2;
    const z = -1.5 - i * .9;
    box(g, [2.4, 1.35, .24], [x, y, z], steel, [0, i % 2 ? -.15 : .15, 0]);
    frame(g, [2.55, 1.5, .3], [x, y, z], i === 3 ? 0xe23b25 : 0x49302c);
  }
  const core = new THREE.Group();
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) {
    box(core, [.6, .6, .6], [x * .72, y * .72, 0], (x + y) % 2 ? red : steel);
  }
  core.position.set(0, 1.5, -4.2);
  core.rotation.set(.35, .45, 0);
  g.add(core);
  g.userData.motion.push({ object: core, type: 'rotate', speed: .09 });
  addGlow(g, [0, 1.6, -4.4], 6.5);
}

function buildIndustry() {
  const g = chapterGroup(3);
  const steel = reusable.steel;
  const red = reusable.red;
  box(g, [9.5, .3, 11], [0, -1.45, -4], steel);
  box(g, [7.4, .7, 2.2], [0, 4.8, -4.2], steel);
  box(g, [6.2, .9, 3.2], [0, 0, -4.2], steel);
  for (const x of [-2.3, 0, 2.3]) {
    const piston = cylinder(g, .4, 5.0, [x, 2.4, -4.2], steel);
    const head = box(g, [1.25, .46, 1.5], [x, 1.0, -4.2], red);
    g.userData.motion.push({ object: piston, type: 'piston', baseY: 2.4, offset: x, speed: .75 });
    g.userData.motion.push({ object: head, type: 'piston', baseY: 1.0, offset: x, speed: .75 });
  }
  for (const x of [-4.4, 4.4]) box(g, [.28, 6, .28], [x, 1.6, -4.2], red);
  addGlow(g, [0, .7, -3.2], 7);
}

function buildPrecision() {
  const g = chapterGroup(4);
  const dark = reusable.dark;
  const red = reusable.red;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) {
      const active = (r * 7 + c) % 9 === 0;
      const panel = box(g, [.9, .42, .12], [-4.4 + c * 1.45, 4.1 - r * 1.05, -4.5 - (c % 2) * .2], active ? red : dark);
      panel.rotation.y = (c - 3) * .015;
      if (active) g.userData.motion.push({ object: panel, type: 'pulse', baseScale: 1, speed: .8 + r * .06 });
    }
  }
  frame(g, [11, 7.2, .2], [0, 1.9, -4.7], 0x5a241f);
  box(g, [8, .06, 3.5], [0, -1.2, -2.9], material('floorRed', () => new THREE.MeshBasicMaterial({ color: 0x3a0d09, transparent: true, opacity: .5 })));
  addGlow(g, [4.2, 3.7, -4.1], 4.6);
}

function buildBeyond() {
  const g = chapterGroup(5);
  const dark = reusable.dark;
  const red = reusable.red;
  const monolith = box(g, [4.2, 8.8, 1.15], [0, 3.0, -4.2], dark);
  frame(g, [4.35, 8.95, 1.3], [0, 3.0, -4.2], 0xe23b25);

  const markTexture = makePanelTexture('V-FORGE', 'VIDEO EDITOR / PERSONAL PROJECT');
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(3.45, 1.94), new THREE.MeshBasicMaterial({ map: markTexture, transparent: false }));
  mark.position.set(0, 3.3, -3.6);
  g.add(mark);
  g.userData.textures = [markTexture];

  const panelSpecs = [
    ['PREVIEW', 'REAL-TIME MEDIA', [-4.2, 3.4, -2.8], [-7.1, 4.3, -1.2], -.2],
    ['TIMELINE', 'SPLIT / TRIM / SCRUB', [4.2, 2.7, -3.0], [7.2, 2.1, -2.0], .22],
    ['EFFECTS', 'MOTION / FILTER / TOOLS', [-3.8, -.1, -3.6], [-6.8, -.5, -1.8], .12],
    ['EXPORT', 'OUTPUT / QUALITY', [3.8, -.25, -3.8], [6.6, -.8, -2.1], -.15],
    ['4K / 120 FPS', 'PREMIUM QUALITY PATH', [0, -1.35, -2.8], [0, -2.9, -1.0], 0],
  ];
  const panels = [];
  panelSpecs.forEach(([title, meta, start, end, rot], i) => {
    const texture = makePanelTexture(title, meta, i === 4 ? '#f05836' : '#e23b25');
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(i === 4 ? 3.2 : 3.8, i === 4 ? 1.8 : 2.14), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    panel.position.set(...start);
    panel.rotation.y = rot;
    panel.userData.start = start;
    panel.userData.end = end;
    panel.userData.baseRotation = rot;
    g.add(panel);
    panels.push(panel);
    g.userData.textures.push(texture);
  });
  g.userData.panels = panels;
  g.userData.monolith = monolith;

  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.7 + i * 1.55, .035, 8, 90), new THREE.MeshBasicMaterial({ color: i === 0 ? 0xe23b25 : 0x42201c, transparent: true, opacity: .36 - i * .05 }));
    ring.position.set(0, 2.2, -6.3 - i * .3);
    ring.rotation.set(Math.PI / 2.3, 0, i * .4);
    g.add(ring);
    g.userData.motion.push({ object: ring, type: 'rotateZ', speed: .025 + i * .008 });
  }
  addGlow(g, [0, 2.6, -5.6], 13);
}

function buildArchive() {
  const g = chapterGroup(6);
  const dark = reusable.dark;
  const red = reusable.red;
  const labels = ['SOFTWARE', 'IT SUPPORT', 'OPERATIONS', 'QUALITY', 'DATA', 'V-FORGE'];
  labels.forEach((label, i) => {
    const x = (i % 2 ? 1 : -1) * (2.6 + (i % 3) * .85);
    const y = .1 + (i % 3) * 1.65;
    const z = -2.7 - i * .8;
    box(g, [2.5, .52, .22], [x, y, z], i === 5 ? red : dark, [0, i % 2 ? -.16 : .16, 0]);
    frame(g, [2.6, .62, .28], [x, y, z], i === 5 ? 0xe23b25 : 0x46302d, [0, i % 2 ? -.16 : .16, 0]);
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.8, .075, 10, 110), new THREE.MeshBasicMaterial({ color: 0xe23b25, transparent: true, opacity: .52 }));
  ring.position.set(0, 1.2, -8.8);
  ring.rotation.x = Math.PI / 2;
  g.add(ring);
  g.userData.motion.push({ object: ring, type: 'rotateZ', speed: .018 });
  addGlow(g, [0, 1.0, -8.5], 11);
}

function buildParticles() {
  const count = Math.floor(680 * quality.particles);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 28;
    positions[i * 3 + 1] = Math.random() * 13 - 3;
    positions[i * 3 + 2] = -Math.random() * 220 + 8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xc84a35, size: .035, transparent: true, opacity: .48, depthWrite: false }));
  scene.add(points);
  return points;
}

function createWorld() {
  reusable.glowTexture = makeGlowTexture();
  buildPrologue();
  buildOrigin();
  buildSystem();
  buildIndustry();
  buildPrecision();
  buildBeyond();
  buildArchive();
  particleField = buildParticles();
}

function measureChapter(index) {
  const current = chapters[index];
  const next = chapters[index + 1];
  const start = current.offsetTop;
  const end = next ? next.offsetTop : Math.max(start + innerHeight, document.documentElement.scrollHeight - innerHeight);
  return { start, end };
}

function updateScrollState() {
  state.scrollY = window.scrollY;
  let index = chapters.length - 1;
  for (let i = 0; i < chapters.length - 1; i++) {
    if (state.scrollY < chapters[i + 1].offsetTop) { index = i; break; }
  }
  state.activeIndex = index;
  const { start, end } = measureChapter(index);
  state.localProgress = sectionProgress(state.scrollY, start, end);
  state.targetFrame = state.reduced
    ? cameraFrames[index]
    : lerpKeyframes(cameraFrames, index, state.localProgress);
  syncNavigation();
}

function syncNavigation() {
  const chapter = chapters[state.activeIndex];
  const label = chapter.dataset.chapter;
  chapterLabel.textContent = `${String(state.activeIndex).padStart(2, '0')} / ${label}`;
  navLinks.forEach((link, i) => {
    if (i === state.activeIndex) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  window.__vermilionDebug.activeChapter = state.activeIndex;
}

function updateBeyond(progress) {
  const g = world[5];
  if (!g?.userData.panels) return;
  const k = clamp((progress - .08) / .72);
  const eased = k * k * (3 - 2 * k);
  g.userData.panels.forEach((panel, i) => {
    panel.position.x = THREE.MathUtils.lerp(panel.userData.start[0], panel.userData.end[0], eased);
    panel.position.y = THREE.MathUtils.lerp(panel.userData.start[1], panel.userData.end[1], eased);
    panel.position.z = THREE.MathUtils.lerp(panel.userData.start[2], panel.userData.end[2], eased);
    panel.rotation.y = panel.userData.baseRotation + Math.sin(progress * Math.PI + i) * .045;
  });
}

function animateWorld(elapsed, delta) {
  if (state.reduced) return;
  world.forEach((group, index) => {
    if (Math.abs(index - state.activeIndex) > 1) return;
    group.userData.motion.forEach((motion) => {
      if (motion.type === 'rotate') {
        motion.object.rotation.x += motion.speed * delta;
        motion.object.rotation.y += motion.speed * 1.25 * delta;
      } else if (motion.type === 'rotateZ') {
        motion.object.rotation.z += motion.speed * delta;
      } else if (motion.type === 'piston') {
        motion.object.position.y = motion.baseY + Math.sin(elapsed * motion.speed + motion.offset) * .42;
      } else if (motion.type === 'pulse') {
        const s = motion.baseScale + Math.sin(elapsed * motion.speed) * .05;
        motion.object.scale.setScalar(s);
      }
    });
  });
  if (state.activeIndex === 5) updateBeyond(state.localProgress);
  if (particleField) particleField.position.y = Math.sin(elapsed * .08) * .5;
}

function applyCamera(delta) {
  const target = state.targetFrame;
  const pos = target.position;
  const look = target.target;
  const smoothing = state.reduced ? 1 : 1 - Math.pow(.0015, Math.min(delta, .05));
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, pos[0], smoothing);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, pos[1], smoothing);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, pos[2], smoothing);
  camera.fov = THREE.MathUtils.lerp(camera.fov, target.fov, smoothing);
  camera.updateProjectionMatrix();
  const currentTarget = reusable.currentTarget;
  currentTarget.x = THREE.MathUtils.lerp(currentTarget.x, look[0], smoothing);
  currentTarget.y = THREE.MathUtils.lerp(currentTarget.y, look[1], smoothing);
  currentTarget.z = THREE.MathUtils.lerp(currentTarget.z, look[2], smoothing);
  camera.lookAt(currentTarget);
  keyLight.position.set(camera.position.x + 3, camera.position.y + 5, camera.position.z + 4);
  keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, state.activeIndex === 5 ? 5.8 : 4.2, smoothing);
}

function frame(now) {
  raf = 0;
  if (!state.visible || !renderer) { state.rendering = false; return; }
  const delta = Math.min(.05, Math.max(.001, (now - lastTime) / 1000));
  lastTime = now;
  const elapsed = clock.getElapsedTime();
  applyCamera(delta);
  animateWorld(elapsed, delta);
  renderer.render(scene, camera);
  state.rendering = true;
  window.__vermilionDebug.rendering = true;
  if (!state.reduced) raf = requestAnimationFrame(frame);
  else {
    state.rendering = false;
    window.__vermilionDebug.rendering = false;
  }
}

function requestRender() {
  if (!state.visible || raf) return;
  lastTime = performance.now();
  raf = requestAnimationFrame(frame);
}

let resizeQueued = false;
function onResize() {
  if (resizeQueued || !renderer) return;
  resizeQueued = true;
  requestAnimationFrame(() => {
    resizeQueued = false;
    quality = chooseQuality({
      width: innerWidth,
      dpr: devicePixelRatio || 1,
      memory: navigator.deviceMemory || 4,
      cores: navigator.hardwareConcurrency || 4,
    });
    renderer.setPixelRatio(quality.pixelRatio);
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / Math.max(1, innerHeight);
    camera.updateProjectionMatrix();
    window.__vermilionDebug.quality = quality;
    updateScrollState();
    requestRender();
  });
}

function onVisibility() {
  state.visible = !document.hidden;
  window.__vermilionDebug.rendering = state.visible && !state.reduced;
  if (!state.visible) {
    cancelAnimationFrame(raf);
    raf = 0;
    state.rendering = false;
  } else {
    requestRender();
  }
}

function onMotionPreference() {
  state.reduced = reduceMotion.matches;
  document.querySelectorAll('[data-masked-reveal]').forEach((heading) => {
    if (state.reduced) heading.classList.add('is-revealed');
  });
  updateScrollState();
  requestRender();
}

function initRenderer() {
  if (!THREE || !stage) throw new Error('Three.js or WebGL stage unavailable');
  quality = chooseQuality({
    width: innerWidth,
    dpr: devicePixelRatio || 1,
    memory: navigator.deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
  });
  renderer = new THREE.WebGLRenderer({ antialias: quality.tier === 'high', alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  stage.replaceChildren(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070707);
  scene.fog = new THREE.FogExp2(0x070707, .045);
  camera = new THREE.PerspectiveCamera(cameraFrames[0].fov, innerWidth / innerHeight, .1, 80);
  camera.position.set(...cameraFrames[0].position);
  reusable.currentTarget = new THREE.Vector3(...cameraFrames[0].target);

  scene.add(new THREE.HemisphereLight(0x6f6b65, 0x090403, .52));
  keyLight = new THREE.PointLight(0xe85a3a, 4.2, 32, 2);
  scene.add(keyLight);
  const rim = new THREE.DirectionalLight(0xb9c2cf, .34);
  rim.position.set(-7, 8, 3);
  scene.add(rim);
  clock = new THREE.Clock();

  createWorld();
  window.__vermilionDebug.quality = quality;
}

function onScroll() {
  updateScrollState();
  requestRender();
}

function dispose() {
  cancelAnimationFrame(raf);
  removeEventListener('scroll', onScroll);
  removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibility);
  reduceMotion.removeEventListener?.('change', onMotionPreference);
  revealObserver?.disconnect();
  world.forEach((group) => {
    group.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose?.());
      else object.material?.dispose?.();
    });
    group.userData.textures?.forEach((texture) => texture.dispose());
  });
  particleField?.geometry?.dispose?.();
  particleField?.material?.dispose?.();
  Object.values(reusable).forEach((value) => value?.dispose?.());
  renderer?.dispose?.();
}

window.__vermilionDebug = { quality: null, activeChapter: 0, rendering: false };
initReveals();

try {
  initRenderer();
  updateScrollState();
  requestRender();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  reduceMotion.addEventListener?.('change', onMotionPreference);
  addEventListener('pagehide', dispose, { once: true });
} catch (error) {
  console.warn('[Vermilion Noir] WebGL fallback:', error);
  failWebGL();
}
