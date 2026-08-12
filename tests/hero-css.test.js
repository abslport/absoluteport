import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'));
  assert.ok(match, `missing CSS block for ${selector}`);
  return match[1];
}

test('loader silhouette remains visible on the graphite background', () => {
  const rules = block('.loader__silhouette');
  assert.doesNotMatch(rules, /brightness\(0(?:\.0+)?\)/);
  assert.match(rules, /opacity:\s*(?:0\.[3-9]|1)/);
});

test('loader and hero hand share the same composition anchors', () => {
  const loaderRules = block('.loader__silhouette');
  const heroRules = block('.hero__object');

  for (const property of ['left', 'top', 'width', 'height']) {
    const token = `var(--hero-hand-${property})`;
    assert.match(loaderRules, new RegExp(`${property}:\\s*${token.replace(/[()\-]/g, '\\$&')}`));
    assert.match(heroRules, new RegExp(`${property}:\\s*${token.replace(/[()\-]/g, '\\$&')}`));
  }
});
