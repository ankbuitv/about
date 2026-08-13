import { CONFIG } from "./config";
import { renderPage } from "./html";
import { githubStatsResponse, type Env } from "./github";

async function avatarResponse(): Promise<Response> {
  const sources = [CONFIG.avatarPrimary, CONFIG.avatarFallback];
  for (const src of sources) {
    try {
      const res = await fetch(src, {
        cf: { cacheTtl: 86400, cacheEverything: true },
      } as RequestInit);
      if (res.ok) {
        return new Response(res.body, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      // try next source
    }
  }
  return new Response("avatar unavailable", { status: 404 });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/":
        return new Response(renderPage(url.origin), {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        });

      case "/api/github":
        return githubStatsResponse(request, env, ctx);

      case "/avatar":
        return avatarResponse();

      case "/robots.txt":
        return new Response("User-agent: *\nAllow: /\n", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });

      default:
        return new Response("Not found", { status: 404 });
    }
  },
};
