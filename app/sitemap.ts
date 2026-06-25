import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://imagetools.app";
  const routes = [
    "",
    "/compress",
    "/resize",
    "/convert",
    "/crop",
    "/base64",
    "/color-picker",
    "/exif",
    "/watermark",
    "/rename",
    "/remove-bg",
    "/about",
    "/contact",
    "/privacy",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
