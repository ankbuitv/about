import { CONFIG } from "./config";
import { glyphOf } from "./font";
import { blend, encodePng, fillRect } from "./png";

export interface OgStats {
  repos: number;
  stars: number;
  followers: number;
}

const W = 1200;
const H = 630;

function put(
  rgba: Uint8Array,
  x: number,
  y: number,
  color: [number, number, number, number],
): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  blend(rgba, W, x, y, color);
}

function textWidth(text: string, scale: number, gap: number): number {
  let w = 0;
  for (const ch of text) {
    const g = glyphOf(ch);
    const cols = g ? g.rows[0].length : 5;
    w += cols * scale + gap;
  }
  return Math.max(0, w - gap);
}

function drawText(
  rgba: Uint8Array,
  text: string,
  x: number,
  y: number,
  scale: number,
  color: [number, number, number, number],
  gap = scale,
): void {
  let cx = x;
  for (const ch of text) {
    const g = glyphOf(ch);
    if (!g) {
      cx += 5 * scale + gap;
      continue;
    }
    const rows = g.rows;
    const extra = Math.max(0, rows.length - 7);
    const y0 = y - extra * scale;
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        if (rows[row][col] !== "1") continue;
        fillRect(
          rgba,
          W,
          H,
          cx + col * scale,
          y0 + row * scale,
          Math.max(1, scale - (scale > 3 ? 1 : 0)),
          Math.max(1, scale - (scale > 3 ? 1 : 0)),
          color,
        );
      }
    }
    cx += rows[0].length * scale + gap;
  }
}

function diamond(rgba: Uint8Array, cx: number, cy: number, r: number, color: [number, number, number, number]): void {
  for (let y = -r; y <= r; y++) {
    const span = r - Math.abs(y);
    for (let x = -span; x <= span; x++) {
      const edge = Math.abs(x) + Math.abs(y);
      if (edge > r - 3 && edge <= r) put(rgba, cx + x, cy + y, color);
      else if (edge <= r * 0.42) put(rgba, cx + x, cy + y, color);
    }
  }
}

function roundRect(
  rgba: Uint8Array,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fill: [number, number, number, number],
  stroke: [number, number, number, number],
): void {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      const dx = xx < radius ? radius - xx : xx >= w - radius ? xx - (w - radius - 1) : 0;
      const dy = yy < radius ? radius - yy : yy >= h - radius ? yy - (h - radius - 1) : 0;
      if (dx && dy && dx * dx + dy * dy > radius * radius) continue;
      const edge = xx === 0 || yy === 0 || xx === w - 1 || yy === h - 1 || (dx && dy && dx * dx + dy * dy > (radius - 1.5) * (radius - 1.5));
      put(rgba, x + xx, y + yy, edge ? stroke : fill);
    }
  }
}

