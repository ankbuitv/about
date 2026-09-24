import { CONFIG } from "./config";
import type { Env } from "./store";

export type { Env };

export interface RepoCard {
  name: string;
  url: string;
  description: string;
  stars: number;
  language: string;
  pushedAt: string;
}

export interface ContribCell {
  date: string;
  count: number;
  level: number;
  row: number;
  col: number;
}

export interface StarPoint {
  date: string;
  stars: number;
}

export interface GithubStats {
  ok: boolean;
  user: {
    repos: number;
    followers: number;
    following: number;
    gists: number;
    createdAt: string;
  };
  stars: number;
  forks: number;
  languages: { name: string; count: number }[];
  recent: RepoCard[];
  pinned: RepoCard[];
  contributions: ContribCell[];
  totalContributions: number;
  starHistory: StarPoint[];
  recentEvents: number;
  fetchedAt: string;
}

const CACHE_SECONDS = 3600;
const STALE_SECONDS = 604800;
const PIN_FALLBACK = ["chrtv", "ide", "anp", "about", "AES", "link"];

interface GhUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  created_at: string;
}

interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
}

function ghHeaders(env: Env, accept = "application/vnd.github+json"): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": "ankbui-os-worker",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return headers;
}

async function ghFetch(path: string, env: Env, accept?: string): Promise<Response> {
  return fetch(`https://api.github.com${path}`, { headers: ghHeaders(env, accept) });
}

export function parseContributions(html: string): ContribCell[] {
  const cells: ContribCell[] = [];
  const re = /data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-(\d+)-(\d+))" data-level="(\d)"/g;
  const tips = new Map<string, number>();
  for (const tip of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[^"]+)"[^>]*>\s*([^<]+)/g)) {
    const text = tip[2].trim();
    tips.set(tip[1], text.startsWith("No ") ? 0 : Number.parseInt(text, 10) || 0);
  }
  for (const m of html.matchAll(re)) {
    cells.push({
      date: m[1],
      row: Number(m[3]),
      col: Number(m[4]),
      level: Number(m[5]),
      count: tips.get(m[2]) ?? 0,
    });
  }
  cells.sort((a, b) => a.col - b.col || a.row - b.row);
  return cells;
}

export function parsePinned(html: string): string[] {
  const names: string[] = [];
  const re = /pinned-item-list-item[\s\S]{0,700}?\/ankbuitv\/([A-Za-z0-9_.-]+)"/g;
  for (const m of html.matchAll(re)) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  return names.slice(0, 6);
}

async function pageText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 ankbui-os",
        Accept: "text/html",
      },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function toCard(repo: GhRepo): RepoCard {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? "",
    stars: repo.stargazers_count,
    language: repo.language ?? "",
    pushedAt: repo.pushed_at,
  };
}

async function allRepos(env: Env): Promise<GhRepo[]> {
  const all: GhRepo[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await ghFetch(
      `/users/${CONFIG.github}/repos?per_page=100&sort=pushed&page=${page}`,
      env,
    );
    if (!res.ok) break;
    const batch = (await res.json()) as GhRepo[];
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  all.sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : -1));
  return all;
}

async function starHistory(env: Env, repos: GhRepo[]): Promise<StarPoint[]> {
  const starred = repos.filter((r) => r.stargazers_count > 0).slice(0, 8);
  const times: string[] = [];
  await Promise.all(
    starred.map(async (repo) => {
      try {
        const res = await ghFetch(
          `/repos/${CONFIG.github}/${repo.name}/stargazers?per_page=100`,
          env,
          "application/vnd.github.star+json",
        );
        if (!res.ok) return;
        const rows = (await res.json()) as { starred_at?: string }[];
        if (!Array.isArray(rows)) return;
        for (const row of rows) if (row.starred_at) times.push(row.starred_at);
      } catch {
        // skip this repo
      }
    }),
  );
  times.sort();
  if (!times.length) return [];
  const start = times[0].slice(0, 7);
  const now = new Date().toISOString().slice(0, 7);
  const points: StarPoint[] = [{ date: monthStart(prevMonth(start)), stars: 0 }];
  let cursor = start;
  let seen = 0;
  let idx = 0;
  while (cursor <= now && points.length < 36) {
    while (idx < times.length && times[idx].slice(0, 7) <= cursor) {
      seen++;
      idx++;
    }
    points.push({ date: `${cursor}-01`, stars: seen });
    cursor = nextMonth(cursor);
  }
  if (points[points.length - 1]?.stars !== times.length) {
    points.push({ date: new Date().toISOString().slice(0, 10), stars: times.length });
  }
  return points;
}

function prevMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthStart(ym: string): string {
  return `${ym}-01`;
}

async function buildStats(env: Env): Promise<GithubStats> {
  const [userRes, repos, contribHtml, profileHtml] = await Promise.all([
    ghFetch(`/users/${CONFIG.github}`, env),
    allRepos(env),
    pageText(`https://github.com/users/${CONFIG.github}/contributions`),
    pageText(`https://github.com/${CONFIG.github}`),
  ]);
  if (!userRes.ok) throw new Error(`GitHub user API: ${userRes.status}`);
  const user = (await userRes.json()) as GhUser;

  let stars = 0;
  let forks = 0;
  const langCount = new Map<string, number>();
  for (const repo of repos) {
    stars += repo.stargazers_count;
    forks += repo.forks_count;
    if (repo.language && !repo.fork) {
      langCount.set(repo.language, (langCount.get(repo.language) ?? 0) + 1);
    }
  }
  const languages = [...langCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  const pinNames = profileHtml ? parsePinned(profileHtml) : [];
  const pinList = pinNames.length ? pinNames : PIN_FALLBACK;
  const pinned = pinList
    .map((name) => byName.get(name.toLowerCase()))
    .filter((repo): repo is GhRepo => !!repo)
    .map(toCard);

  const contributions = contribHtml ? parseContributions(contribHtml) : [];
  const totalContributions = contributions.reduce((n, cell) => n + cell.count, 0);
  const history = await starHistory(env, repos);

  return {
    ok: true,
    user: {
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      gists: user.public_gists,
      createdAt: user.created_at,
    },
    stars,
    forks,
    languages,
    recent: repos.slice(0, 5).map(toCard),
    pinned,
    contributions,
    totalContributions,
    starHistory: history,
    recentEvents: 0,
    fetchedAt: new Date().toISOString(),
  };
}

export async function githubStatsResponse(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const cache = caches.default;
  const freshKey = new Request(new URL("/api/github", request.url).toString(), { method: "GET" });
  const staleKey = new Request(new URL("/api/github-last-good", request.url).toString(), {
    method: "GET",
  });
  const cached = await cache.match(freshKey);
  if (cached) return cached;

  try {
    const stats = await buildStats(env);
    const body = JSON.stringify(stats);
    const response = new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
      },
    });
    const staleCopy = new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, s-maxage=${STALE_SECONDS}`,
      },
    });
    ctx.waitUntil(Promise.all([cache.put(freshKey, response.clone()), cache.put(staleKey, staleCopy)]));
    return response;
  } catch {
    const stale = await cache.match(staleKey);
    if (stale) {
      const body = await stale.text();
      return new Response(body, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=60",
          "X-Stats-Stale": "1",
        },
      });
    }
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}

export async function statsForOg(env: Env): Promise<OgLite> {
  try {
    const res = await ghFetch(`/users/${CONFIG.github}`, env);
    if (!res.ok) return { repos: 0, stars: 0, followers: 0 };
    const user = (await res.json()) as GhUser;
    const repos = await allRepos(env);
    const stars = repos.reduce((n, r) => n + r.stargazers_count, 0);
    return { repos: user.public_repos, stars, followers: user.followers };
  } catch {
    return { repos: 0, stars: 0, followers: 0 };
  }
}

export interface OgLite {
  repos: number;
  stars: number;
  followers: number;
}
