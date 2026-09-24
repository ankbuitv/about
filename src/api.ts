import { renderAdmin } from "./admin";
import { clearCookie, issueSession, readSession, sessionCookie } from "./auth";
import { CONFIG } from "./config";
import { excerpt, renderMarkdown } from "./markdown";
import { renderNotFound } from "./notfound";
import { renderIconPng, renderMonogramPng, renderOgPng } from "./og";
import { FAVICON_SVG } from "./favicon";
import { statsForOg } from "./github";
import {
  findLink,
  loadSite,
  MAX_LINKS,
  MAX_NOTE_BODY,
  newId,
  normalizeLinkSlug,
  normalizeLinkUrl,
  publicSite,
  saveSite,
  seed,
  slugify,
  storageConfigured,
  type ContactMessage,
  type Env,
  type GuestEntry,
  type Note,
  type ShortLink,
  type SiteData,
} from "./store";
import { cleanText, json, rateLimit, readJson, safeEqual, sameOrigin } from "./util";

let monogram: Uint8Array | null = null;

export async function avatarResponse(ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default;
  const key = new Request("https://ankbui-os.internal/avatar-photo");
  const hit = await cache.match(key);
  if (hit) return hit;
  try {
    const res = await fetch(CONFIG.avatarUpstream, {
      redirect: "follow",
      signal: AbortSignal.timeout(1800),
      headers: { "User-Agent": "ankbui-os", Accept: "image/*" },
    });
    const type = res.headers.get("Content-Type") ?? "";
    if (res.ok && type.startsWith("image/")) {
      const buf = await res.arrayBuffer();
      if (buf.byteLength > 200) {
        const out = new Response(buf, {
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
          },
        });
        ctx.waitUntil(cache.put(key, out.clone()));
        return out;
      }
    }
  } catch {
    // self-hosted monogram below
  }
  if (!monogram) monogram = await renderMonogramPng();
  return new Response(monogram.buffer.slice(monogram.byteOffset, monogram.byteOffset + monogram.byteLength) as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function faviconSvg(): Response {
  return new Response(FAVICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

let iconPng: Uint8Array | null = null;

export async function faviconPng(): Promise<Response> {
  if (!iconPng) iconPng = await renderIconPng();
  return new Response(iconPng.buffer.slice(iconPng.byteOffset, iconPng.byteOffset + iconPng.byteLength) as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function ogImage(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const stats = await statsForOg(env);
  const key = new Request(
    new URL(`/og-cache/${stats.repos}-${stats.stars}-${stats.followers}`, request.url).toString(),
  );
  const hit = await caches.default.match(key);
  if (hit) return hit;
  const png = await renderOgPng(stats);
  const bytes = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;
  const response = new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
  ctx.waitUntil(caches.default.put(key, response.clone()));
  return response;
}

export async function siteResponse(env: Env): Promise<Response> {
  const data = await loadSite(env);
  const pub = publicSite(data);
  return json({
    availability: pub.availability,
    now: pub.now,
    notes: pub.notes.map((n) => ({
      slug: n.slug,
      title: n.title,
      date: n.date,
      excerpt: excerpt(n.body),
    })),
    guestbook: pub.guestbook,
  });
}

export async function noteResponse(env: Env, slug: string): Promise<Response> {
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) return json({ ok: false }, 404);
  const data = await loadSite(env);
  const note = data.notes.find((n) => n.slug === slug && n.published !== false);
  if (!note) return json({ ok: false }, 404);
  return json({
    slug: note.slug,
    title: note.title,
    date: note.date,
    html: renderMarkdown(note.body),
  });
}

export async function guestbookPost(request: Request, env: Env): Promise<Response> {
  if (!sameOrigin(request)) return json({ ok: false, error: "origin" }, 403);
  if (!(await rateLimit(request, "guest", 5, 3600))) return json({ ok: false, error: "rate" }, 429);
  let body: Record<string, unknown>;
  try {
    body = (await readJson(request)) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  if (cleanText(body.website, 80)) return json({ ok: true });
  const name = cleanText(body.name, 40);
  const message = cleanText(body.message, 500);
  if (name.length < 1 || message.length < 2) return json({ ok: false, error: "invalid" }, 400);
  const data = await loadSite(env);
  const entry: GuestEntry = {
    id: newId(),
    name,
    message,
    createdAt: new Date().toISOString(),
  };
  data.guestbook.push(entry);
  const saved = await saveSite(env, data);
  if (!saved.durable) return json({ ok: false, error: "storage_unconfigured" }, 503);
  return json({ ok: true, entry: { id: entry.id, name, message, createdAt: entry.createdAt } });
}

export async function contactPost(request: Request, env: Env): Promise<Response> {
  if (!sameOrigin(request)) return json({ ok: false, error: "origin" }, 403);
  if (!(await rateLimit(request, "contact", 5, 3600))) return json({ ok: false, error: "rate" }, 429);
  let body: Record<string, unknown>;
  try {
    body = (await readJson(request)) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  if (cleanText(body.website, 80)) return json({ ok: true, delivered: "ignored" });
  const name = cleanText(body.name, 60);
  const email = cleanText(body.email, 120);
  const message = cleanText(body.message, 2000);
  if (name.length < 1 || message.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid" }, 400);
  }
  const item: ContactMessage = {
    id: newId(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };
  const channels: string[] = [];
  if (await sendDiscord(env, item)) channels.push("discord");
  if (await sendResend(env, item)) channels.push("email");
  const data = await loadSite(env);
  data.messages.unshift(item);
  const saved = await saveSite(env, data);
  if (saved.durable) channels.push("inbox");
  if (!channels.length) {
    return json({ ok: false, error: "delivery_unconfigured", email: CONFIG.email }, 503);
  }
  return json({ ok: true, delivered: channels });
}

async function sendDiscord(env: Env, item: ContactMessage): Promise<boolean> {
  const hook = env.DISCORD_WEBHOOK;
  if (!hook || !isDiscord(hook)) return false;
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "ANKBUI OS · contact",
            color: 0x8fd0ff,
            fields: [
              { name: "Name", value: item.name.slice(0, 200) },
              { name: "Email", value: item.email.slice(0, 200) },
              { name: "Message", value: item.message.slice(0, 1000) },
            ],
          },
        ],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function isDiscord(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "discord.com" || u.hostname === "discordapp.com") &&
      u.pathname.startsWith("/api/webhooks/")
    );
  } catch {
    return false;
  }
}

async function sendResend(env: Env, item: ContactMessage): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  const from = env.MAIL_FROM || "ANKBUI OS <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [CONFIG.email],
        reply_to: item.email,
        subject: `Contact from ${item.name}`,
        text: `${item.name} <${item.email}>\n\n${item.message}`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminPage(request: Request, env: Env): Promise<Response> {
  const authed = await readSession(request, env.ADMIN_PASSWORD);
  return new Response(renderAdmin(authed, !!env.ADMIN_PASSWORD), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

export async function adminLogin(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: "no_password" }, 503);
  if (!(await rateLimit(request, "login", 8, 900))) return json({ ok: false, error: "rate" }, 429);
  let body: Record<string, unknown> = {};
  try {
    body = (await readJson(request)) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!safeEqual(password, env.ADMIN_PASSWORD)) return json({ ok: false, error: "denied" }, 401);
  const token = await issueSession(env.ADMIN_PASSWORD);
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token, secure) });
}

