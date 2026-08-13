interface Env {
  GITHUB_TOKEN?: string;
}

interface Project {
  name: string;
  description: string;
  site: string;
  repo: string;
  logo: string;
}

const CONFIG = {
  name: "Bùi Đức Anh",
  username: "ankbui",
  github: "ankbuitv",
  bio: "Backend Dev",
  location: "Nam cực",
  email: "admin@ankb.qzz.io",
  avatar:
    "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/768927112_1327348487117615_7363871117459098063_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=102&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=e99d92&_nc_ohc=ZWPKbldqRdcQ7kNvwGxVAZV&_nc_oc=AdpEIxFscRWMLFnDASXkFg9mY42DS6_As_gWDcFWrX_OKlzQqe9SY_z-N630v_OhuQ0&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=2udExsf7Uaxpnioo95T3iA&_nc_ss=7a22e&oh=00_AQHpXDMWQtKtNShSRyIqmBeLGzCC6H2uf-3wq2hMSN0oOg&oe=6A82FC0F",
  projects: [
    {
      name: "ANP",
      description: "A personal web project by ankbuitv.",
      site: "https://p.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/anp",
      logo: "https://p.ankb.qzz.io",
    },
    {
      name: "CHRTV",
      description: "CHRTV streaming platform.",
      site: "https://cdn.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/chrtv",
      logo:
        "https://i.ibb.co/HDmcxzMK/Gemini-Generated-Image-v7i9yav7i9yav7i9-removebg-preview.png",
    },
    {
      name: "C++ IDE",
      description: "Online C++ development environment.",
      site: "https://ide.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/ide",
      logo: "https://ide.ankb.qzz.io",
    },
  ] as Project[],
};

const CACHE_SECONDS = 300;

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function githubRequest(path: string, env: Env): Promise<Response> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": "ankbui-bio-worker",
  });

  if (env.GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
  }

  return fetch(`https://api.github.com${path}`, {
    headers,
  });
}

async function getGithubStats(env: Env) {
  try {
    const userResponse = await githubRequest(`/users/${CONFIG.github}`, env);
    if (!userResponse.ok) throw new Error(`GitHub API: ${userResponse.status}`);

    const user = await userResponse.json<{
      public_repos: number;
      followers: number;
      following: number;
      public_gists: number;
      html_url: string;
    }>();

    const repoResponse = await githubRequest(
      `/users/${CONFIG.github}/repos?per_page=100&sort=updated`,
      env
    );

    let stars = 0;
    let forks = 0;

    if (repoResponse.ok) {
      const repos = await repoResponse.json<
        Array<{ stargazers_count: number; forks_count: number }>
      >();

      for (const repo of repos) {
        stars += repo.stargazers_count || 0;
        forks += repo.forks_count || 0;
      }
    }

    return {
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      stars,
      forks,
      gists: user.public_gists,
      githubUrl: user.html_url,
      live: true,
    };
  } catch {
    return {
      repos: 0,
      followers: 0,
      following: 0,
      stars: 0,
      forks: 0,
      gists: 0,
      githubUrl: `https://github.com/${CONFIG.github}`,
      live: false,
    };
  }
}

