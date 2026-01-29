import type { MetadataRoute } from "next";

const BASE_URL = "https://open-resume.alexandreteixeira.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/resume-import`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/resume-builder`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/resume-parser`,
      lastModified: new Date(),
    },
  ];
}
