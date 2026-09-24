import seedJson from "../data/site.json";
import { CONFIG } from "./config";
import { base64ToString, stringToBase64 } from "./util";

export interface Note {
  slug: string;
  title: string;
  date: string;
  body: string;
  published: boolean;
}

export interface GuestEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  hidden?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ShortLink {
  slug: string;
  url: string;
  animate: boolean;
  label: string;
  createdAt: string;
}

export interface SiteData {
  availability: "available" | "busy";
  now: string;
  notes: Note[];
  guestbook: GuestEntry[];
  messages: ContactMessage[];
  links: ShortLink[];
  updatedAt: string;
}

export interface Env {
  GITHUB_TOKEN?: string;
  ADMIN_PASSWORD?: string;
  DISCORD_WEBHOOK?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  GITHUB_BRANCH?: string;
  DATA?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

const FILE = "data/site.json";
const KV_KEY = "site";
const MAX_NOTES = 80;
const MAX_NOTE_BODY = 20000;
const MAX_GUEST = 200;
const MAX_MESSAGES = 100;
const MAX_LINKS = 200;

let memory: SiteData | null = null;
let memorySha: string | null = null;
let freshUntil = 0;

function asSite(value: unknown): SiteData | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<SiteData>;
  const availability = raw.availability === "busy" ? "busy" : "available";
  const notes = Array.isArray(raw.notes) ? raw.notes.filter(isNote).slice(0, MAX_NOTES) : [];
  const guestbook = Array.isArray(raw.guestbook)
    ? raw.guestbook.filter(isGuest).slice(0, MAX_GUEST)
    : [];
  const messages = Array.isArray(raw.messages)
    ? raw.messages.filter(isMessage).slice(0, MAX_MESSAGES)
    : [];
  return {
    availability,
    now: typeof raw.now === "string" ? raw.now.slice(0, 180) : seed().now,
    notes,
    guestbook,
    messages,
    links: asLinks(raw.links),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== "object") return false;
  const n = value as Note;
  return (
    typeof n.slug === "string" &&
    typeof n.title === "string" &&
    typeof n.body === "string" &&
    typeof n.date === "string"
  );
}

function isGuest(value: unknown): value is GuestEntry {
  if (!value || typeof value !== "object") return false;
  const n = value as GuestEntry;
  return typeof n.id === "string" && typeof n.name === "string" && typeof n.message === "string";
}

function isMessage(value: unknown): value is ContactMessage {
  if (!value || typeof value !== "object") return false;
  const n = value as ContactMessage;
  return typeof n.id === "string" && typeof n.message === "string";
}

export function normalizeLinkSlug(value: string): string | null {
  let raw = value.normalize("NFC").trim();
  if (!raw) return null;
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return null;
  }
  raw = raw.normalize("NFC").trim().replace(/^\/+|\/+$/g, "");
  if (!raw || raw.length > 64) return null;
  if (raw === "." || raw === ".." || raw.includes("..")) return null;
  if (/[\s/?#\\]/.test(raw) || /[\u0000-\u001f\u007f]/.test(raw)) return null;
  if (!/^[\p{L}\p{N}._~-]+$/u.test(raw)) return null;
  if (raw.startsWith(".") || raw.endsWith(".")) return null;
  return raw;
}

export function normalizeLinkUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw || raw.length > 2000 || /[\u0000-\u001f\u007f]/.test(raw)) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!url.hostname) return null;
  url.username = "";
  url.password = "";
  return url.toString();
}

function asLink(value: unknown): ShortLink | null {
  if (!value || typeof value !== "object") return null;
  const n = value as Partial<ShortLink>;
  const slug = normalizeLinkSlug(typeof n.slug === "string" ? n.slug : "");
  const url = normalizeLinkUrl(typeof n.url === "string" ? n.url : "");
  if (!slug || !url) return null;
  return {
    slug,
    url,
    animate: n.animate === true,
    label:
      typeof n.label === "string"
        ? n.label.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80)
        : "",
    createdAt: typeof n.createdAt === "string" ? n.createdAt.slice(0, 40) : new Date().toISOString(),
  };
}

function asLinks(value: unknown): ShortLink[] {
  if (!Array.isArray(value)) return [];
  const links: ShortLink[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const link = asLink(item);
    if (!link) continue;
    const key = link.slug.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    links.push(link);
    if (links.length >= MAX_LINKS) break;
  }
  return links;
}

export function findLink(links: ShortLink[], slug: string): ShortLink | null {
  const exact = links.find((link) => link.slug === slug);
  if (exact) return exact;
  const lower = slug.toLowerCase();
  const hits = links.filter((link) => link.slug.toLowerCase() === lower);
  return hits.length === 1 ? hits[0] : null;
}

