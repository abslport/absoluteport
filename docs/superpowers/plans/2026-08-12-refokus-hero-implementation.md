# Bayu Andika Refokus-Style Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved hero-only portfolio experience with an original legally sourced OK-gesture 3D hand, graphite and ice-white art direction, a silhouette loader, asymmetric pixel/editorial typography, and restrained GSAP plus Three.js scroll choreography.

**Architecture:** Keep the runtime small: semantic `index.html`, one `style.css`, one main browser module, and one pure helper module for testable runtime policy. Vite is build tooling only. Three.js owns the 3D scene; GSAP ScrollTrigger owns the pinned hero timeline; native browser APIs own reduced-motion, visibility, resize, pointer damping, and fallbacks. The hero always starts from a poster/silhouette fallback and upgrades to WebGL when the hand model is ready.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Vite, Three.js, GSAP + ScrollTrigger, Node built-in test runner, Blender for asset posing/export.

## Global Constraints

- Scope is hero experience only; remove the current dashboard, projects, tools, and footer scaffolding from this phase.
- Quality target is 99% similarity of feel to the approved Refokus 2021 hero reference, not a copy of Refokus assets or branding.
- Hero object is a legally licensed human hand posed in an OK gesture close to the approved reference silhouette.
- Palette: background `#050606`, hand approximately `#090A0A`, primary text `#F1F0EB`, cold ice-white lighting; no purple, cyan, pink, or neon-gradient treatment.
- Material tuning range: roughness `0.26-0.32`, metalness `0.12-0.22`, clearcoat `0.55-0.70`, clearcoat roughness `0.18-0.25`.
- Camera FOV target: `32-37` degrees; start with `35`.
- Hand rest height: desktop `55-65vh`; mobile `50-58vh`.
- Hero pin distance target: approximately `150-170vh`; start with `160vh` and tune after visual comparison.
- Desktop pointer influence is restrained to about `±1.5°` yaw and `±1°` pitch; disable pointer influence on mobile.
- Loader target: roughly `1.4-1.8s` total with a hard maximum; no fake percentage, fake terminal text, spinner, or trap at 100%.
- Typography: Departure Mono for pixel display and Instrument Sans for supporting editorial UI text; both must be self-hosted from their SIL OFL sources and license files recorded.
- UI copy must not contain the em dash character.
- Do not introduce fake statistics, testimonials, awards, claims, dates, or navigation destinations.
- Every interactive control must have a real behavior or be removed.
- Text contrast must meet WCAG AA; keyboard focus must remain visible.
- Mobile is a dedicated composition with no horizontal overflow and minimum 44px tap targets where interactive controls exist.
- No React, Lenis, component framework, post-processing library, animation wrapper, or extra runtime dependency unless a measured problem proves it necessary.
- No source patching through external string-replacement scripts; edit source files directly.
- Every major visual decision must have a one-line purpose: graphite palette = studio sculpture depth; asymmetric overlap = make the hand part of typography; sparse guide lines = archival alignment; restrained motion = camera-led sculptural observation.
- Final delivery requires a successful build, zero console errors, tested fallback paths, tested reduced motion, and visual checks at 1440x900, 768px wide, and 390/412px wide.

---

## File Map

The implementation should end with this small structure:

```text
bayu-refokus-starter/
├── index.html                         # Hero-only semantic markup and static fallback
├── style.css                          # Full art direction, responsive composition, loader, accessibility
├── main.js                            # Loader deadline, Three.js scene, GSAP timeline, lifecycle
├── hero-policy.js                     # Pure runtime policy helpers used by main.js and Node tests
├── package.json                       # Vite + runtime dependencies + Node test scripts
├── package-lock.json                  # Locked dependency versions
├── tests/
│   └── hero-policy.test.js            # Small runnable checks for fallback/performance policy
├── assets/
│   ├── fonts/
│   │   ├── DepartureMono-Regular.woff2
│   │   ├── InstrumentSans-Variable.woff2
│   │   └── LICENSES.md
│   ├── images/
│   │   └── hero-hand-poster.webp
│   └── models/
│       ├── hero-hand.glb
│       └── LICENSE-HERO-HAND.md
└── docs/superpowers/
    ├── specs/2026-08-12-refokus-hero-design.md
    └── plans/2026-08-12-refokus-hero-implementation.md
```

`main.js` intentionally keeps WebGL and motion together because they share one hero state object and this phase has only one 3D scene. Split it only if the file becomes difficult to review after implementation.

---

### Task 1: Acquire, License, Pose, and Export the Hand Asset

**Files:**
- Create: `assets/models/hero-hand.glb`
- Create: `assets/images/hero-hand-poster.webp`
- Create: `assets/models/LICENSE-HERO-HAND.md`

**Interfaces:**
- Consumes: approved visual direction in `docs/superpowers/specs/2026-08-12-refokus-hero-design.md`
- Produces: `/assets/models/hero-hand.glb` loadable by `GLTFLoader`; `/assets/images/hero-hand-poster.webp` usable before WebGL; exact license/source record for shipping

- [ ] **Step 1: Acquire the primary rigged base model from its official model page**

Use the primary candidate because it is already rigged, light enough for real-time use, and licensed under Creative Commons Attribution:

```text
Model: Rigged Hand
Author: Haiku Tutorials
License: Creative Commons Attribution
Reference page:
https://sketchfab.com/3d-models/rigged-hand-6fa0664093b5489da73cfc6c2dd6e4f3
Reference geometry shown by source: about 12.2k triangles / 6.1k vertices
```

Download through the model page's normal download flow. Do not scrape or bypass any gated download mechanism.

If that exact download is unavailable, use this fallback candidate and record the different license terms instead:

