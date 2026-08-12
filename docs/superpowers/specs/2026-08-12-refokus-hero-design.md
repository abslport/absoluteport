# Bayu Andika Refokus-Style Hero Design Spec

Date: 2026-08-12
Status: Approved design direction, pending user review of written spec
Scope: Hero experience only

## 1. Goal

Build a cinematic interactive hero for Bayu Andika's career portfolio that captures the spatial logic, pacing, sculptural focus, and editorial tension of the Refokus 2021 hero while using original content, original implementation, and a legally sourced hand model.

The quality target is a 99% similarity of feel in the hero experience, not a pixel-identical copy of Refokus assets or branding.

The hero must feel like an art-directed digital archive, not a generic dark portfolio, tech landing page, or AI-generated composition.

## 2. Governing Design Direction

Design reading:

- Tone: editorial, sculptural, technical, restrained, premium.
- ENERGI: 3/3. One dominant sculptural moment, strong type scale, high contrast.
- RITME: 3/3. Asymmetric overlap, shifting hierarchy, deliberate empty space.
- GERAK: 3/3. Cinematic scroll choreography, restrained idle motion, no decorative animation spam.

Core visual statement:

> A graphite-black hand photographed under cold studio light, then brought to life by scroll.

Anti-slop rule: every visual technique must have a stated purpose. If the logo and name are removed, the composition must still feel specific and art-directed.

## 3. Approved Decisions

- Hero object: 3D hand.
- Gesture direction: visually close to the Refokus hero gesture.
- Asset source: a legally licensed base hand model, then fully restyled.
- Material direction: graphite black lacquer, not chrome and not liquid metal.
- Lighting: graphite plus ice white, no purple, cyan, pink, or neon gradient treatment.
- Typography: pixel display plus editorial supporting typography.
- Loader: silhouette hand teaser.
- Headline: `BAYU ANDIKA / CAREER PORTFOLIO`.
- Composition: asymmetric overlap. The hand intersects the typography and becomes part of the layout.
- Motion: hero pinned for a long cinematic scroll, with camera observation and controlled hand rotation.

## 4. Non-Goals

The first implementation will not include:

- A full-site rebuild.
- Decorative orbit objects.
- Purple or blue neon glows.
- Generic glass cards around the hero.
- Full 360-degree hand spin.
- Aggressive pointer-follow motion.
- Fake statistics, testimonials, awards, or unverifiable claims.
- Navigation links to sections that do not exist yet.
- Smooth-scroll dependencies unless native scroll plus ScrollTrigger is measurably insufficient.

This keeps the first build focused on the hero quality bar.

## 5. Desktop Composition

Primary design target: 1440 x 900 viewport.

Layer order from back to front:

1. Very faint ghost typography.
2. Sparse technical guide structure.
3. `BAYU / ANDIKA` display type.
4. Three.js hand.
5. `/ CAREER PORTFOLIO` counterweight.
6. Minimal metadata and navigation.

The hand sits slightly off-center and occupies roughly 55% to 65% of viewport height at rest. It is intentionally allowed to intersect and partially obscure selected headline characters.

The title is not centered. `BAYU` and `ANDIKA` are offset to create editorial rhythm. `/ CAREER PORTFOLIO` sits on the opposite side as a counterweight.

Micro-labels are capped at three or four visible items. They must carry real information, not decorative fake system text.

## 6. Mobile Composition

Target range: 390 to 430 px wide.

Mobile is a dedicated composition, not a scaled desktop layout.

- Hand target height: roughly 50% to 58% of viewport height.
- `BAYU / ANDIKA` stays readable and retains overlap without losing hierarchy.
- `/ CAREER PORTFOLIO` moves to a lower counterweight position.
- Nonessential technical labels are removed.
- Pointer interaction is disabled.
- Tap targets are at least 44 px.
- No horizontal overflow is allowed.
- WebGL pixel ratio is capped for performance.

## 7. Loader Choreography

Target total duration: approximately 1.4 to 1.8 seconds on a normal device, with a hard fallback that never traps the visitor behind a completed loader.

Sequence:

1. Graphite-black screen.
2. Large hand silhouette appears as a teaser.
3. Minimal real status text, not fake terminal jargon.
4. Very small breathing movement in the silhouette.
5. Silhouette enlarges slightly and dissolves into the live 3D hero.

No spinner. No prolonged wait at 100%. No glow stack. No glitch spam.

If the 3D model is not ready by the loader deadline, the hero opens using a static fallback silhouette or poster image and upgrades to WebGL when ready.

## 8. Hand Asset Pipeline

The hand starts from a legally usable base model. Before use, record the source and license in the repository.

Restyle steps:

1. Choose a high-quality hand mesh with believable finger proportions and joint detail.
2. Pose it close to the approved Refokus-like gesture without copying the source asset itself.
3. Remove unnecessary scene data, lights, cameras, animations, and hidden geometry.
4. Optimize geometry and texture size only as needed for stable mobile performance.
5. Export as `.glb`.
6. Keep a static poster fallback for devices that cannot sustain WebGL.