export async function adminLogout(request: Request): Promise<Response> {
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, { "Set-Cookie": clearCookie(secure) });
}

export async function adminData(request: Request, env: Env): Promise<Response> {
  if (!(await readSession(request, env.ADMIN_PASSWORD))) return json({ ok: false }, 401);
  const data = await loadSite(env);
  return json({ ...data, durable: storageConfigured(env) });
}

export async function adminSave(request: Request, env: Env): Promise<Response> {
  if (!sameOrigin(request)) return json({ ok: false, error: "origin" }, 403);
  if (!(await readSession(request, env.ADMIN_PASSWORD))) return json({ ok: false }, 401);
  let body: Record<string, unknown>;
  try {
    body = (await readJson(request, 40_000)) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  const data = await loadSite(env);
  const kind = cleanText(body.kind, 32);
  try {
    applyAdmin(data, kind, body);
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : "invalid" }, 400);
  }
  const saved = await saveSite(env, data);
  const fresh = (await loadSite(env)) ?? seed();
  return json({ ...fresh, durable: saved.durable, warning: saved.error }, saved.ok ? 200 : 500);
}

function applyAdmin(data: SiteData, kind: string, body: Record<string, unknown>): void {
  if (kind === "status") {
    data.availability = body.availability === "busy" ? "busy" : "available";
    data.now = cleanText(body.now, 180);
    return;
  }
  if (kind === "note") {
    const title = cleanText(body.title, 120);
    const markdown = typeof body.body === "string" ? body.body.slice(0, MAX_NOTE_BODY) : "";
    if (!title || !markdown.trim()) throw new Error("invalid");
    const slug = slugify(cleanText(body.slug, 64) || title);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(cleanText(body.date, 10))
      ? cleanText(body.date, 10)
      : new Date().toISOString().slice(0, 10);
    const note: Note = {
      slug,
      title,
      date,
      body: markdown,
      published: body.published !== false,
    };
    const idx = data.notes.findIndex((n) => n.slug === slug);
    if (idx >= 0) data.notes[idx] = note;
    else data.notes.unshift(note);
    return;
  }
  if (kind === "note-delete") {
    const slug = slugify(cleanText(body.slug, 64));
    data.notes = data.notes.filter((n) => n.slug !== slug);
    return;
  }
  if (kind === "guest-hide" || kind === "guest-delete") {
    const id = cleanText(body.id, 32);
    if (kind === "guest-delete") data.guestbook = data.guestbook.filter((g) => g.id !== id);
    else {
      const row = data.guestbook.find((g) => g.id === id);
      if (row) row.hidden = body.hidden !== false;
    }
    return;
  }
  if (kind === "message-delete") {
    const id = cleanText(body.id, 32);
    data.messages = data.messages.filter((m) => m.id !== id);
    return;
  }
  if (kind === "link") {
    const slug = normalizeLinkSlug(cleanText(body.slug, 80));
    const url = normalizeLinkUrl(typeof body.url === "string" ? body.url : "");
    if (!slug) throw new Error("Tên không hợp lệ");
    if (!url) throw new Error("URL không hợp lệ");
    const previous = normalizeLinkSlug(cleanText(body.previous, 80));
    if (previous && previous.toLowerCase() !== slug.toLowerCase()) {
      data.links = data.links.filter((link) => link.slug.toLowerCase() !== previous.toLowerCase());
    }
    const existing = findLink(data.links, slug);
    const next: ShortLink = {
      slug,
      url,
      animate: body.animate === true,
      label: cleanText(body.label, 80),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    data.links = data.links.filter((link) => link.slug.toLowerCase() !== slug.toLowerCase());
    data.links.unshift(next);
    if (data.links.length > MAX_LINKS) data.links.length = MAX_LINKS;
    return;
  }
  if (kind === "link-delete") {
    const slug = normalizeLinkSlug(cleanText(body.slug, 80));
    if (!slug) throw new Error("Tên không hợp lệ");
    data.links = data.links.filter((link) => link.slug.toLowerCase() !== slug.toLowerCase());
    return;
  }
  throw new Error("unknown");
}

export function sitemap(origin: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}

export function robots(origin: string): Response {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /my/admin\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function htmlNotFound(pathname: string): Response {
  return new Response(renderNotFound(pathname), {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Robots-Tag": "noindex",
    },
  });
}
