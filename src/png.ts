const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out[4] = type.charCodeAt(0);
  out[5] = type.charCodeAt(1);
  out[6] = type.charCodeAt(2);
  out[7] = type.charCodeAt(3);
  out.set(data, 8);
  const crcBuf = out.subarray(4, 8 + data.length);
  view.setUint32(8 + data.length, crc32(crcBuf));
  return out;
}

function copyBytes(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function zlib(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([copyBytes(data)]).stream().pipeThrough(new CompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodePng(width: number, height: number, rgba: Uint8Array): Promise<Uint8Array> {
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw.set(rgba.subarray(y * stride, y * stride + stride), y * (stride + 1) + 1);
  }
  const compressed = await zlib(raw);
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const parts = [sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", new Uint8Array())];
  const size = parts.reduce((n, p) => n + p.length, 0);
  const png = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  return png;
}

export function fillRect(
  rgba: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number, number],
): void {
  const x0 = Math.max(0, x);
  const y0 = Math.max(0, y);
  const x1 = Math.min(width, x + w);
  const y1 = Math.min(height, y + h);
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      blend(rgba, width, xx, yy, color);
    }
  }
}

export function blend(
  rgba: Uint8Array,
  width: number,
  x: number,
  y: number,
  color: [number, number, number, number],
): void {
  const i = (y * width + x) * 4;
  const a = color[3] / 255;
  const inv = 1 - a;
  rgba[i] = Math.round(color[0] * a + rgba[i] * inv);
  rgba[i + 1] = Math.round(color[1] * a + rgba[i + 1] * inv);
  rgba[i + 2] = Math.round(color[2] * a + rgba[i + 2] * inv);
  rgba[i + 3] = 255;
}