```text
Fallback model: Human Hand Base Mesh
Author: ferrumiron6
License shown by source: Free Standard; description permits personal/commercial projects and says attribution is not required
Reference page:
https://sketchfab.com/3d-models/human-hand-base-mesh-eaaa6a35c6bb48bda6524de748695be4
```

- [ ] **Step 2: Write the license record before editing the mesh**

Create `assets/models/LICENSE-HERO-HAND.md` with this concrete format, replacing only the source-package filename and download date with the actual values from the acquisition:

```markdown
# Hero Hand Asset License

- Final asset: `hero-hand.glb`
- Base model: Rigged Hand
- Author: Haiku Tutorials
- Source: https://sketchfab.com/3d-models/rigged-hand-6fa0664093b5489da73cfc6c2dd6e4f3
- License: Creative Commons Attribution
- Download date: 2026-08-12
- Local source package: `<actual downloaded filename>`

## Modifications

- Reposed into an OK gesture for the Bayu Andika hero.
- Removed source lights, cameras, unused animations, and hidden geometry.
- Replaced source materials with a custom graphite lacquer material at runtime.
- Optimized geometry only as required for stable mobile rendering.
- Exported to GLB for Three.js.

## Attribution

3D hand base model by Haiku Tutorials, used under Creative Commons Attribution.
```

If the fallback model is used, replace the author/source/license/attribution block with the exact fallback terms; do not leave conflicting attribution text.

- [ ] **Step 3: Pose the hand in Blender to match the approved silhouette**

In Blender:

1. Delete source cameras and lights.
2. Keep one hand mesh and its rig only.
3. Pose thumb and index finger to form a clear circular OK opening.
4. Keep middle and ring fingers extended upward with a relaxed backward curve.
5. Keep the little finger slightly separated so the silhouette remains legible.
6. Rotate the wrist so the palm faces roughly 15-25 degrees toward camera rather than perfectly front-on.
7. Match the approved hero reading: the OK circle sits lower-left of the extended fingers and the wrist exits the frame downward.
8. Apply transforms to the exported root so Three.js receives sensible unit scale and origin.

Do not sculpt in Refokus-specific surface detail. The similarity comes from gesture, composition, material, light, and camera behavior.

- [ ] **Step 4: Clean and export the GLB**

Use Blender's GLTF 2.0 exporter with:

```text
Format: GLB
Include: Selected Objects
Transform: +Y Up
Geometry: Apply Modifiers
Materials: Export enabled, source appearance is not relied on at runtime
Animations: Off unless the rig is intentionally retained for posing/debugging
Cameras: Off
Lights: Off
```

Save exactly as:

```text
assets/models/hero-hand.glb
```

- [ ] **Step 5: Render the fallback poster from the same approved camera angle**

Render the posed hand against transparent background using the same approximate 35-degree perspective and graphite material direction. Export WebP with alpha:

```text
assets/images/hero-hand-poster.webp
```

Target visible poster dimensions around 1200px on the long edge. Keep alpha so CSS controls the page background.

- [ ] **Step 6: Verify asset presence and practical size**

Run:

```bash
ls -lh assets/models/hero-hand.glb assets/images/hero-hand-poster.webp assets/models/LICENSE-HERO-HAND.md
```

Expected: all three files exist and are non-zero size.

Then inspect the GLB without adding a runtime dependency:

```bash
npx --yes @gltf-transform/cli inspect assets/models/hero-hand.glb
```

Expected: one intended hand scene, no source camera/light clutter, geometry counts suitable for real-time rendering.

- [ ] **Step 7: Commit the licensed hero asset**

```bash
git add assets/models/hero-hand.glb assets/images/hero-hand-poster.webp assets/models/LICENSE-HERO-HAND.md
git commit -m "assets: add licensed hero hand"
```

---

### Task 2: Add Licensed Fonts, Minimal Build Tooling, and Runtime Policy Tests

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `hero-policy.js`
- Create: `tests/hero-policy.test.js`
- Create: `assets/fonts/DepartureMono-Regular.woff2`
- Create: `assets/fonts/InstrumentSans-Variable.woff2`
- Create: `assets/fonts/LICENSES.md`

**Interfaces:**
- Consumes: viewport width, device pixel ratio, model state, WebGL support, reduced-motion preference, hero/document visibility
- Produces: `resolveHeroMode(input)`, `getRendererPixelRatio(dpr, viewportWidth)`, `shouldRenderFrame(heroVisible, documentVisible)`

- [ ] **Step 1: Acquire the two approved open-source fonts from their official sources**

Use:

```text
Display: Departure Mono by Helena Zhang, SIL Open Font License
Official source: https://departuremono.com/

Support: Instrument Sans by Instrument, SIL Open Font License 1.1
Official source: https://github.com/Instrument/instrument-sans
```

Store only the webfont files needed by this hero:

```text
assets/fonts/DepartureMono-Regular.woff2
assets/fonts/InstrumentSans-Variable.woff2
```

Create `assets/fonts/LICENSES.md` containing the font name, author/project, source URL, and SIL OFL license for each. Do not copy font files from unrelated commercial font stores.

- [ ] **Step 2: Create the minimal package manifest**

Create `package.json`:

```json
{
  "name": "bayu-refokus-hero",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "node --test"
  },
  "dependencies": {
    "gsap": "latest",
    "three": "latest"
  },
  "devDependencies": {
    "vite": "latest"
  }
}
```

Then run:

```bash
npm install
```

Expected: `package-lock.json` is created and `npm install` finishes successfully.

- [ ] **Step 3: Write the failing runtime-policy tests first**

