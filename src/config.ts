export interface Project {
  name: string;
  description: string;
  site: string;
  repo: string;
  logo: string;
}

export const CONFIG = {
  os: "ANKBUI OS",
  name: "Bùi Đức Anh",
  username: "ankbui",
  github: "ankbuitv",
  role: "Backend Dev",
  location: "Nam cực",
  email: "admin@ankb.qzz.io",
  avatarPrimary:
    "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/768927112_1327348487117615_7363871117459098063_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=102&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=e99d92&_nc_ohc=ZWPKbldqRdcQ7kNvwGxVAZV&_nc_oc=AdpEIxFscRWMLFnDASXkFg9mY42DS6_As_gWDcFWrX_OKlzQqe9SY_z-N630v_OhuQ0&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=2udExsf7Uaxpnioo95T3iA&_nc_ss=7a22e&oh=00_AQHpXDMWQtKtNShSRyIqmBeLGzCC6H2uf-3wq2hMSN0oOg&oe=6A82FC0F",
  avatarFallback: "https://github.com/ankbuitv.png?size=256",
  projects: [
    {
      name: "ANP",
      description: "Personal network panel — a self-hosted web tool.",
      site: "https://p.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/anp",
      logo: "https://p.ankb.qzz.io/favicon.ico",
    },
    {
      name: "CHRTV",
      description: "CHRTV — media & streaming experiments.",
      site: "https://cdn.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/chrtv",
      logo: "https://i.ibb.co/HDmcxzMK/Gemini-Generated-Image-v7i9yav7i9yav7i9-removebg-preview.png",
    },
    {
      name: "C++ IDE",
      description: "In-browser C++ development environment.",
      site: "https://ide.ankb.qzz.io",
      repo: "https://github.com/ankbuitv/ide",
      logo: "https://ide.ankb.qzz.io/favicon.ico",
    },
  ] as Project[],
};
