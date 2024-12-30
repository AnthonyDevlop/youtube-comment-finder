import { MetadataRoute } from "next";
import { websiteDomain } from "@/utils/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: websiteDomain,
      lastModified: new Date("2024-07-10"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${websiteDomain}/about-us`,
      lastModified: new Date("2024-07-10"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${websiteDomain}/policy`,
      lastModified: new Date("2024-07-10"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