Create `tests/hero-policy.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRendererPixelRatio,
  resolveHeroMode,
  shouldRenderFrame,
} from '../hero-policy.js';

test('mobile renderer pixel ratio is capped at 1.5', () => {
  assert.equal(getRendererPixelRatio(3, 390), 1.5);
});

test('desktop renderer pixel ratio is capped at 2', () => {
  assert.equal(getRendererPixelRatio(3, 1440), 2);
});

test('reduced motion uses a static poster path', () => {
  assert.equal(
    resolveHeroMode({ webglSupported: true, modelState: 'ready', reducedMotion: true }),
    'poster'
  );
});

test('failed WebGL uses a poster path', () => {
  assert.equal(
    resolveHeroMode({ webglSupported: false, modelState: 'ready', reducedMotion: false }),
    'poster'
  );
});

test('ready model and WebGL use the live scene', () => {
  assert.equal(
    resolveHeroMode({ webglSupported: true, modelState: 'ready', reducedMotion: false }),
    'webgl'
  );
});

test('rendering pauses when the hero or document is not visible', () => {
  assert.equal(shouldRenderFrame(true, true), true);
  assert.equal(shouldRenderFrame(false, true), false);
  assert.equal(shouldRenderFrame(true, false), false);
});
```

- [ ] **Step 4: Run tests to verify the helper does not exist yet**

Run:

```bash
npm test
```

Expected: FAIL because `hero-policy.js` is missing or its exports are undefined.

- [ ] **Step 5: Implement the minimum pure policy helpers**

Create `hero-policy.js`:

```js
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
```

- [ ] **Step 6: Run policy tests and build tooling checks**

```bash
npm test
npm run build
```

Expected: all Node tests PASS; Vite build completes without errors.

- [ ] **Step 7: Commit tooling, tests, and font licenses**

```bash
git add package.json package-lock.json hero-policy.js tests assets/fonts
git commit -m "chore: set up hero runtime and fonts"
```

---

### Task 3: Replace the Disposable Starter with the Hero-Only Semantic Shell

**Files:**
- Modify: `index.html`
- Test: `tests/hero-policy.test.js` remains green

**Interfaces:**
- Consumes: `/assets/images/hero-hand-poster.webp`; local fonts through CSS; `main.js` module
- Produces: stable DOM hooks used by CSS, Three.js, loader logic, and ScrollTrigger

- [ ] **Step 1: Remove the existing fake dashboard/project/tool/footer scaffolding**

Delete all current sections after the hero. This phase must not ship fake counters, dead CV/contact links, or unfinished navigation.

- [ ] **Step 2: Replace `index.html` with this hero-only structure**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#050606" />
  <meta name="description" content="Bayu Andika career portfolio." />
  <title>Bayu Andika / Career Portfolio</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="loader" data-loader aria-label="Loading hero">
    <div class="loader__silhouette" aria-hidden="true">
      <img src="/assets/images/hero-hand-poster.webp" alt="" />
    </div>
    <p class="loader__status" data-loader-status>LOADING HAND MODEL</p>
    <div class="loader__track" aria-hidden="true"><span></span></div>
  </div>

  <main>
    <section class="hero" id="hero" aria-labelledby="hero-title">
      <div class="hero__guides" aria-hidden="true"></div>
      <div class="hero__grain" aria-hidden="true"></div>
      <p class="hero__ghost" aria-hidden="true">2026</p>

      <header class="hero__header">
        <a class="hero__brand" href="#hero">BAYU</a>
        <span class="hero__edition">CAREER PORTFOLIO / 2026</span>
      </header>

      <p class="hero__meta hero__meta--location">BASED IN MAGELANG, INDONESIA</p>
      <p class="hero__meta hero__meta--role">INFORMATICS / OPERATIONS / DIGITAL WORK</p>

      <div class="hero__title" id="hero-title">
        <span class="hero__name hero__name--bayu">BAYU</span>
        <span class="hero__name hero__name--andika">ANDIKA</span>
      </div>

      <div class="hero__object" data-hero-object aria-hidden="true">
        <img class="hero__poster" data-hero-poster src="/assets/images/hero-hand-poster.webp" alt="" />
        <canvas class="hero__canvas" data-hero-canvas></canvas>
      </div>

      <p class="hero__portfolio" aria-label="Career Portfolio">
        <span>/ CAREER</span>
        <span>PORTFOLIO</span>
      </p>

      <p class="hero__credit">3D HAND BASE: HAIKU TUTORIALS, CC BY</p>
      <p class="hero__scroll" aria-hidden="true">SCROLL</p>
    </section>

    <section class="hero-exit" aria-label="Hero exit">
      <p>CAREER ARCHIVE</p>
    </section>
  </main>

  <script type="module" src="/main.js"></script>
</body>
</html>
```

If the fallback hand model with no attribution requirement is used, replace the visible `hero__credit` text with a truthful source credit or remove the line only if the actual license permits it.

- [ ] **Step 3: Verify there are no dead links or fake claims**

Run:

```bash
grep -nE 'href="#"|Get Started|Learn More|99\.9|10K\+|—' index.html || true
```

Expected: no output.

- [ ] **Step 4: Re-run tests and a build**

```bash
npm test
npm run build
```

Expected: PASS and successful build.

- [ ] **Step 5: Commit the semantic shell**

```bash
git add index.html
git commit -m "feat: add hero-only semantic shell"
```

---

### Task 4: Implement the Approved Typography and Responsive Art Direction

**Files:**
- Create: `style.css`
- Modify: `index.html` only if contrast/accessibility inspection requires a semantic class adjustment

**Interfaces:**
- Consumes: DOM class names from Task 3 and local font files from Task 2
- Produces: desktop/tablet/mobile composition; loader silhouette; poster fallback; visible focus; no horizontal overflow

- [ ] **Step 1: Add the font faces and core tokens**

Start `style.css` with:

```css
@font-face {
  font-family: "Departure Mono";
  src: url("/assets/fonts/DepartureMono-Regular.woff2") format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "Instrument Sans";
  src: url("/assets/fonts/InstrumentSans-Variable.woff2") format("woff2");
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}

