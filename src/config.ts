export interface Project {
  name: string;
  description: string;
  long: string;
  site: string;
  repo: string;
  logo: string;
  stack: string[];
  status: "live" | "wip";
  shot: string;
}

export const CONFIG = {
  os: "ANKBUI OS",
  version: "3.2.0",
  name: "Bùi Đức Anh",
  username: "ankbui",
  github: "ankbuitv",
  repo: "about",
  role: "Backend Dev",
  location: "Nam cực",
  email: "admin@ankb.qzz.io",
  avatarUpstream: "https://github.com/ankbuitv.png?size=512",
  projects: [
    {
      name: "ANP",
      description: "Personal photo and video vault — store, back up, share.",
      long: "Vietnamese web app for personal photos and video. The Worker API keeps metadata in D1 and originals plus previews in a private Backblaze B2 bucket. Phase 1 is the web client and REST API. Media is not stored in Git.",
      site: "https://p.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/anp",
      logo: "https://p.ankb.qzz.io/favicon.ico",
      stack: ["TypeScript", "Cloudflare Workers", "D1", "Backblaze B2", "Vite"],
      status: "live",
      shot: "",
    },
    {
      name: "CHRTV",
      description: "Cloud IPTV gateway — playlist, tokenized M3U, HLS proxy.",
      long: "The M3U in the repo is the source of truth. CHRTV syncs it into D1, serves a tokenized playlist to IPTV players, proxies HLS, and falls back when a channel drops. /tv.m3u for players, /xem for the browser.",
      site: "https://cdn.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/chrtv",
      logo: "https://i.ibb.co/HDmcxzMK/Gemini-Generated-Image-v7i9yav7i9yav7i9-removebg-preview.png",
      stack: ["TypeScript", "Cloudflare Workers", "D1", "HLS"],
      status: "live",
      shot: "",
    },
    {
      name: "C++ IDE",
      description: "ide.ankb — dark, VS Code-style C++ IDE for web and desktop.",
      long: "One UI for the site and the Tauri desktop app. Monaco in the editor, g++ via an isolated runner, Judge0 on the web build with a same-origin fallback. Deployed on Cloudflare Pages.",
      site: "https://ide.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/ide",
      logo: "https://ide.ankb.qzz.io/favicon.ico",
      stack: ["TypeScript", "Monaco", "Node.js", "g++", "Tauri", "Cloudflare Pages"],
      status: "live",
      shot: "https://i.ibb.co/Gfg90tSr/ide-ankb.jpg",
    },
  ] as Project[],
};
