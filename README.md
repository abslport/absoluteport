# BAYU ANDIKA — Vermilion Noir Portfolio

A single-page cinematic portfolio built with semantic HTML, CSS, vanilla JavaScript, and one persistent Three.js WebGL scene.

## What is inside

- 7 scroll-driven chapters: Prologue, Origin, System, Industry, Precision, Beyond / V-Forge, Archive.
- Full WebGL world with procedural geometry, fog, lighting, particles, and chapter-specific motion.
- V-Forge flagship scene with a 3D monolith and floating editor panels.
- Adaptive mobile render quality, reduced-motion mode, and readable DOM fallback if WebGL fails.
- No build step, framework, remote font, analytics, or runtime CDN dependency.

## Run locally

From this directory:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

## Verify

```bash
node --test tests/core.test.mjs
node --check app.js
node --check core.mjs
```

## Deploy to Vercel

This is a static site. Import the repository/project into Vercel and deploy with no build command. The project root is the output directory.

If replacing an existing portfolio project, replace its served static files with:

```text
index.html
styles.css
core.mjs
app.js
vendor/three.min.js
```

## Deploy to GitHub Pages

All runtime assets use relative paths, so the site can be hosted from a repository subpath. Enable Pages for the branch/folder that contains `index.html`.

## Structure

```text
.
├── index.html
├── styles.css
├── core.mjs
├── app.js
├── vendor/
│   └── three.min.js
├── tests/
│   └── core.test.mjs
└── docs/superpowers/
    ├── specs/
    └── plans/
```

## Reference boundary

The experience takes high-level inspiration from Meng To's Kage project: persistent WebGL, editorial chapters, scroll-driven camera choreography, atmospheric depth, and reduced-motion support. Kage source code, scene composition, and original artwork are not reused.

`vendor/three.min.js` is Three.js r149 and retains its MIT license header.