:root {
  --bg: #050606;
  --hand: #090a0a;
  --ink: #f1f0eb;
  --muted: #aaa9a4;
  --hairline: rgba(241, 240, 235, 0.14);
  --page-x: clamp(18px, 2vw, 32px);
  --display: "Departure Mono", monospace;
  --support: "Instrument Sans", sans-serif;
}

* { box-sizing: border-box; }
html { background: var(--bg); color: var(--ink); }
body {
  margin: 0;
  min-width: 320px;
  overflow-x: clip;
  background: var(--bg);
  font-family: var(--support);
}
a { color: inherit; }
a:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 5px;
}
```

Purpose: two type families only; Departure Mono carries the pixel archive identity, Instrument Sans supplies readable editorial counterweight.

- [ ] **Step 2: Style the loader as a silhouette teaser, not a fake terminal**

Add:

```css
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--bg);
  transition: opacity 480ms ease, visibility 480ms step-end;
}

.loader.is-leaving {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loader__silhouette {
  position: absolute;
  width: min(68vw, 620px);
  opacity: 0.16;
  filter: brightness(0) contrast(1.3);
  transform: translate3d(4vw, 5vh, 0) scale(1.06);
}

.loader__silhouette img { display: block; width: 100%; }
.loader__status {
  position: absolute;
  left: var(--page-x);
  bottom: 28px;
  margin: 0;
  font: 11px/1 var(--display);
  letter-spacing: 0.08em;
}
.loader__track {
  position: absolute;
  right: var(--page-x);
  bottom: 31px;
  width: min(42vw, 420px);
  height: 1px;
  overflow: hidden;
  background: var(--hairline);
}
.loader__track span {
  display: block;
  width: 34%;
  height: 100%;
  background: var(--ink);
  animation: loader-track 900ms ease-in-out infinite alternate;
}
@keyframes loader-track {
  from { transform: translateX(-105%); }
  to { transform: translateX(290%); }
}
```

Purpose: silhouette previews the hero object; the line communicates activity without pretending to be an accurate percentage.

- [ ] **Step 3: Implement the desktop composition first at 1440x900**

Add the hero scaffold:

```css
.hero {
  position: relative;
  min-height: 100svh;
  overflow: clip;
  isolation: isolate;
  background: var(--bg);
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -4;
  background: radial-gradient(circle at 60% 48%, #101111 0, #070808 36%, var(--bg) 70%);
}
.hero__guides {
  position: absolute;
  inset: 12vh 14vw 17vh 14vw;
  z-index: -3;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  opacity: 0.55;
}
.hero__guides::before,
.hero__guides::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--hairline);
}
.hero__guides::before { left: 27%; }
.hero__guides::after { right: 21%; }
.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
}
.hero__header {
  position: absolute;
  top: 24px;
  left: var(--page-x);
  right: var(--page-x);
  z-index: 30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 11px/1 var(--display);
  letter-spacing: 0.06em;
}
.hero__brand { min-height: 44px; display: inline-flex; align-items: center; text-decoration: none; }
.hero__edition { color: var(--muted); }
.hero__ghost {
  position: absolute;
  left: 15vw;
  top: 20vh;
  z-index: -2;
  margin: 0;
  color: rgba(241, 240, 235, 0.035);
  font: 28vw/0.72 var(--display);
  letter-spacing: -0.09em;
}
.hero__title {
  position: absolute;
  left: 3.2vw;
  top: 18vh;
  z-index: 3;
  font-family: var(--display);
  letter-spacing: -0.075em;
  line-height: 0.76;
}
.hero__name { display: block; width: max-content; }
.hero__name--bayu { font-size: clamp(104px, 13.3vw, 192px); }
.hero__name--andika { margin-left: 6.8vw; font-size: clamp(88px, 11.1vw, 160px); }
.hero__object {
  position: absolute;
  left: 47%;
  top: 51%;
  z-index: 5;
  width: min(47vw, 680px);
  height: min(68vh, 720px);
  transform: translate(-50%, -50%);
}
.hero__poster,
.hero__canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero__poster { object-fit: contain; transition: opacity 420ms ease; }
.hero__canvas { display: block; opacity: 0; transition: opacity 420ms ease; }
.hero[data-render-mode="webgl"] .hero__canvas { opacity: 1; }
.hero[data-render-mode="webgl"] .hero__poster { opacity: 0; }
.hero__portfolio {
  position: absolute;
  right: 4vw;
  bottom: 17vh;
  z-index: 8;
  margin: 0;
  font: clamp(44px, 5.5vw, 80px)/0.84 var(--display);
  letter-spacing: -0.06em;
}
.hero__portfolio span { display: block; }
.hero__meta,
.hero__credit,
.hero__scroll {
  position: absolute;
  z-index: 9;
  margin: 0;
  color: var(--muted);
  font: 10px/1.35 var(--support);
  letter-spacing: 0.08em;
}
.hero__meta--location { left: var(--page-x); bottom: 28px; }
.hero__meta--role { right: var(--page-x); top: 80px; max-width: 290px; text-align: right; }
.hero__credit { right: var(--page-x); bottom: 28px; }
.hero__scroll { right: var(--page-x); bottom: 62px; color: var(--ink); }
.hero-exit {
  min-height: 80svh;
  display: grid;
  place-items: center;
  background: #f1f0eb;
  color: #050606;
  font: clamp(56px, 11vw, 150px)/0.8 var(--display);
}
```

Purpose: the guide structure aligns type and object, the hand physically splits the type hierarchy, and negative space is deliberate instead of card-based.

- [ ] **Step 4: Add tablet and dedicated mobile composition**

```css
@media (max-width: 1199px) {
  .hero__title { top: 19vh; left: 4vw; }
  .hero__object { left: 53%; width: min(58vw, 620px); }
  .hero__portfolio { right: 5vw; bottom: 15vh; }
}