Final asset naming:

- `assets/models/hero-hand.glb`
- `assets/images/hero-hand-poster.webp`
- `assets/models/LICENSE-HERO-HAND.md`

## 9. Hand Material

Target material values are tuning ranges, not rigid constants:

- Base color: approximately `#090A0A`.
- Roughness: 0.26 to 0.32.
- Metalness: 0.12 to 0.22.
- Clearcoat: 0.55 to 0.70.
- Clearcoat roughness: 0.18 to 0.25.

Purpose: preserve anatomical form through controlled specular response while keeping the object closer to lacquered graphite sculpture than metal or plastic.

Micro-roughness variation can be added only if the base material reads too synthetic.

## 10. Lighting

Use a restrained three-light studio setup:

### Key light

- Large soft area light.
- Upper-left placement.
- Cold ice-white tone.
- Dominant source for hand volume.

### Rim light

- Rear-right placement.
- Narrow cold-white highlight.
- Medium strength.
- Purpose: define the silhouette against the graphite background.

### Fill light

- Front-lower placement.
- Neutral gray-white.
- Very low intensity.
- Purpose: prevent important form from disappearing in shadow.

No purple, cyan, pink, or multi-color neon lighting.

## 11. Camera

Use a perspective camera with a relatively narrow field of view, approximately 32 to 37 degrees.

Purpose: make the hand read like an editorial photographed sculpture instead of a generic Three.js demo.

At rest, the camera should allow controlled crop and depth without visible perspective distortion. During scroll, the camera performs a small dolly-in while the hand rotates within a limited range.

## 12. Hero Motion Choreography

### Phase 1: Arrival

- Loader silhouette dissolves into the live hand.
- Hand scale moves approximately 0.86 to 1.0.
- `BAYU ANDIKA` reveals first.
- `/ CAREER PORTFOLIO` follows with a small delay.
- Character stagger is short and restrained.

### Phase 2: Idle

- Very small float and micro-rotation only.
- Desktop pointer influence: roughly plus or minus 1.5 degrees yaw and plus or minus 1 degree pitch.
- Motion uses damping so the object never chases the cursor.
- Mobile has no pointer response.

### Phase 3: Pinned scroll

Hero pin distance target: approximately 150 to 170 viewport-height percent. Exact value is tuned against the final model and viewport.

From 0% to 25% scroll:

- Small camera dolly-in.
- Hand yaw changes by about 4 degrees.

From 25% to 65% scroll:

- Hand yaw reaches a total range of about 16 to 22 degrees.
- Pitch changes about 5 to 8 degrees.
- Typography begins separating from the hand.

From 65% to 100% scroll:

- Camera moves closer.
- Hand grows until parts of the fingers crop out of frame.
- Headline exits in opposing directions.
- The next section begins to enter.

Motion rule: one dominant movement plus at most two supporting movements in any moment.

## 13. Typography

Use a two-level system:

### Display

Pixel or bitmap-influenced display face for `BAYU ANDIKA` and `CAREER PORTFOLIO`.

Purpose: connect the hero to the year-in-review digital archive language.

Do not use a generic system sans, Inter, Arial, or a gamer-style techno face as the final display font.

### Editorial support

A refined supporting face for metadata, role, location, and navigation.

Purpose: counterbalance the display type and keep the composition readable.

Desktop scale targets:

- `BAYU`: 11 to 15vw.
- `ANDIKA`: 9 to 13vw.
- `CAREER`: 5 to 7vw.
- `PORTFOLIO`: 5 to 7vw.
- Micro labels: 10 to 12 px.
- Editorial copy: 14 to 18 px.

The exact font files must be licensed or explicitly approved before shipping.

## 14. Palette

Core palette:

- Background: `#050606`.
- Hand: approximately `#090A0A`.
- Primary text: `#F1F0EB`.
- Muted text: a WCAG-compliant muted variant chosen after contrast testing.
- Hairlines: low-opacity off-white, only where structure requires them.
- Light accent: cold ice white from the 3D lighting, not a UI accent color.

No theme toggle in this phase. The dark direction is intentional because the sculptural hand and silhouette loader depend on controlled low-key studio contrast.

## 15. Background Treatment

The background is intentionally restrained.

Allowed elements:

- Very faint graphite falloff around the hand to preserve silhouette.
- Sparse technical guide lines only where they clarify composition.
- Grain at approximately 2% to 4% perceived opacity.

Grid or blueprint treatment is not a default decoration. If guide lines are used, their purpose is to reinforce the archival layout and align the typographic composition.

If the grain is consciously visible as an effect, it is too strong.

## 16. Navigation and Interaction

Hero navigation is minimal:

- `BAYU` or the approved wordmark returns to the top.
- `INDEX` is included only when a real index or navigation overlay exists.
- No links are rendered for unfinished sections.

Every interactive element must have a real destination or behavior.

Keyboard requirements:

- Visible focus state.
- Enter activates links and controls.
- Escape closes any overlay introduced later.
- WebGL is decorative and never blocks keyboard navigation.

## 17. Architecture

Keep the first implementation intentionally small.

Recommended files:

- `index.html`
- `style.css`
- `main.js`
- `assets/models/hero-hand.glb`
- `assets/images/hero-hand-poster.webp`
- `assets/models/LICENSE-HERO-HAND.md`

Dependencies:

- `three` for WebGL rendering.
- `gsap` plus ScrollTrigger for pinned scroll choreography.

Do not add React, Lenis, a component framework, post-processing libraries, or animation wrappers unless a measured problem requires them.

The existing starter is disposable scaffolding. The final hero should be written directly in source rather than patched by an external script.

## 18. Runtime Flow

1. DOM becomes interactive.
2. Loader starts immediately.
3. Static hand silhouette is visible without waiting for WebGL.
4. Three.js initializes in parallel.
5. GLB loads and is prepared offscreen.
6. Loader exits by its deadline.
7. If GLB is ready, transition directly to the live hand.
8. If GLB is not ready, show poster fallback and upgrade when the model becomes ready.
9. GSAP ScrollTrigger owns the pinned hero timeline.
10. `requestAnimationFrame` renders WebGL only while the hero is active or visible.

## 19. Error and Fallback Handling

- GLB load failure: keep poster fallback, hide WebGL canvas, continue the page.
- WebGL unsupported: poster fallback only.
- Reduced motion preference: disable long scrub choreography, use a short static reveal, keep all content readable.
- Tab hidden: pause unnecessary rendering.
- Resize and orientation change: update camera and renderer dimensions without page reload.
- Loader timeout: always reveal content even if assets fail.

No asset failure is allowed to trap the user on the loading screen.

## 20. Performance Targets

Quality takes priority, but the hero must remain usable on mobile.

Targets:

- Stable interaction on modern Android and desktop browsers.
- Renderer pixel ratio capped, especially on mobile.
- Avoid unnecessary post-processing.
- No continuous heavy DOM layout work during scroll.
- Animate transforms, opacity, camera, and object transforms rather than layout properties.
- Render loop pauses or reduces work when the hero is offscreen.

Asset size limits will be set after selecting the actual hand model, based on measured load and render performance rather than arbitrary compression.

## 21. Testing

Minimum verification before delivery:

### Visual

Compare reference and implementation at:

- 1440 x 900 desktop.
- 768 px tablet width.
- 390 or 412 px mobile width.

Check hierarchy, hand crop, overlap, text scale, negative space, and scroll timing.

### Functional

- Loader always exits.
- Model success path works.
- Model failure path works.
- Poster fallback works.
- All links have real destinations.
- Keyboard focus is visible.
- Reduced-motion mode is usable.

### Performance

- Verify scroll does not visibly stutter on target phone.
- Verify no horizontal overflow.
- Verify resize and orientation changes.
- Verify WebGL does not continue expensive rendering when unnecessary.

## 22. Anti-Slop Delivery Gate for This Hero

The hero cannot ship unless all are true:

- No em dash in UI copy.
- No fake data, testimonials, awards, or claims.
- No dead controls or ghost navigation links.
- Mobile has no overflow and remains intentionally composed.
- Text contrast passes WCAG AA.
- Keyboard focus is visible.
- The hand asset source and license are recorded.
- No purple/cyan AI gradient or decorative glow stack.
- Grid or guide lines have a stated archival/compositional purpose.
- Typography choices have a stated brand purpose.
- Motion follows the approved GERAK 3 choreography, not a generic fade-up template.
- The design retains character even when Bayu's name is temporarily removed for review.
- Every major visual decision can be justified in one sentence.
- The built page is actually run and tested before delivery.

## 23. Acceptance Criteria

The hero is accepted when:

1. The opening silhouette transitions cleanly into the live 3D hand or fallback poster.
2. The hand reads as graphite-black sculptural material under ice-white studio lighting.
3. There is no purple, cyan, pink, or neon-gradient treatment.
4. The composition is clearly asymmetric and the hand physically participates in the typography layout.
5. Scroll motion feels camera-led and sculptural, not like a spinning 3D demo.
6. Desktop and mobile both preserve the same design identity.
7. Reduced-motion and WebGL-failure paths remain fully usable.
8. No fake portfolio facts are introduced.
9. All shipped interactions work.
10. The Anti-Slop delivery gate passes with concrete evidence.

## 24. Next Step After Written Spec Approval

After the user reviews and approves this written spec, create the implementation plan. The plan must begin with legal hand-model acquisition and license recording, then build the hero in small verifiable stages.
