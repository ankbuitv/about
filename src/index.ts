import {
  adminData,
  adminLogin,
  adminLogout,
  adminPage,
  adminSave,
  avatarResponse,
  contactPost,
  faviconPng,
  faviconSvg,
  guestbookPost,
  htmlNotFound,
  noteResponse,
  ogImage,
  robots,
  siteResponse,
  sitemap,
} from "./api";
import { renderPage } from "./html";
import { githubStatsResponse, type Env } from "./github";
import { shortlinkResponse } from "./redirect";
import { json } from "./util";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/index.html" || path === "/index.htm") {
      return Response.redirect(new URL("/", url).toString(), 301);
    }

    if (path === "/my/admin" || path === "/my/admin/") {
      if (request.method === "GET") return adminPage(request, env);
      return methodNotAllowed();
    }
    if (path === "/my/admin/login" && request.method === "POST") return adminLogin(request, env);
    if (path === "/my/admin/logout" && request.method === "POST") return adminLogout(request);
    if (path === "/my/admin/api/data" && request.method === "GET") return adminData(request, env);
    if (path === "/my/admin/api/save" && request.method === "POST") return adminSave(request, env);

    if (path === "/") {
      return new Response(renderPage(url.origin), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      });
    }

    if (path === "/api/github" && request.method === "GET") return githubStatsResponse(request, env, ctx);
    if (path === "/api/site" && request.method === "GET") return siteResponse(env);
    if (path === "/api/guestbook" && request.method === "POST") return guestbookPost(request, env);
    if (path === "/api/contact" && request.method === "POST") return contactPost(request, env);
    if (path.startsWith("/api/notes/") && request.method === "GET") {
      let slug = path.slice("/api/notes/".length);
      try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
      return noteResponse(env, slug);
    }
    if (path.startsWith("/api/")) return json({ ok: false, error: "not_found", path }, 404);

    if (path === "/og.png" && (request.method === "GET" || request.method === "HEAD")) {
      return ogImage(request, env, ctx);
    }
    if (path === "/favicon.svg") return faviconSvg();
    if (path === "/favicon.ico" || path === "/favicon.png") return faviconPng();
    if (path === "/avatar" || path === "/apple-touch-icon.png" || path === "/apple-touch-icon-precomposed.png") {
      return avatarResponse(ctx);
    }
    if (path === "/sitemap.xml") return sitemap(url.origin);
    if (path === "/robots.txt") return robots(url.origin);
    if (path === "/l" || path.startsWith("/l/")) return shortlinkResponse(request, env);

    return htmlNotFound(path);
  },
};

function methodNotAllowed(): Response {
  return json({ ok: false, error: "method" }, 405);
}