@media (max-width: 767px) {
  :root { --page-x: 18px; }
  .hero { min-height: 100svh; }
  .hero__edition,
  .hero__meta--role,
  .hero__credit { display: none; }
  .hero__guides { inset: 16vh 18px 18vh 18px; opacity: 0.35; }
  .hero__guides::before { left: 31%; }
  .hero__guides::after { right: 18%; }
  .hero__ghost { left: 5vw; top: 30vh; font-size: 54vw; }
  .hero__title { left: 18px; top: 16vh; }
  .hero__name--bayu { font-size: clamp(74px, 23vw, 102px); }
  .hero__name--andika {
    margin-left: 10vw;
    font-size: clamp(62px, 18.5vw, 84px);
  }
  .hero__object {
    left: 58%;
    top: 53%;
    width: 82vw;
    height: 56vh;
  }
  .hero__portfolio {
    left: 18px;
    right: auto;
    bottom: 11vh;
    font-size: clamp(36px, 12vw, 54px);
  }
  .hero__meta--location { left: 18px; bottom: 22px; }
  .hero__scroll { right: 18px; bottom: 22px; }
  .loader__silhouette { width: 94vw; transform: translate3d(10vw, 4vh, 0) scale(1.08); }
  .loader__track { width: 46vw; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 5: Run static anti-slop and accessibility checks**

Run:

```bash
grep -nE '#[0-9A-Fa-f]{6}' style.css
grep -nE 'purple|cyan|pink|backdrop-filter|box-shadow:.*0 0' style.css || true
grep -nE 'outline:\s*(none|0)' style.css || true
```

Expected: only graphite/off-white palette values; no purple/cyan/pink, no glass blur, no removed focus outline.

- [ ] **Step 6: Build and manually inspect static fallback before adding WebGL**

```bash
npm run dev -- --host 0.0.0.0
```

Check the poster-only page at 1440x900, 768px wide, and 390/412px wide. The page must already look intentional before Three.js is enabled.

Required static observations:

```text
Desktop: hand/picture overlaps BAYU / ANDIKA without making either unreadable.
Desktop: / CAREER PORTFOLIO counterbalances the left title rather than centering under it.
Mobile: no horizontal scroll, title remains readable, hand occupies roughly half the viewport height.
All: guide lines are sparse and alignment-driven, not a full graph-paper background.
```

- [ ] **Step 7: Commit the art direction**

```bash
git add style.css
git commit -m "feat: art direct hero composition"
```

---

### Task 5: Implement the Loader Deadline and Fallback Runtime

**Files:**
- Create: `main.js`
- Modify: `hero-policy.js` only if implementation exposes a missing pure branch
- Test: `tests/hero-policy.test.js`

**Interfaces:**
- Consumes: `[data-loader]`, `[data-loader-status]`, `[data-hero-poster]`, `.hero`, policy helpers
- Produces: loader always exits; `.hero.dataset.renderMode` is `poster` or `webgl`; poster remains usable through model/WebGL failure

- [ ] **Step 1: Add a failing policy test for a loading model**

Append to `tests/hero-policy.test.js`:

```js
test('a model that is still loading stays on the poster path', () => {
  assert.equal(
    resolveHeroMode({ webglSupported: true, modelState: 'loading', reducedMotion: false }),
    'poster'
  );
});
```

- [ ] **Step 2: Run the test**

```bash
npm test
```

Expected: PASS with the current minimal policy, proving that unresolved models are already treated as poster mode. If it fails because implementation changed earlier, fix only `resolveHeroMode` to preserve this behavior.

- [ ] **Step 3: Implement the loader deadline in `main.js` before WebGL code**

Start `main.js`:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  getRendererPixelRatio,
  resolveHeroMode,
  shouldRenderFrame,
} from './hero-policy.js';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector('.hero');
const loader = document.querySelector('[data-loader]');
const loaderStatus = document.querySelector('[data-loader-status]');
const poster = document.querySelector('[data-hero-poster]');
const canvas = document.querySelector('[data-hero-canvas]');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOADER_MIN_MS = 650;
const LOADER_MAX_MS = 1800;
const bootStartedAt = performance.now();
let loaderRevealed = false;

function revealPage() {
  if (loaderRevealed) return;
  loaderRevealed = true;
  const elapsed = performance.now() - bootStartedAt;
  const delay = Math.max(0, LOADER_MIN_MS - elapsed);

  window.setTimeout(() => {
    loader.classList.add('is-leaving');
    window.setTimeout(() => loader.remove(), 520);
  }, delay);
}

window.setTimeout(revealPage, LOADER_MAX_MS);
```

This hard timeout guarantees that asset failure cannot trap the visitor.

- [ ] **Step 4: Add WebGL capability detection with a poster default**

Append:

```js
function canUseWebGL() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(
      window.WebGL2RenderingContext && probe.getContext('webgl2') ||
      window.WebGLRenderingContext && probe.getContext('webgl')
    );
  } catch {
    return false;
  }
}

let modelState = 'loading';
hero.dataset.renderMode = resolveHeroMode({
  webglSupported: canUseWebGL(),
  modelState,
  reducedMotion,
});
```

- [ ] **Step 5: Build and verify the loader exits even before the model exists**

Temporarily rename the GLB for this check:

```bash
mv assets/models/hero-hand.glb assets/models/hero-hand.glb.off
npm run dev -- --host 0.0.0.0
```

Open the page and confirm the loader exits within about 1.8 seconds and the poster remains visible. Restore the model:

```bash
mv assets/models/hero-hand.glb.off assets/models/hero-hand.glb
```

- [ ] **Step 6: Commit the resilient loader base**

```bash
git add main.js hero-policy.js tests/hero-policy.test.js
git commit -m "feat: add resilient hero loader"
```

---

### Task 6: Build the Three.js Graphite Hand Scene

**Files:**
- Modify: `main.js`
- Test: `tests/hero-policy.test.js`

**Interfaces:**
- Consumes: `hero-hand.glb`, canvas, viewport size, visibility, pointer position, policy helpers
- Produces: `handGroup`, `camera`, `renderer`, `motionState`; upgrades `.hero.dataset.renderMode` to `webgl` after successful load

- [ ] **Step 1: Add a renderer-policy boundary test**

Append:

```js
test('pixel ratio never drops below 1', () => {
  assert.equal(getRendererPixelRatio(0.5, 390), 1);
});
```

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 2: Initialize the renderer and studio scene without post-processing**

Append to `main.js` after capability detection:

```js
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