async function resolveWebsiteLogo(
  website: string,
  fallback: string
): Promise<string> {
  try {
    const response = await fetch(website, {
      headers: {
        "User-Agent": "Mozilla/5.0 ankbui-bio-worker",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) return fallback;

    const html = await response.text();

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i,
    ];

    for (const regex of patterns) {
      const match = html.match(regex);
      if (match?.[1]) {
        try {
          return new URL(match[1], website).href;
        } catch {}
      }
    }

    return fallback;
  } catch {
    return fallback;
  }
}

async function getProjectLogos(): Promise<Project[]> {
  return Promise.all(
    CONFIG.projects.map(async (project) => {
      if (
        project.logo.startsWith("https://p.") ||
        project.logo.startsWith("https://ide.")
      ) {
        const hostname = new URL(project.site).hostname;
        return {
          ...project,
          logo: await resolveWebsiteLogo(
            project.logo,
            `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
          ),
        };
      }

      return project;
    })
  );
}

function projectCard(project: Project): string {
  const fallback =
    `https://www.google.com/s2/favicons?domain=${new URL(project.site).hostname}&sz=128`;

  return `
    <article class="project-card">
      <div class="project-main">
        <div class="project-logo">
          <img src="${escapeHTML(project.logo)}"
               alt="${escapeHTML(project.name)} logo"
               loading="lazy"
               referrerpolicy="no-referrer"
               onerror="this.onerror=null;this.src='${fallback}'">
        </div>
        <div class="project-info">
          <h3>${escapeHTML(project.name)}</h3>
          <p>${escapeHTML(project.description)}</p>
        </div>
      </div>
      <div class="project-actions">
        <a class="project-site" href="${escapeHTML(project.site)}"
           target="_blank" rel="noopener noreferrer">Open ↗</a>
        <a class="project-repo" href="${escapeHTML(project.repo)}"
           target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </article>
  `;
}

function renderPage(
  stats: Awaited<ReturnType<typeof getGithubStats>>,
  projects: Project[]
): string {
  const formatted = (value: number) =>
    new Intl.NumberFormat("en-US", {
      notation: value >= 1000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(value);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(CONFIG.name)} — ${escapeHTML(CONFIG.bio)}</title>
<meta name="description" content="${escapeHTML(
    `${CONFIG.name} — ${CONFIG.bio}. GitHub, projects and contact information.`
  )}">
<meta name="theme-color" content="#06070a">
<meta property="og:title" content="${escapeHTML(CONFIG.name)}">
<meta property="og:description" content="${escapeHTML(CONFIG.bio)}">
<meta property="og:image" content="${escapeHTML(CONFIG.avatar)}">
<link rel="icon" href="${escapeHTML(CONFIG.avatar)}">

<style>
:root{color-scheme:dark;--bg:#06070a;--card:rgba(255,255,255,.055);--hover:rgba(255,255,255,.085);--border:rgba(255,255,255,.11);--text:#f5f7fb;--muted:#9298a6}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;min-height:100vh;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 50% -10%,rgba(255,255,255,.09),transparent 35%),radial-gradient(circle at 10% 70%,rgba(100,120,255,.055),transparent 30%),var(--bg)}
body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(to bottom,black,transparent 80%)}
a{color:inherit;text-decoration:none}
.page{width:min(720px,calc(100% - 32px));margin:auto;padding:72px 0 60px}
.profile{display:flex;flex-direction:column;align-items:center;text-align:center;animation:fadeUp .7s ease both}
.avatar-wrap{position:relative;width:112px;height:112px;margin-bottom:22px}
.avatar-wrap:before{content:"";position:absolute;inset:-8px;border-radius:50%;background:conic-gradient(from 0deg,transparent,rgba(255,255,255,.45),transparent);filter:blur(8px);opacity:.45;animation:spinGlow 7s linear infinite}
.avatar{position:relative;width:112px;height:112px;object-fit:cover;border-radius:50%;border:1px solid rgba(255,255,255,.18);box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 0 5px rgba(255,255,255,.025);transition:transform .85s cubic-bezier(.16,1,.3,1),box-shadow .4s ease}
.avatar:hover{transform:scale(1.08) rotate(720deg);box-shadow:0 25px 70px rgba(0,0,0,.65),0 0 0 6px rgba(255,255,255,.06)}
h1{margin:0;font-size:clamp(30px,7vw,44px);line-height:1.05;letter-spacing:-1.7px;font-weight:800}
.username{margin-top:9px;color:var(--muted);font-size:15px}
.bio{margin-top:16px;font-size:17px;font-weight:500}
.meta{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:14px}
.pill{padding:7px 11px;border:1px solid var(--border);border-radius:999px;background:rgba(255,255,255,.035);color:var(--muted);font-size:12px}
.section{margin-top:34px;animation:fadeUp .7s ease both;animation-delay:.08s}
.section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}
.github-link{color:#dce0e8;font-size:12px;text-transform:none;letter-spacing:0}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.stat{padding:18px 12px;border:1px solid var(--border);border-radius:18px;background:var(--card);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 14px 40px rgba(0,0,0,.45);transition:transform .25s ease,background .25s ease}
.stat:hover{transform:translateY(-3px);background:var(--hover)}
.stat-value{font-size:21px;font-weight:800}.stat-label{margin-top:5px;color:var(--muted);font-size:11px}
.projects{display:flex;flex-direction:column;gap:10px}
.project-card{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px;border:1px solid var(--border);border-radius:20px;background:var(--card);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 14px 40px rgba(0,0,0,.45);transition:transform .25s ease,background .25s ease,border-color .25s ease}
.project-card:hover{transform:translateY(-4px);background:var(--hover);border-color:rgba(255,255,255,.18)}
.project-main{display:flex;align-items:center;gap:13px;min-width:0}.project-logo{flex:0 0 52px;width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);overflow:hidden}.project-logo img{width:34px;height:34px;object-fit:contain;border-radius:9px}
.project-info{min-width:0}.project-info h3{margin:0;font-size:15px;font-weight:750}.project-info p{margin:5px 0 0;color:var(--muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.project-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}.project-site,.project-repo{border-radius:11px;padding:9px 12px;font-size:12px;font-weight:700;transition:transform .2s ease,background .2s ease}.project-site{color:#0a0b0f;background:#f5f5f5}.project-site:hover{transform:translateY(-1px);background:white}.project-repo{color:var(--muted);border:1px solid var(--border)}.project-repo:hover{color:var(--text);background:rgba(255,255,255,.06)}
.contact{display:flex;gap:9px}.contact-link{flex:1;display:flex;justify-content:center;align-items:center;padding:13px;border:1px solid var(--border);border-radius:15px;background:var(--card);color:var(--muted);font-size:13px;font-weight:650;transition:transform .2s ease,background .2s ease,color .2s ease}.contact-link:hover{transform:translateY(-3px);background:var(--hover);color:var(--text)}
footer{margin-top:45px;text-align:center;color:#555b67;font-size:11px}.status{display:inline-flex;align-items:center;gap:6px}.status-dot{width:6px;height:6px;border-radius:50%;background:#79e58c;box-shadow:0 0 12px rgba(121,229,140,.7)}
@keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}@keyframes spinGlow{to{transform:rotate(360deg)}}
@media(max-width:600px){.page{padding-top:48px}.stats{grid-template-columns:repeat(2,1fr)}.project-card{align-items:flex-start}.project-actions{flex-direction:column}.project-site,.project-repo{width:74px;text-align:center}.contact{flex-direction:column}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.avatar:hover{transform:scale(1.04)}}
</style>
</head>
<body>
<main class="page">
<section class="profile">
<div class="avatar-wrap"><img class="avatar" src="${escapeHTML(CONFIG.avatar)}" alt="${escapeHTML(CONFIG.name)}" referrerpolicy="no-referrer"></div>
<h1>${escapeHTML(CONFIG.name)}</h1>
<div class="username">@${escapeHTML(CONFIG.username)}</div>
<div class="bio">${escapeHTML(CONFIG.bio)}</div>
<div class="meta"><span class="pill">📍 ${escapeHTML(CONFIG.location)}</span><a class="pill" href="mailto:${escapeHTML(CONFIG.email)}">✉ ${escapeHTML(CONFIG.email)}</a></div>
</section>

<section class="section">
<div class="section-title"><span>GitHub</span><a class="github-link" href="https://github.com/${escapeHTML(CONFIG.github)}" target="_blank" rel="noopener noreferrer">@${escapeHTML(CONFIG.github)} ↗</a></div>
<div class="stats">
<div class="stat"><div class="stat-value">${formatted(stats.repos)}</div><div class="stat-label">Repositories</div></div>
<div class="stat"><div class="stat-value">${formatted(stats.stars)}</div><div class="stat-label">Stars</div></div>
<div class="stat"><div class="stat-value">${formatted(stats.followers)}</div><div class="stat-label">Followers</div></div>
<div class="stat"><div class="stat-value">${formatted(stats.forks)}</div><div class="stat-label">Forks</div></div>
</div>
</section>

<section class="section">
<div class="section-title"><span>Projects</span></div>
<div class="projects">${projects.map(projectCard).join("")}</div>
</section>

<section class="section">
<div class="section-title"><span>Contact</span></div>
<div class="contact">
<a class="contact-link" href="mailto:${escapeHTML(CONFIG.email)}">Email</a>
<a class="contact-link" href="https://github.com/${escapeHTML(CONFIG.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
</div>
</section>

<footer><span class="status"><span class="status-dot"></span>Built on Cloudflare Workers</span></footer>
</main>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/github") {
      const stats = await getGithubStats(env);
      return new Response(JSON.stringify(stats), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "ankbui-bio",
          timestamp: new Date().toISOString(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const [stats, projects] = await Promise.all([
      getGithubStats(env),
      getProjectLogos(),
    ]);

    return new Response(renderPage(stats, projects), {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  },
};
