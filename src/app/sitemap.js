import { siteConfig } from "@/lib/seo";

export default function sitemap() {
  const baseUrl = siteConfig.url;

  const routes = [
    "",
    "/about",
    "/capabilities",
    "/industries",
    "/process",
    "/quality",
    "/infrastructure",
    "/contact",
    "/request-a-quote",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