const key = new THREE.RectAreaLight(0xf2f7ff, 7.2, 4.5, 4.5);
key.position.set(-3.2, 4.0, 3.6);
key.lookAt(0, 0.5, 0);
scene.add(key);

const rim = new THREE.DirectionalLight(0xe7f0f6, 3.0);
rim.position.set(4.2, 2.2, -3.5);
scene.add(rim);

const fill = new THREE.DirectionalLight(0xbfc5c7, 0.55);
fill.position.set(0, -2.5, 4.5);
scene.add(fill);

camera.position.set(0, 0.1, 6.4);
```

Purpose: three lights reveal anatomy like a photographed graphite sculpture; no colored glow or post-processing is needed.

- [ ] **Step 3: Load the GLB and replace every mesh material with the approved physical material**

```js
const gltfLoader = new GLTFLoader();
const graphiteMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x090a0a,
  roughness: 0.29,
  metalness: 0.17,
  clearcoat: 0.62,
  clearcoatRoughness: 0.22,
});

const modelPromise = new Promise((resolve, reject) => {
  gltfLoader.load(
    '/assets/models/hero-hand.glb',
    (gltf) => resolve(gltf.scene),
    undefined,
    reject
  );
});

modelPromise.then((model) => {
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
  model.position.sub(center);
  model.scale.setScalar(3.2 / maxAxis);
  handGroup.add(model);

  modelState = 'ready';
  hero.dataset.renderMode = resolveHeroMode({
    webglSupported: true,
    modelState,
    reducedMotion,
  });
  loaderStatus.textContent = 'HAND MODEL READY';
  revealPage();
}).catch((error) => {
  console.error('Hero hand failed to load:', error);
  modelState = 'failed';
  hero.dataset.renderMode = 'poster';
  loaderStatus.textContent = 'STATIC HERO READY';
  revealPage();
});
```

Do not animate a failed model path; the poster is the final usable fallback.

- [ ] **Step 4: Add resize handling and mobile pixel-ratio caps**

```js
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
```

- [ ] **Step 5: Add restrained pointer input without object chasing**

```js
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

const pointerEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion;

if (pointerEnabled) {
  window.addEventListener('pointermove', (event) => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    motionState.targetPointerYaw = THREE.MathUtils.degToRad(nx * 3.0);
    motionState.targetPointerPitch = THREE.MathUtils.degToRad(ny * -2.0);
  }, { passive: true });
}
```

- [ ] **Step 6: Render only while the hero and document are visible**

```js
let heroVisible = true;
let documentVisible = !document.hidden;

const heroObserver = new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
}, { threshold: 0 });
heroObserver.observe(hero);

document.addEventListener('visibilitychange', () => {
  documentVisible = !document.hidden;
});

