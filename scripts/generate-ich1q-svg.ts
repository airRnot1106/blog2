import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';

import { render, type RenderOptions } from 'satoru-render';

const FONT_URL = 'https://cloud.ich1q.one/s/YiAfAKScqFgMDHj/download/ich1Q-hand-Regular.ttf';
const FONT_PATH = 'private/ich1Q-hand-Regular.ttf';
const FONT_FAMILY = 'ich1Q-hand';
const OUT_DIR = 'src/images/ich1q';
// satoru bakes a concrete color into the rendered fill attribute; this value is
// discarded and replaced with currentColor below, so its actual value is irrelevant.
const RENDER_FILL_COLOR = '#000000';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function printUsage(): void {
  console.error(
    [
      'Usage: pnpm gen:ich1q-svg --text <text> --out <filename.svg> [options]',
      '',
      `Font (${FONT_FAMILY}) is auto-downloaded to ${FONT_PATH} on first use and cached there.`,
      `Output is written under ${OUT_DIR}/. Glyph fill is always currentColor, and a`,
      'viewBox is added so the inlined <svg> can be resized via CSS (e.g. height: 1em).',
      '',
      'Required:',
      '  -t, --text <text>          Text to render',
      '  -o, --out <filename.svg>   Output SVG filename (relative to src/images/ich1q/)',
      '',
      'Optional:',
      '  -w, --width <px>           Layout/canvas width (default: 1200)',
      '      --height <px>         Layout/canvas height (default: auto by content)',
      '      --font-size <px>      (default: 64)',
      '      --font-weight <n>     (default: 400)',
      '      --background <css-color> (default: transparent)',
      '      --letter-spacing <px>',
      '      --refresh             Re-download the font even if already cached',
    ].join('\n'),
  );
}

function ensureViewBox(svgMarkup: string): string {
  const svgTagMatch = /<svg\b[^>]*>/.exec(svgMarkup);
  const svgTag = svgTagMatch?.[0];
  if (!svgTag || svgTag.includes('viewBox=')) {
    return svgMarkup;
  }
  const width = /\bwidth="([\d.]+)"/.exec(svgTag)?.[1];
  const height = /\bheight="([\d.]+)"/.exec(svgTag)?.[1];
  if (!width || !height) {
    return svgMarkup;
  }
  const patchedTag = svgTag.replace('<svg ', `<svg viewBox="0 0 ${width} ${height}" `);
  return svgMarkup.replace(svgTag, patchedTag);
}

async function ensureFont(refresh: boolean): Promise<Uint8Array> {
  if (!refresh) {
    try {
      return new Uint8Array(await readFile(FONT_PATH));
    } catch {
      // not cached yet, fall through to download
    }
  }
  const res = await fetch(FONT_URL);
  if (!res.ok) {
    throw new Error(`Failed to download font: ${res.status} ${res.statusText}`);
  }
  const data = new Uint8Array(await res.arrayBuffer());
  await mkdir(dirname(FONT_PATH), { recursive: true });
  await writeFile(FONT_PATH, data);
  return data;
}

const { values } = parseArgs({
  options: {
    text: { type: 'string', short: 't' },
    out: { type: 'string', short: 'o' },
    width: { type: 'string', short: 'w', default: '1200' },
    height: { type: 'string' },
    'font-size': { type: 'string', default: '64' },
    'font-weight': { type: 'string', default: '400' },
    background: { type: 'string' },
    'letter-spacing': { type: 'string' },
    refresh: { type: 'boolean', default: false },
  },
});

const { text, out } = values;
if (!text || !out) {
  printUsage();
  process.exit(1);
}

const fontData = await ensureFont(values.refresh);

const style = [
  `font-family:'${FONT_FAMILY}'`,
  `font-size:${values['font-size']}px`,
  `font-weight:${values['font-weight']}`,
  `color:${RENDER_FILL_COLOR}`,
  'margin:0',
  'padding:0',
  ...(values['letter-spacing'] ? [`letter-spacing:${values['letter-spacing']}px`] : []),
].join(';');

const html = `<div style="${style}">${escapeHtml(text)}</div>`;

const renderOptions: RenderOptions = {
  value: html,
  width: Number(values.width),
  format: 'svg',
  fonts: [{ name: FONT_FAMILY, data: fontData }],
  textToPaths: true,
};
if (values.height) {
  renderOptions.height = Number(values.height);
}
if (values.background) {
  renderOptions.backgroundColor = values.background;
}

const rendered = await render(renderOptions);
if (typeof rendered !== 'string') {
  throw new Error('Expected SVG string output from render()');
}
const svg = ensureViewBox(rendered.replaceAll(/fill="rgb\([^)]*\)"/g, 'fill="currentColor"'));

const outPath = join(OUT_DIR, out);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, svg);

console.log(`Wrote ${outPath}`);
