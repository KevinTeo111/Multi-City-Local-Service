import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const PRIVATE = ["/admin", "/cuenta", "/api", "/buscar", "/guardados"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [...PRIVATE, ...PRIVATE.filter((p) => p !== "/api").map((p) => `/en${p}`)] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