function renderFrame() {
  requestAnimationFrame(renderFrame);
  if (!shouldRenderFrame(heroVisible, documentVisible)) return;

  motionState.pointerYaw += (motionState.targetPointerYaw - motionState.pointerYaw) * 0.055;
  motionState.pointerPitch += (motionState.targetPointerPitch - motionState.pointerPitch) * 0.055;

  handGroup.rotation.y = motionState.scrollYaw + motionState.pointerYaw;
  handGroup.rotation.x = motionState.scrollPitch + motionState.pointerPitch;
  handGroup.scale.setScalar(motionState.scrollScale);
  camera.position.z = motionState.cameraZ;
  renderer.render(scene, camera);
}
renderFrame();
```

- [ ] **Step 7: Verify success and failure paths**

Run:

```bash
npm test
npm run dev -- --host 0.0.0.0
```

Verify in browser devtools:

```text
Success path: canvas fades in, poster fades out, no Three.js console error.
Failure path: rename GLB, reload, loader exits, poster remains, console shows one explicit load error only.
Mobile: device pixel ratio is capped by policy and no pointer motion runs.
```

Restore any renamed asset before commit.

- [ ] **Step 8: Commit the live 3D scene**

```bash
git add main.js hero-policy.js tests/hero-policy.test.js
git commit -m "feat: render graphite hero hand"
```

---

### Task 7: Add Arrival, Idle, Pinned Scroll, and Reduced-Motion Choreography

**Files:**
- Modify: `main.js`
- Modify: `style.css` only for state hooks proven necessary by motion

**Interfaces:**
- Consumes: `motionState`, `handGroup`, camera, title/portfolio/meta elements, `.hero`, `.hero-exit`
- Produces: one arrival timeline; one pinned ScrollTrigger timeline; no scrub timeline when reduced motion is active

- [ ] **Step 1: Select the motion targets once**

Append near the DOM queries in `main.js`:

```js
const titleBayu = document.querySelector('.hero__name--bayu');
const titleAndika = document.querySelector('.hero__name--andika');
const portfolio = document.querySelector('.hero__portfolio');
const metaItems = document.querySelectorAll('.hero__meta, .hero__credit, .hero__scroll');
const guides = document.querySelector('.hero__guides');
const heroExit = document.querySelector('.hero-exit');
```

- [ ] **Step 2: Implement the restrained arrival after the loader reveals**

Add:

```js
function playArrival() {
  if (reducedMotion) {
    gsap.set([titleBayu, titleAndika, portfolio, metaItems], { clearProps: 'all' });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(titleBayu, { yPercent: 24, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85 }, 0)
    .fromTo(titleAndika, { yPercent: 28, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.08)
    .fromTo(portfolio, { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8 }, 0.18)
    .fromTo(metaItems, { opacity: 0 }, { opacity: 1, duration: 0.55, stagger: 0.05 }, 0.32)
    .fromTo('.hero__object', { scale: 0.86 }, { scale: 1, duration: 1.05, ease: 'expo.out' }, 0.02);
}
```

Call `playArrival()` from the loader reveal path once, not from every model-state change.

Purpose: one orchestrated page-load moment establishes hierarchy; no scattered bounce/fade spam.

- [ ] **Step 3: Add a tiny idle motion only when motion is allowed**

Do not create a looping GSAP tween on the hand rotation because the render loop already owns rotation. Add an elapsed-time float in `renderFrame()`:

```js
const clock = new THREE.Clock();
```

Then before rendering:

```js
const elapsed = clock.getElapsedTime();
const idleY = reducedMotion ? 0 : Math.sin(elapsed * 0.55) * 0.025;
handGroup.position.y = idleY;
```

Purpose: maintain life without advertising the animation itself.

- [ ] **Step 4: Implement the pinned scroll timeline for desktop and mobile**

Add:

```js
function buildScrollMotion() {
  if (reducedMotion) return;

  const compact = window.innerWidth < 768;
  const endDistance = Math.round(window.innerHeight * (compact ? 1.5 : 1.6));

  const tl = gsap.timeline({
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

  tl.to(motionState, {
    scrollYaw: THREE.MathUtils.degToRad(compact ? 13 : 18),
    scrollPitch: THREE.MathUtils.degToRad(compact ? -4 : -6),
    scrollScale: compact ? 1.1 : 1.14,
    cameraZ: compact ? 6.0 : 5.85,
    ease: 'none',
    duration: 0.65,
  }, 0)
  .to(titleBayu, { xPercent: -18, opacity: 0.28, ease: 'none', duration: 0.48 }, 0.34)
  .to(titleAndika, { xPercent: -26, opacity: 0.18, ease: 'none', duration: 0.52 }, 0.38)
  .to(portfolio, { xPercent: 22, opacity: 0.24, ease: 'none', duration: 0.45 }, 0.47)
  .to(guides, { opacity: 0.12, ease: 'none', duration: 0.35 }, 0.56)
  .to(motionState, {
    scrollYaw: THREE.MathUtils.degToRad(compact ? 17 : 22),
    scrollPitch: THREE.MathUtils.degToRad(compact ? -5 : -8),
    scrollScale: compact ? 1.22 : 1.34,
    cameraZ: compact ? 5.75 : 5.45,
    ease: 'none',
    duration: 0.35,
  }, 0.65)
  .fromTo(heroExit, { yPercent: 18 }, { yPercent: 0, ease: 'none', duration: 0.28 }, 0.72);
}

buildScrollMotion();
```

The timeline keeps one dominant action at a time: camera/hand movement leads; type separation and guide fading support it.

- [ ] **Step 5: Make resize rebuild ScrollTrigger without accumulating timelines**

Store the returned ScrollTrigger/timeline instead of repeatedly creating new ones. Use one cleanup/rebuild path:

```js
let scrollTimeline;

function rebuildScrollMotion() {
  scrollTimeline?.scrollTrigger?.kill();
  scrollTimeline?.kill();
  if (reducedMotion) return;

  // Move the Task 7 timeline creation body here and assign it to scrollTimeline.
  ScrollTrigger.refresh();
}
```

Use a short resize debounce with native `setTimeout`; do not add a utility dependency.

- [ ] **Step 6: Verify reduced motion has no long pin/scrub**

In browser devtools, emulate `prefers-reduced-motion: reduce` and reload.

Expected:

```text
Loader exits quickly.
Poster path remains readable.
No pinned 160vh choreography.
No pointer influence.
No repeating visible animation.
All title and portfolio copy remain present.
```

- [ ] **Step 7: Verify motion dosage against the approved anti-slop rule**

At any single point in the hero, identify:

```text
Dominant movement: hand/camera observation.
Supporting movement 1: title separation.
Supporting movement 2: guide/meta attenuation.
```

If another conspicuous movement competes at the same moment, remove it rather than adding timing complexity.

- [ ] **Step 8: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS and successful build.

- [ ] **Step 9: Commit the choreography**

```bash
git add main.js style.css
git commit -m "feat: choreograph hero scroll motion"
```

---

### Task 8: Visual Tuning, Mobile Performance, Anti-Slop Gate, and Final Verification

**Files:**
- Modify: `style.css` for measured composition adjustments only
- Modify: `main.js` for measured light/camera/timing adjustments only
- Modify: `assets/models/hero-hand.glb` only if geometry/pose is the measured problem
- Modify: `assets/images/hero-hand-poster.webp` if the final camera/pose changes

**Interfaces:**
- Consumes: completed hero build and approved reference
- Produces: verified deliverable evidence with no known broken path

- [ ] **Step 1: Run automated checks first**

```bash
npm test
npm run build
```

Expected: every Node test PASS; Vite build succeeds.

- [ ] **Step 2: Start the production preview and inspect console**

```bash
npm run preview -- --host 0.0.0.0
```

Check the browser console through one full loader, hero arrival, pinned scroll, resize, and return-to-top cycle.

Expected: no uncaught error, no missing asset request, no ScrollTrigger warning.

- [ ] **Step 3: Compare the three required viewports**

Use the approved reference and capture implementation screenshots at:

```text
1440 x 900
768 x 1024 or 768 x the available viewport height
390 x 844 and/or 412 x the target Android viewport
```

For each viewport, evaluate exactly these six properties:

```text
1. Hand silhouette and crop.
2. BAYU / ANDIKA scale and offset.
3. / CAREER PORTFOLIO counterweight position.
4. Negative-space balance.
5. Guide-line dosage.
6. Scroll exit timing.
```

Change only the variable responsible for the mismatch. Do not compensate for a bad hand pose by adding CSS decoration.

- [ ] **Step 4: Tune material/light/camera inside the approved ranges**

Use these bounds:

```text
roughness: 0.26 to 0.32
metalness: 0.12 to 0.22
clearcoat: 0.55 to 0.70
clearcoat roughness: 0.18 to 0.25
camera FOV: 32 to 37 degrees
scroll yaw: 16 to 22 degrees desktop
scroll pitch: 5 to 8 degrees desktop
```

If form is unreadable, change light placement/intensity before adding glow or bloom.

- [ ] **Step 5: Verify mobile performance on the user's actual Android phone**

Check:

```text
Loader does not hang.
Scrolling remains responsive.
No horizontal overflow.
No browser crash or tab reload.
WebGL canvas does not show oversized resolution artifacts.
Orientation change recovers without reload.
```

If mobile visibly stutters, apply fixes in this order:

```text
1. Lower mobile renderer pixel ratio cap from 1.5 to 1.25.
2. Reduce GLB geometry in Blender while preserving silhouette.
3. Reduce key/rim light complexity only if profiling points there.
4. Fall back to the poster on the affected low-end device class.
```

Do not add Lenis or post-processing to solve performance.

- [ ] **Step 6: Test the GLB failure path again in the production preview**

```bash
mv assets/models/hero-hand.glb assets/models/hero-hand.glb.off
npm run build
npm run preview -- --host 0.0.0.0
```

Expected: loader exits, static poster remains, content readable, no navigation loss.

Restore and rebuild:

```bash
mv assets/models/hero-hand.glb.off assets/models/hero-hand.glb
npm run build
```

- [ ] **Step 7: Run the Mode 1 Anti-Slop delivery gate**

Verify all statements are true:

```text
[PASS] No em dash in UI copy.
[PASS] No fake statistics, testimonial, award, claim, date range, or dead destination.
[PASS] Palette is graphite/off-white with no purple/cyan/pink glow stack.
[PASS] Dark mode has an explicit sculptural/studio purpose.
[PASS] Guide lines support archival alignment; they are not a full decorative graph grid.
[PASS] Departure Mono has a stated pixel-archive purpose.
[PASS] Instrument Sans has a stated readable editorial-support purpose.
[PASS] Asymmetry exists because the hand participates in the type composition.
[PASS] Motion guides attention and follows the approved GERAK 3 choreography.
[PASS] No glassmorphism, pill-card system, generic feature grid, or template CTA exists.
[PASS] Mobile composition is intentional and has no horizontal overflow.
[PASS] Focus state is visible on the real BAYU home link.
[PASS] Model and font licenses are recorded.
[PASS] The hero still has character when the BAYU name is temporarily hidden during review.
[PASS] Build and runtime verification have actually been performed.
```

If any item fails, fix that item before continuing. Do not mark the implementation complete with an Anti-Slop failure.

- [ ] **Step 8: Final source scan**

```bash
grep -RInE '—|purple|cyan|pink|href="#"|Get Started|Learn More|Try Now|Explore|Discover|10K\+|99\.9' index.html style.css main.js || true
```

Expected: no user-facing slop/fake-content matches. A code comment mentioning a prohibited color is still unnecessary and should be removed unless it documents a test.

- [ ] **Step 9: Final git review**

```bash
git status --short
git diff --check
git log --oneline -8
```

Expected: clean diff formatting, intended files only, incremental task commits visible.

- [ ] **Step 10: Commit final measured tuning**

```bash
git add index.html style.css main.js hero-policy.js tests assets package.json package-lock.json
git commit -m "fix: tune and verify hero quality"
```

If no files changed during final tuning, do not create an empty commit.

---

## Plan Self-Review

### Spec coverage

- Legal model source + license record: Task 1.
- OK gesture close to approved reference: Task 1.
- Poster fallback: Tasks 1, 3, 5, 6, 8.
- Departure Mono + editorial support font with license: Task 2.
- Graphite/ice-white palette and material ranges: Tasks 4, 6, 8.
- Three-light studio setup: Task 6.
- 35-degree editorial camera: Task 6.
- Asymmetric typography/object composition: Tasks 3-4.
- Mobile dedicated composition: Task 4.
- Loader deadline and no fake progress: Tasks 4-5.
- Pointer limits and mobile disablement: Task 6.
- 150-170vh pinned choreography: Task 7.
- Reduced motion: Tasks 4, 5, 7, 8.
- WebGL/model failure: Tasks 5, 6, 8.
- Rendering lifecycle and visibility pause: Task 6.
- WCAG/focus/no dead controls: Tasks 3-4, 8.
- Anti-Slop Mode 1 gate: Global Constraints + Task 8.
- Build/runtime verification: every implementation task and Task 8.

### Type and interface consistency

- `getRendererPixelRatio`, `resolveHeroMode`, and `shouldRenderFrame` are defined in Task 2 and consumed by Tasks 5-6.
- `motionState` is defined in Task 6 and consumed by Task 7.
- DOM class names defined in Task 3 are the same selectors consumed in Tasks 4-7.
- Asset names match the approved spec exactly: `hero-hand.glb`, `hero-hand-poster.webp`, `LICENSE-HERO-HAND.md`.

### Scope check

This plan implements only the approved hero subsystem. Career dashboard, project index, tools, footer, and full-site navigation are intentionally excluded and should receive separate specs/plans after this hero passes its quality gate.