export async function renderOgPng(stats: OgStats): Promise<Uint8Array> {
  const rgba = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const t = y / H;
    const r = 7 + Math.round(10 * (1 - t));
    const g = 8 + Math.round(14 * (1 - t));
    const b = 12 + Math.round(22 * (1 - t));
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = 255;
    }
  }
  for (let y = 0; y < 420; y++) {
    for (let x = 0; x < 760; x++) {
      const dx = x - 180;
      const dy = y - 40;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 420) {
        const a = Math.round(28 * (1 - d / 420));
        put(rgba, x, y, [90, 140, 190, a]);
      }
    }
  }
  for (let y = 40; y < H - 40; y += 44) {
    for (let x = 48; x < W - 48; x++) put(rgba, x, y, [255, 255, 255, 8]);
  }
  for (let x = 48; x < W - 48; x += 44) {
    for (let y = 40; y < H - 40; y++) put(rgba, x, y, [255, 255, 255, 8]);
  }

  diamond(rgba, 92, 78, 18, [143, 208, 255, 255]);
  drawText(rgba, "ANKBUI OS", 122, 64, 3, [232, 234, 240, 255], 2);

  const name = CONFIG.name;
  drawText(rgba, name, 72, 168, 8, [244, 247, 251, 255], 6);
  drawText(rgba, CONFIG.role, 72, 268, 4, [143, 208, 255, 255], 3);
  const roleW = textWidth(CONFIG.role, 4, 3);
  drawText(rgba, "  ·  @" + CONFIG.username, 72 + roleW, 268, 4, [154, 163, 178, 255], 3);

  const cards = [
    [String(stats.repos), "REPOS"],
    [String(stats.stars), "STARS"],
    [String(stats.followers), "FOLLOWERS"],
  ] as const;
  cards.forEach((card, i) => {
    const x = 72 + i * 300;
    roundRect(rgba, x, 360, 276, 168, 18, [255, 255, 255, 14], [255, 255, 255, 28]);
    const numScale = card[0].length > 3 ? 7 : 9;
    const nw = textWidth(card[0], numScale, numScale > 7 ? 4 : 5);
    drawText(rgba, card[0], x + Math.round((276 - nw) / 2), 392, numScale, [232, 234, 240, 255], numScale > 7 ? 4 : 5);
    const lw = textWidth(card[1], 3, 2);
    drawText(rgba, card[1], x + Math.round((276 - lw) / 2), 478, 3, [143, 208, 255, 230], 2);
  });

  drawText(rgba, "github.com/" + CONFIG.github, 72, 568, 3, [92, 100, 112, 255], 2);
  const foot = "ANKBUI OS";
  const fw = textWidth(foot, 3, 2);
  drawText(rgba, foot, W - 72 - fw, 568, 3, [92, 100, 112, 255], 2);
  return encodePng(W, H, rgba);
}

export async function renderIconPng(): Promise<Uint8Array> {
  const size = 32;
  const rgba = new Uint8Array(size * size * 4);
  const cx = 16;
  const cy = 16;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      rgba[i] = 7;
      rgba[i + 1] = 8;
      rgba[i + 2] = 12;
      rgba[i + 3] = 255;
      const d = Math.abs(x - cx) + Math.abs(y - cy);
      if (d <= 10 && d >= 8) {
        rgba[i] = 143;
        rgba[i + 1] = 208;
        rgba[i + 2] = 255;
      } else if (d <= 4) {
        rgba[i] = 143;
        rgba[i + 1] = 208;
        rgba[i + 2] = 255;
      }
    }
  }
  return encodePng(size, size, rgba);
}

export async function renderMonogramPng(): Promise<Uint8Array> {
  return encodePng(256, 256, paintMonogram());
}

function paintMonogram(): Uint8Array {
  const size = 256;
  const rgba = new Uint8Array(size * size * 4);
  const cx = 128;
  const cy = 128;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const i = (y * size + x) * 4;
      if (d > 122) continue;
      if (d > 112) {
        rgba[i] = 143;
        rgba[i + 1] = 208;
        rgba[i + 2] = 255;
        rgba[i + 3] = 255;
      } else {
        rgba[i] = 16;
        rgba[i + 1] = 20;
        rgba[i + 2] = 28;
        rgba[i + 3] = 255;
      }
    }
  }
  const scale = 16;
  const gap = 10;
  const label = "BA";
  let width = 0;
  for (const ch of label) {
    const g = glyphOf(ch);
    width += (g ? g.rows[0].length : 5) * scale + gap;
  }
  width -= gap;
  let x = Math.round(cx - width / 2);
  const y = 78;
  for (const ch of label) {
    const g = glyphOf(ch);
    if (!g) continue;
    for (let row = 0; row < g.rows.length; row++) {
      for (let col = 0; col < g.rows[row].length; col++) {
        if (g.rows[row][col] !== "1") continue;
        for (let yy = 0; yy < scale - 2; yy++) {
          for (let xx = 0; xx < scale - 2; xx++) {
            const px = x + col * scale + xx;
            const py = y + row * scale + yy;
            if (px < 0 || py < 0 || px >= size || py >= size) continue;
            const i = (py * size + px) * 4;
            rgba[i] = 143;
            rgba[i + 1] = 208;
            rgba[i + 2] = 255;
            rgba[i + 3] = 255;
          }
        }
      }
    }
    x += g.rows[0].length * scale + gap;
  }
  return rgba;
}
