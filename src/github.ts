import { CONFIG } from "./config";

export interface Env {
  GITHUB_TOKEN?: string;
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
  recent: {
    name: string;
    url: string;
    description: string;
    stars: number;
    language: string;
    pushedAt: string;
  }[];
  recentEvents: number;
  fetchedAt: string;
}

const CACHE_SECONDS = 300;

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

async function ghFetch(path: string, env: Env): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ankbui-os-worker",
  };
  if (env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;
  return fetch(`https://api.github.com${path}`, { headers });
}

async function buildStats(env: Env): Promise<GithubStats> {
  const [userRes, reposRes, eventsRes] = await Promise.all([
    ghFetch(`/users/${CONFIG.github}`, env),
    ghFetch(`/users/${CONFIG.github}/repos?per_page=100&sort=pushed`, env),
    ghFetch(`/users/${CONFIG.github}/events/public?per_page=30`, env).catch(
      () => null,
    ),
  ]);

  if (!userRes.ok) throw new Error(`GitHub user API: ${userRes.status}`);
  const user = (await userRes.json()) as GhUser;

  let repos: GhRepo[] = [];
  if (reposRes.ok) repos = (await reposRes.json()) as GhRepo[];

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

  const recent = repos.slice(0, 5).map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? "",
    stars: repo.stargazers_count,
    language: repo.language ?? "",
    pushedAt: repo.pushed_at,
  }));

  let recentEvents = 0;
  if (eventsRes && eventsRes.ok) {
    const events = (await eventsRes.json()) as unknown[];
    recentEvents = Array.isArray(events) ? events.length : 0;
  }

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
    recent,
    recentEvents,
    fetchedAt: new Date().toISOString(),
  };
}

export async function githubStatsResponse(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(
    new URL("/api/github", request.url).toString(),
    { method: "GET" },
  );

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const stats = await buildStats(env);
    const response = new Response(JSON.stringify(stats), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