export function mergeLinkQuery(target: string, incoming: URL): string {
  const dest = new URL(target);
  incoming.searchParams.forEach((value, key) => {
    if (!dest.searchParams.has(key)) dest.searchParams.append(key, value);
  });
  return dest.toString();
}

export function seed(): SiteData {
  return asSite(seedJson) ?? {
    availability: "available",
    now: "",
    notes: [],
    guestbook: [],
    messages: [],
    links: [],
    updatedAt: new Date().toISOString(),
  };
}

function branch(env: Env): string {
  return env.GITHUB_BRANCH || "main";
}

function repoPath(): string {
  return `${CONFIG.github}/${CONFIG.repo}`;
}

async function readGithub(env: Env): Promise<{ data: SiteData; sha: string } | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ankbui-os",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const url = `https://api.github.com/repos/${repoPath()}/contents/${FILE}?ref=${encodeURIComponent(branch(env))}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(2500) });
  if (!res.ok) return null;
  const payload = (await res.json()) as { content?: string; sha?: string };
  if (!payload.content || !payload.sha) return null;
  try {
    const data = asSite(JSON.parse(base64ToString(payload.content)));
    if (!data) return null;
    return { data, sha: payload.sha };
  } catch {
    return null;
  }
}

export function storageConfigured(env: Env): boolean {
  return !!(env.DATA || env.GITHUB_TOKEN);
}

export async function loadSite(env: Env): Promise<SiteData> {
  if (memory && Date.now() < freshUntil) return memory;
  try {
    if (env.DATA) {
      const raw = await env.DATA.get(KV_KEY);
      const parsed = raw ? asSite(JSON.parse(raw)) : null;
      if (parsed) {
        memory = parsed;
        return parsed;
      }
    }
  } catch {
    // fall through
  }
  try {
    const remote = await readGithub(env);
    if (remote) {
      memory = remote.data;
      memorySha = remote.sha;
      freshUntil = Date.now() + 20_000;
      return remote.data;
    }
  } catch {
    // fall through
  }
  if (!memory) memory = seed();
  freshUntil = Date.now() + 20_000;
  return memory;
}

export interface SaveResult {
  ok: boolean;
  durable: boolean;
  error?: string;
}

export async function saveSite(env: Env, next: SiteData): Promise<SaveResult> {
  const data = asSite({ ...next, updatedAt: new Date().toISOString() });
  if (!data) return { ok: false, durable: false, error: "invalid" };
  if (JSON.stringify(data).length > 400_000) {
    return { ok: false, durable: false, error: "too_large" };
  }
  memory = data;
  freshUntil = Date.now() + 60_000;
  let durable = false;
  let error: string | undefined;

  try {
    if (env.DATA) {
      await env.DATA.put(KV_KEY, JSON.stringify(data));
      durable = true;
    }
  } catch {
    error = "kv_failed";
  }

  if (env.GITHUB_TOKEN) {
    try {
      const current = memorySha ? { sha: memorySha } : await readGithub(env);
      const sha = current && "sha" in current ? current.sha : undefined;
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "ankbui-os",
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      };
      const body: Record<string, string> = {
        message: "site: update from admin",
        content: stringToBase64(JSON.stringify(data, null, 2) + "\n"),
        branch: branch(env),
      };
      if (sha) body.sha = sha;
      const res = await fetch(`https://api.github.com/repos/${repoPath()}/contents/${FILE}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        error = `github_${res.status}`;
      } else {
        const saved = (await res.json()) as { content?: { sha?: string } };
        memorySha = saved.content?.sha ?? memorySha;
        durable = true;
      }
    } catch {
      error = error ?? "github_failed";
    }
  } else if (!durable) {
    error = "storage_unconfigured";
  }

  return { ok: true, durable, error: durable ? undefined : error };
}

export function publicSite(data: SiteData) {
  return {
    availability: data.availability,
    now: data.now,
    notes: data.notes
      .filter((n) => n.published !== false)
      .map((n) => ({
        slug: n.slug,
        title: n.title,
        date: n.date,
        body: n.body,
      })),
    guestbook: data.guestbook
      .filter((g) => !g.hidden)
      .slice()
      .reverse()
      .slice(0, 80)
      .map((g) => ({
        id: g.id,
        name: g.name,
        message: g.message,
        createdAt: g.createdAt,
      })),
  };
}

export function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || "note";
}

export function newId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export { MAX_LINKS, MAX_NOTE_BODY };
