const COOKIE = "ankbui_admin";

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(value: string): string {
  const pad = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "===".slice((pad.length + 3) % 4);
  return atob(padded);
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(new Uint8Array(sig));
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ba.length, bb.length, 1);
  let diff = ba.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (ba[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

export async function issueSession(secret: string): Promise<string> {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + 7 * 864e5 })));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function readSession(request: Request, secret: string | undefined): Promise<boolean> {
  if (!secret) return false;
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(secret, payload);
  if (!safeEqual(sig, expected)) return false;
  try {
    const data = JSON.parse(fromB64url(payload)) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/my/admin",
    "SameSite=Strict",
    "Max-Age=604800",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookie(secure: boolean): string {
  const parts = [`${COOKIE}=`, "HttpOnly", "Path=/my/admin", "SameSite=Strict", "Max-Age=0"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
